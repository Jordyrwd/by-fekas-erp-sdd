import { routes } from './app.routes';
describe('Rutas del ERP', () => {
it('separa catálogo, lotes y movimientos', () => { expect(routes.some(r => r.path === 'productos' && r.children?.length === 3)).toBe(true); expect(routes.some(r => r.path === 'lotes' && r.children?.length === 2)).toBe(true); expect(routes.some(r => r.path === 'movimientos' && r.children?.length === 2)).toBe(true); });
it('redirige al resumen y tiene página 404', () => { expect(routes[0].redirectTo).toBe('dashboard'); expect(routes.at(-1)?.path).toBe('**'); });
});