import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { MongoClient } from 'mongodb';
import { once } from 'node:events';
import { createApp } from '../../app.mjs';
import { applySchema, seed } from '../../database.mjs';
let client, db, server, url, product, lot;
const request = async (route, method = 'GET', body) => {
  const res = await fetch(url + route, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
};
const productData = { sku: 'TEST-001', nombre: 'Insumo de pruebas', categoria: 'balanceado', unidad: 'kg', stock_minimo: 5 };
before(async () => {
  client = new MongoClient(process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27028/?replicaSet=fekas-demo', { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  db = client.db(`fekas_test_${Date.now()}_${process.pid}`);
  await applySchema(db); await seed(db);
  server = createApp(client, db).listen(0, '127.0.0.1'); await once(server, 'listening');
  url = `http://127.0.0.1:${server.address().port}/api`;
});
after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  if (db?.databaseName.startsWith('fekas_test_')) await db.dropDatabase();
  await client?.close();
});
test('RNF01 aplica las 26 colecciones del esquema original', async () => assert.equal((await db.listCollections().toArray()).length, 26));
test('RF01 crea producto y normaliza SKU', async () => { const r = await request('/productos', 'POST', { ...productData, sku: 'test-001' }); assert.equal(r.status, 201); assert.equal(r.body.sku, 'TEST-001'); product = r.body; });
test('RF01 impide SKU duplicado', async () => assert.equal((await request('/productos', 'POST', productData)).status, 409));
test('RF01 rechaza datos inválidos y propiedades extra', async () => { for (const body of [{ ...productData, stock_minimo: -1 }, { ...productData, activo: false }, { ...productData, categoria: 'desconocido' }]) assert.equal((await request('/productos', 'POST', body)).status, 400); });
test('RF02 crea lote y entrada inicial atómicos', async () => { const r = await request('/lotes', 'POST', { producto_id: product.id, codigo_lote: 'LOTE-TEST', cantidad: 10, costo_unitario: 2 }); assert.equal(r.status, 201); lot = r.body; assert.equal(lot.cantidad_actual, 10); assert.equal(await db.collection('movimientos_kardex').countDocuments({ referencia: `ALTA-${lot.id}` }), 1); });
test('RF02 lote duplicado revierte la operación', async () => { const before = await db.collection('movimientos_kardex').countDocuments(); assert.equal((await request('/lotes', 'POST', { producto_id: product.id, codigo_lote: 'LOTE-TEST', cantidad: 10, costo_unitario: 2 })).status, 409); assert.equal(await db.collection('movimientos_kardex').countDocuments(), before); });
test('RF03 salida mayor al saldo conserva stock y kardex', async () => { const before = await db.collection('movimientos_kardex').countDocuments(); const r = await request('/movimientos', 'POST', { lote_id: lot.id, tipo: 'salida', cantidad: 11, referencia: 'INSUFICIENTE', motivo: 'Prueba de límite' }); assert.equal(r.status, 409); assert.equal((await request('/lotes')).body.find(l => l.id === lot.id).cantidad_actual, 10); assert.equal(await db.collection('movimientos_kardex').countDocuments(), before); });
test('RF03 dos salidas concurrentes no sobrevendan', async () => { const r = await Promise.all(['CONC-A', 'CONC-B'].map(referencia => request('/movimientos', 'POST', { lote_id: lot.id, tipo: 'salida', cantidad: 7, referencia, motivo: 'Prueba concurrente' }))); assert.deepEqual(r.map(x => x.status).sort(), [201, 409]); assert.equal((await request('/lotes')).body.find(l => l.id === lot.id).cantidad_actual, 3); });
test('RF03 reintento idéntico es idempotente', async () => { const data = { lote_id: lot.id, tipo: 'entrada', cantidad: 2, referencia: 'IDEMP-01', motivo: 'Reposición de prueba' }; assert.equal((await request('/movimientos', 'POST', data)).status, 201); const again = await request('/movimientos', 'POST', data); assert.equal(again.status, 200); assert.equal(again.body.replayed, true); assert.equal((await request('/lotes')).body.find(l => l.id === lot.id).cantidad_actual, 5); assert.equal((await request('/movimientos', 'POST', { ...data, cantidad: 3 })).status, 409); });
test('RF03 reintentos simultáneos producen un solo asiento', async () => { const data = { lote_id: lot.id, tipo: 'entrada', cantidad: 1, referencia: 'IDEMP-SIM', motivo: 'Reintento simultáneo' }; const r = await Promise.all([request('/movimientos', 'POST', data), request('/movimientos', 'POST', data)]); assert.deepEqual(r.map(x => x.status).sort(), [200, 201]); assert.equal(await db.collection('movimientos_kardex').countDocuments({ referencia: data.referencia }), 1); });
test('RF05 impide retirar producto con stock', async () => assert.equal((await request(`/productos/${product.id}`, 'DELETE')).status, 409));
test('RF04 calcula alertas con igualdad y separa unidades', async () => { const r = await request('/dashboard'); assert.equal(r.status, 200); assert.ok(r.body.alertas.length >= 2); assert.deepEqual(Object.keys(r.body.existencias).sort(), ['kg', 'l', 'unidad']); });
test('RF05 retiro lógico conserva producto e historial', async () => { const p = (await request('/productos', 'POST', { ...productData, sku: 'SIN-STOCK' })).body; assert.equal((await request(`/productos/${p.id}`, 'DELETE')).status, 200); assert.equal((await request('/productos')).body.find(x => x.id === p.id).activo, false); });
test('API distingue ID inválido y recurso ausente', async () => { assert.equal((await request('/productos/no-id', 'PUT', productData)).status, 400); assert.equal((await request('/productos/000000000000000000000099', 'PUT', productData)).status, 404); });
test('RNF01 MongoDB rechaza inserción directa sin campos obligatorios', async () => await assert.rejects(db.collection('insumos_productos').insertOne({ sku: 'INVALIDO' }), error => error.code === 121));

test('RF03 referencia simultánea con cantidades distintas conserva un solo efecto', async () => {
  // Regresión propuesta por Copilot y contrastada contra MongoDB real.
  const previous = (await request('/lotes')).body.find(l => l.id === lot.id).cantidad_actual;
  const common = { lote_id: lot.id, tipo: 'entrada', referencia: 'REF-CONFLICTO-SIM', motivo: 'Revisión de referencia concurrente' };
  const results = await Promise.all([1, 2].map(cantidad => request('/movimientos', 'POST', { ...common, cantidad })));
  assert.deepEqual(results.map(r => r.status).sort(), [201, 409]);
  const stored = await db.collection('movimientos_kardex').findOne({ referencia: common.referencia });
  assert.equal(await db.collection('movimientos_kardex').countDocuments({ referencia: common.referencia }), 1);
  assert.equal((await request('/lotes')).body.find(l => l.id === lot.id).cantidad_actual, previous + Number(stored.cantidad.toString()));
});
