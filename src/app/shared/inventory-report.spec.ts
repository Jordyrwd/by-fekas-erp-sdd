import { filterMovements, inventoryValue, localDay, movementsCsv } from './inventory-report';
import { Lot, Movement, Product } from '../core/models/inventory';

const product: Product = { id: 'p1', sku: 'BAL-01', nombre: 'Balanceado, inicial', categoria: 'balanceado', unidad: 'kg', stock_minimo: 5, activo: true, stock: 10 };
const lot: Lot = { id: 'l1', producto_id: 'p1', codigo_lote: 'LOTE-1', cantidad_inicial: 10, cantidad_actual: 10, costo_unitario: 2, fecha_ingreso: '2026-11-05', producto: product };
const movement: Movement = { id: 'm1', lote_id: 'l1', tipo: 'salida', cantidad: 2, saldo_posterior: 8, referencia: 'REF-1', motivo: 'Consumo diario', fecha: '2026-11-06T04:30:00Z', lote: lot };
const empty = { search: '', type: '', from: '', to: '' };
describe('Reportes de inventario', () => {
  it('filtra por el día de Ecuador, incluyendo ambos límites', () => {
    expect(localDay(movement.fecha)).toBe('2026-11-05');
    expect(filterMovements([movement], { ...empty, from: '2026-11-05', to: '2026-11-05' })).toHaveLength(1);
    expect(filterMovements([movement], { ...empty, from: '2026-11-06' })).toHaveLength(0);
  });
  it('combina búsqueda por producto, tipo y fechas', () => {
    expect(filterMovements([movement], { ...empty, search: 'bal-01', type: 'salida' })).toHaveLength(1);
    expect(filterMovements([movement], { ...empty, search: 'LOTE-1', type: 'entrada' })).toHaveLength(0);
    expect(filterMovements([movement], { ...empty, search: 'inexistente' })).toHaveLength(0);
  });
  it('no devuelve datos ante un intervalo invertido', () => {
    expect(filterMovements([movement], { ...empty, from: '2026-11-06', to: '2026-11-05' })).toEqual([]);
  });
  it('exporta los campos y escapa comas, comillas y saltos de línea', () => {
    const csv = movementsCsv([{ ...movement, motivo: 'Consumo "turno A"\nBodega' }]);
    expect(csv).toContain('"Balanceado, inicial"');
    expect(csv).toContain('"Consumo ""turno A""\nBodega"');
    expect(csv).toContain('2026-11-05 23:30');
    expect(csv).toContain('"2","kg","8"');
  });
  it('neutraliza fórmulas en datos introducidos por el operador', () => {
    expect(movementsCsv([{ ...movement, motivo: '=SUM(1,2)', referencia: '  @CMD' }])).toContain('"\'=SUM(1,2)"');
    expect(movementsCsv([{ ...movement, motivo: '=SUM(1,2)', referencia: '  @CMD' }])).toContain('"\'  @CMD"');
  });
  it('agrupa valor monetario sin sumar cantidades de unidades distintas', () => {
    const liquid = { ...lot, id: 'l2', cantidad_actual: 3, costo_unitario: 10, producto: { ...product, categoria: 'probiotico' as const, unidad: 'l' as const } };
    const values = inventoryValue([lot, liquid]);
    expect(values.find(v => v.category === 'balanceado')?.value).toBe(20);
    expect(values.find(v => v.category === 'probiotico')?.value).toBe(30);
    expect(values.reduce((sum, v) => sum + v.percent, 0)).toBeCloseTo(100);
    expect(inventoryValue([]).every(v => v.percent === 0)).toBe(true);
  });
});
