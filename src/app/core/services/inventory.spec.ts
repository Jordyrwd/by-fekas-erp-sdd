import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Inventory } from './inventory';
import { errorMessage } from '../../shared/feedback';
describe('Contratos HTTP del inventario', () => {
let service: Inventory; let http: HttpTestingController;
beforeEach(() => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] }); service = TestBed.inject(Inventory); http = TestBed.inject(HttpTestingController); });
afterEach(() => http.verify());
it('RF01 consulta el catálogo desde la API', () => { service.products().subscribe(p => expect(p.length).toBe(0)); http.expectOne('/api/productos').flush([]); });
it('RF03 conserva referencia y cuerpo del movimiento', () => { const move = { lote_id: '000000000000000000000001', tipo: 'salida' as const, cantidad: 2, referencia: 'REF-001', motivo: 'Consumo diario' }; service.move(move).subscribe(); const req = http.expectOne('/api/movimientos'); expect(req.request.method).toBe('POST'); expect(req.request.body).toEqual(move); req.flush({}); });
it('RF03 muestra el error de saldo del servidor', () => { service.move({ lote_id: 'id', tipo: 'salida', cantidad: 100, referencia: 'REF-002', motivo: 'Consumo diario' }).subscribe({ error: e => expect(errorMessage(e)).toBe('Stock insuficiente') }); http.expectOne('/api/movimientos').flush({ message: 'Stock insuficiente' }, { status: 409, statusText: 'Conflict' }); });
it('RF01 usa PUT al editar un producto', () => { service.saveProduct({ sku: 'BAL-01', nombre: 'Balanceado', categoria: 'balanceado', unidad: 'kg', stock_minimo: 10 }, 'abc').subscribe(); const req = http.expectOne('/api/productos/abc'); expect(req.request.method).toBe('PUT'); req.flush({}); });
});