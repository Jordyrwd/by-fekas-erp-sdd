export type Category = 'balanceado' | 'probiotico' | 'quimico' | 'fertilizante' | 'otro';
export type Unit = 'kg' | 'l' | 'unidad';
export interface ProductInput { sku: string; nombre: string; categoria: Category; unidad: Unit; stock_minimo: number; }
export interface Product extends ProductInput { id: string; activo: boolean; stock: number; }
export interface LotInput { producto_id: string; codigo_lote: string; cantidad: number; costo_unitario: number; vence_at?: string; }
export interface Lot { id: string; producto_id: string; codigo_lote: string; cantidad_inicial: number; cantidad_actual: number; costo_unitario: number; fecha_ingreso: string; vence_at?: string; producto?: Product; }
export interface MovementInput { lote_id: string; tipo: 'entrada' | 'salida'; cantidad: number; referencia: string; motivo: string; }
export interface Movement extends MovementInput { id: string; fecha: string; saldo_posterior: number; lote?: Lot; replayed?: boolean; }
export interface Summary { productos: number; lotes: number; valor: number; alertas: Product[]; existencias: Record<Unit, number>; categorias: { nombre: string; total: number }[]; movimientos: Movement[]; database: string; modo: string; }
