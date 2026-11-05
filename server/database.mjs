import fs from 'node:fs/promises';
import vm from 'node:vm';
import { Decimal128, ObjectId } from 'mongodb';

export const ids = {
  tenant: new ObjectId('000000000000000000000001'),
  farm: new ObjectId('000000000000000000000002'),
  warehouse: new ObjectId('000000000000000000000003'),
  user: new ObjectId('000000000000000000000004')
};
export const decimal = n => Decimal128.fromString(String(n));
export const base = () => ({ tenant_id: ids.tenant, created_at: new Date(), updated_at: new Date() });
export function plain(value) {
  if (value instanceof ObjectId) return value.toHexString();
  if (value instanceof Decimal128) return Number(value.toString());
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(plain);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k === '_id' ? 'id' : k, plain(v)]));
  return value;
}

export async function applySchema(db) {
  const definitions = [];
  const existing = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map(x => x.name));
  const adapter = {
    getCollectionInfos: ({ name }) => existing.has(name) ? [{}] : [],
    createCollection: (name, options) => definitions.push({ type: 'create', name, options }),
    runCommand: command => definitions.push({ type: 'modify', command }),
    getCollection: name => ({ createIndex: (key, options) => definitions.push({ type: 'index', name, key, options }) })
  };
  const source = await fs.readFile(new URL('../database/by_fekas_corp_db.mongodb.js', import.meta.url), 'utf8');
  vm.runInNewContext(source, { db: { getSiblingDB: () => adapter }, NumberDecimal: decimal, print: () => {} }, { timeout: 3000 });
  for (const op of definitions) {
    if (op.type === 'create') await db.createCollection(op.name, op.options);
    if (op.type === 'modify') await db.command(op.command);
    if (op.type === 'index') await db.collection(op.name).createIndex(op.key, op.options);
  }
}

export async function seed(db) {
  if (await db.collection('granjas_camaroneras').findOne({ _id: ids.farm })) return;
  await db.collection('granjas_camaroneras').insertOne({ ...base(), _id: ids.farm, codigo: 'G-01', nombre: 'Granja de demostración El Oro', ubicacion: 'Machala, Ecuador', superficie_ha: decimal(42), activa: true });
  await db.collection('bodegas').insertOne({ ...base(), _id: ids.warehouse, granja_id: ids.farm, codigo: 'B-01', nombre: 'Bodega principal', ubicacion: 'Zona de insumos', activa: true });
  const rows = [
    ['BAL-035', 'Balanceado crecimiento 35%', 'balanceado', 'kg', 500, 1280, 1.42],
    ['BAL-040', 'Balanceado precría 40%', 'balanceado', 'kg', 200, 145, 1.78],
    ['PRO-001', 'Probiótico para agua', 'probiotico', 'l', 20, 64, 12.5],
    ['QUI-002', 'Cal agrícola', 'quimico', 'kg', 100, 420, 0.35],
    ['FER-001', 'Fertilizante acuícola', 'fertilizante', 'kg', 50, 32, 2.1],
    ['OTR-001', 'Kit de medición de agua', 'otro', 'unidad', 3, 8, 38]
  ];
  for (const [sku, nombre, categoria, unidad, minimo, amount, cost] of rows) {
    const p = { ...base(), _id: new ObjectId(), sku, nombre, categoria, unidad, stock_minimo: decimal(minimo), activo: true };
    await db.collection('insumos_productos').insertOne(p);
    const lote = { ...base(), _id: new ObjectId(), granja_id: ids.farm, bodega_id: ids.warehouse, producto_id: p._id, codigo_lote: `LOTE-${sku}-01`, fecha_ingreso: new Date(), cantidad_inicial: decimal(amount), cantidad_actual: decimal(amount), costo_unitario: decimal(cost) };
    await db.collection('lotes_inventario').insertOne(lote);
    await db.collection('movimientos_kardex').insertOne({ ...base(), granja_id: ids.farm, bodega_id: ids.warehouse, lote_id: lote._id, usuario_id: ids.user, fecha: new Date(), tipo: 'entrada', cantidad: decimal(amount), saldo_posterior: decimal(amount), referencia: `SEMILLA-${sku}`, motivo: 'Inventario inicial de demostración' });
  }
}
