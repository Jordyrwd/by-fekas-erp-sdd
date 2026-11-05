import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { z } from 'zod';
import { InventoryRepository } from './repository.mjs';
import { quantity } from './domain/stock.mjs';

const amount = (zero = false) => z.number().refine(n => { try { quantity(n, zero); return true; } catch { return false; } }, 'Cantidad inválida: máximo 1000000 y 3 decimales');
const identifier = z.string().regex(/^[a-f0-9]{24}$/i);
export const productSchema = z.object({ sku: z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{2,30}$/), nombre: z.string().trim().min(2).max(100), categoria: z.enum(['balanceado', 'probiotico', 'quimico', 'fertilizante', 'otro']), unidad: z.enum(['kg', 'l', 'unidad']), stock_minimo: amount(true) }).strict();
const lotSchema = z.object({ producto_id: identifier, codigo_lote: z.string().trim().min(2).max(50), cantidad: amount(), costo_unitario: amount(true), vence_at: z.iso.date().optional() }).strict();
const moveSchema = z.object({ lote_id: identifier, tipo: z.enum(['entrada', 'salida']), cantidad: amount(), referencia: z.string().trim().min(3).max(80), motivo: z.string().trim().min(3).max(200) }).strict();

export function createApp(client, db) {
  const app = express();
  const repo = new InventoryRepository(client, db);
  app.disable('x-powered-by');
  app.use((_req, res, next) => { res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Referrer-Policy', 'same-origin'); next(); });
  app.use(express.json({ limit: '20kb' }));
  app.use('/api', (_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  app.get('/api/health', async (_req, res) => { await db.command({ ping: 1 }); res.json({ status: 'ok', database: 'MongoDB', mode: 'demo-local' }); });
  app.get('/api/dashboard', async (_req, res) => res.json(await repo.dashboard()));
  app.get('/api/productos', async (_req, res) => res.json(await repo.products()));
  app.post('/api/productos', async (req, res) => res.status(201).json(await repo.saveProduct(productSchema.parse(req.body))));
  app.put('/api/productos/:id', async (req, res) => res.json(await repo.saveProduct(productSchema.parse(req.body), req.params.id)));
  app.delete('/api/productos/:id', async (req, res) => res.json(await repo.retireProduct(req.params.id)));
  app.get('/api/lotes', async (_req, res) => res.json(await repo.lots()));
  app.post('/api/lotes', async (req, res) => res.status(201).json(await repo.createLot(lotSchema.parse(req.body))));
  app.get('/api/movimientos', async (_req, res) => res.json(await repo.movements()));
  app.post('/api/movimientos', async (req, res) => { const result = await repo.move(moveSchema.parse(req.body)); res.status(result.replayed ? 200 : 201).json(result); });
  app.use('/api', (_req, res) => res.status(404).json({ message: 'Ruta API no encontrada' }));
  const dist = path.resolve('dist/by-fekas-erp-sdd/browser');
  if (fs.existsSync(path.join(dist, 'index.html'))) {
    app.use(express.static(dist));
    app.get('/{*path}', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }
  app.use((err, _req, res, _next) => {
    if (err instanceof z.ZodError) return res.status(400).json({ message: 'Revisa los datos del formulario', details: err.issues.map(i => `${i.path.join('.')}: ${i.message}`) });
    if (err.code === 11000) return res.status(409).json({ message: 'El SKU, código de lote o referencia ya existe' });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'JSON inválido' });
    if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Petición demasiado grande' });
    return res.status(err.status ?? 500).json({ message: err.status ? err.message : 'Error interno. Revisa la conexión y los registros del servidor.' });
  });
  return app;
}
