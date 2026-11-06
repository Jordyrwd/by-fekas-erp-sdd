import { Category, Lot, Movement } from '../core/models/inventory';

export const categoryNames: Record<Category, string> = {
  balanceado: 'Balanceados', probiotico: 'Probióticos', quimico: 'Químicos',
  fertilizante: 'Fertilizantes', otro: 'Otros',
};

/** Las fechas del reporte corresponden a la operación en Ecuador continental. */
export function localDay(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Guayaquil', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const part = (type: string) => parts.find(p => p.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export interface MovementFilter { search: string; type: string; from: string; to: string; }
export function filterMovements(movements: Movement[], filter: MovementFilter): Movement[] {
  if (filter.from && filter.to && filter.from > filter.to) return [];
  const search = filter.search.trim().toLocaleLowerCase('es');
  return movements.filter(m => {
    const day = localDay(m.fecha);
    return (!filter.type || m.tipo === filter.type)
      && (!filter.from || (!!day && day >= filter.from))
      && (!filter.to || (!!day && day <= filter.to))
      && `${m.lote?.producto?.nombre ?? ''} ${m.lote?.producto?.sku ?? ''} ${m.lote?.codigo_lote ?? ''} ${m.referencia} ${m.motivo}`.toLocaleLowerCase('es').includes(search);
  });
}

export function inventoryValue(lots: Lot[]) {
  const values = Object.keys(categoryNames).map(key => {
    const category = key as Category;
    return { category, name: categoryNames[category], value: lots.filter(l => l.producto?.categoria === category).reduce((sum, l) => sum + l.cantidad_actual * l.costo_unitario, 0) };
  });
  const total = values.reduce((sum, item) => sum + item.value, 0);
  return values.map(item => ({ ...item, percent: total ? item.value / total * 100 : 0 }));
}

/** Escapa texto y neutraliza fórmulas al abrir el archivo en una hoja de cálculo. */
function csvCell(value: string | number): string {
  let text = String(value);
  if (typeof value === 'string' && /^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
export function movementsCsv(movements: Movement[]): string {
  const rows: (string | number)[][] = [
    ['Fecha Ecuador', 'SKU', 'Producto', 'Lote', 'Tipo', 'Cantidad', 'Unidad', 'Saldo posterior', 'Referencia', 'Motivo'],
    ...movements.map(m => [
      `${localDay(m.fecha)} ${new Intl.DateTimeFormat('es-EC', { timeZone: 'America/Guayaquil', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(m.fecha))}`,
      m.lote?.producto?.sku ?? '', m.lote?.producto?.nombre ?? '', m.lote?.codigo_lote ?? '',
      m.tipo, m.cantidad, m.lote?.producto?.unidad ?? '', m.saldo_posterior, m.referencia, m.motivo,
    ]),
  ];
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n');
}
