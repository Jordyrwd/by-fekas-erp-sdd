import { ObjectId } from 'mongodb';
import { base, decimal, ids, plain } from './database.mjs';
import { nextStock } from './domain/stock.mjs';

export class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export function objectId(value) {
  if (!/^[a-f0-9]{24}$/i.test(value)) throw new ApiError(400, 'Identificador inválido');
  return new ObjectId(value);
}
const tenant = { tenant_id: ids.tenant };

export class InventoryRepository {
  constructor(client, db) { this.client = client; this.db = db; }
  async products() {
    const products = await this.db.collection('insumos_productos').find(tenant).sort({ sku: 1 }).toArray();
    const lots = await this.db.collection('lotes_inventario').find(tenant).toArray();
    return products.map(p => ({ ...plain(p), stock: Math.round(lots.filter(l => l.producto_id.equals(p._id)).reduce((s, l) => s + Number(l.cantidad_actual.toString()), 0) * 1000) / 1000 }));
  }
  async saveProduct(data, id) {
    const fields = { ...data, stock_minimo: decimal(data.stock_minimo), updated_at: new Date() };
    if (id) {
      const updated = await this.db.collection('insumos_productos').findOneAndUpdate({ ...tenant, _id: objectId(id), activo: true }, { $set: fields }, { returnDocument: 'after' });
      if (!updated) throw new ApiError(404, 'Producto activo no encontrado');
      return plain(updated);
    }
    const p = { ...base(), ...fields, activo: true };
    const result = await this.db.collection('insumos_productos').insertOne(p);
    return plain({ ...p, _id: result.insertedId });
  }
  async retireProduct(id) {
    // Same product document is also touched by lot/movement transactions, serializing retirement with stock writes.
    return this.client.withSession(async session => session.withTransaction(async () => {
      const product = await this.db.collection('insumos_productos').findOne({ ...tenant, _id: objectId(id), activo: true }, { session });
      if (!product) throw new ApiError(404, 'Producto activo no encontrado');
      const occupied = await this.db.collection('lotes_inventario').findOne({ ...tenant, producto_id: product._id, cantidad_actual: { $gt: decimal(0) } }, { session });
      if (occupied) throw new ApiError(409, 'El producto conserva stock. Registra las salidas antes de retirarlo.');
      await this.db.collection('insumos_productos').updateOne({ _id: product._id }, { $set: { activo: false, updated_at: new Date() } }, { session });
      return { message: 'Producto retirado. El historial se conserva.' };
    }));
  }
  async lots() {
    const [lots, products] = await Promise.all([this.db.collection('lotes_inventario').find(tenant).sort({ fecha_ingreso: -1 }).toArray(), this.products()]);
    return lots.map(l => ({ ...plain(l), producto: products.find(p => p.id === String(l.producto_id)) }));
  }
  async createLot(data) {
    return this.client.withSession(async session => session.withTransaction(async () => {
      const product = await this.db.collection('insumos_productos').findOneAndUpdate({ ...tenant, _id: objectId(data.producto_id), activo: true }, { $set: { updated_at: new Date() } }, { session, returnDocument: 'after' });
      if (!product) throw new ApiError(404, 'Producto activo no encontrado');
      const lot = { ...base(), _id: new ObjectId(), granja_id: ids.farm, bodega_id: ids.warehouse, producto_id: product._id, codigo_lote: data.codigo_lote, fecha_ingreso: new Date(), cantidad_inicial: decimal(data.cantidad), cantidad_actual: decimal(data.cantidad), costo_unitario: decimal(data.costo_unitario) };
      if (data.vence_at) lot.vence_at = new Date(data.vence_at);
      await this.db.collection('lotes_inventario').insertOne(lot, { session });
      await this.db.collection('movimientos_kardex').insertOne({ ...base(), granja_id: ids.farm, bodega_id: ids.warehouse, lote_id: lot._id, usuario_id: ids.user, fecha: new Date(), tipo: 'entrada', cantidad: decimal(data.cantidad), saldo_posterior: decimal(data.cantidad), referencia: `ALTA-${lot._id}`, motivo: 'Alta inicial del lote' }, { session });
      return plain(lot);
    }));
  }
  async movements() {
    const [moves, lots] = await Promise.all([this.db.collection('movimientos_kardex').find(tenant).sort({ fecha: -1, _id: -1 }).limit(200).toArray(), this.lots()]);
    return moves.map(m => ({ ...plain(m), lote: lots.find(l => l.id === String(m.lote_id)) }));
  }
  sameMovement(m, data) {
    return String(m.lote_id) === data.lote_id && m.tipo === data.tipo && Number(m.cantidad.toString()) === data.cantidad && m.motivo === data.motivo;
  }
  async move(data) {
    try {
      return await this.client.withSession(async session => session.withTransaction(async () => {
        const previous = await this.db.collection('movimientos_kardex').findOne({ ...tenant, referencia: data.referencia }, { session });
        if (previous) {
          if (!this.sameMovement(previous, data)) throw new ApiError(409, 'Referencia utilizada por una operación diferente');
          return { ...plain(previous), replayed: true };
        }
        const lot = await this.db.collection('lotes_inventario').findOne({ ...tenant, _id: objectId(data.lote_id) }, { session });
        if (!lot) throw new ApiError(404, 'Lote no encontrado');
        const product = await this.db.collection('insumos_productos').findOneAndUpdate({ ...tenant, _id: lot.producto_id, activo: true }, { $set: { updated_at: new Date() } }, { session, returnDocument: 'after' });
        if (!product) throw new ApiError(409, 'El producto está inactivo');
        let next;
        try { next = nextStock(Number(lot.cantidad_actual.toString()), data.tipo, data.cantidad); }
        catch (e) { throw new ApiError(409, e.message); }
        const condition = { ...tenant, _id: lot._id };
        if (data.tipo === 'salida') condition.cantidad_actual = { $gte: decimal(data.cantidad) };
        const update = await this.db.collection('lotes_inventario').updateOne(condition, { $set: { cantidad_actual: decimal(next), updated_at: new Date() } }, { session });
        if (update.matchedCount !== 1) throw new ApiError(409, 'Stock insuficiente');
        const movement = { ...base(), _id: new ObjectId(), granja_id: ids.farm, bodega_id: ids.warehouse, lote_id: lot._id, usuario_id: ids.user, fecha: new Date(), tipo: data.tipo, cantidad: decimal(data.cantidad), saldo_posterior: decimal(next), referencia: data.referencia, motivo: data.motivo };
        await this.db.collection('movimientos_kardex').insertOne(movement, { session });
        return { ...plain(movement), replayed: false };
      }));
    } catch (error) {
      if (error.code !== 11000) throw error;
      const previous = await this.db.collection('movimientos_kardex').findOne({ ...tenant, referencia: data.referencia });
      if (previous && this.sameMovement(previous, data)) return { ...plain(previous), replayed: true };
      throw new ApiError(409, 'Referencia utilizada por una operación diferente');
    }
  }
  async dashboard() {
    const [products, lots, movements] = await Promise.all([this.products(), this.lots(), this.movements()]);
    const active = products.filter(p => p.activo);
    return { productos: active.length, lotes: lots.length, valor: lots.reduce((s, l) => s + l.cantidad_actual * (l.costo_unitario ?? 0), 0), alertas: active.filter(p => p.stock <= p.stock_minimo), existencias: Object.fromEntries(['kg', 'l', 'unidad'].map(u => [u, active.filter(p => p.unidad === u).reduce((s, p) => s + p.stock, 0)])), categorias: ['balanceado', 'probiotico', 'quimico', 'fertilizante', 'otro'].map(c => ({ nombre: c, total: active.filter(p => p.categoria === c).length })), movimientos: movements.slice(0, 5), database: 'MongoDB', modo: 'Demostración local de un tenant' };
  }
}
