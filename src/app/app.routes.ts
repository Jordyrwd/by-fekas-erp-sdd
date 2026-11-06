import { Routes } from '@angular/router';
export const routes: Routes = [
{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
{ path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard), title: 'Resumen | By Fekas ERP' },
{ path: 'productos', children: [
{ path: '', loadComponent: () => import('./features/products/products').then(m => m.Products), title: 'Insumos | By Fekas ERP' },
{ path: 'nuevo', loadComponent: () => import('./features/products/product-form').then(m => m.ProductForm), title: 'Nuevo insumo | By Fekas ERP' },
{ path: 'editar/:id', loadComponent: () => import('./features/products/product-form').then(m => m.ProductForm), title: 'Editar insumo | By Fekas ERP' }] },
{ path: 'lotes', loadComponent: () => import('./features/lots/lots').then(m => m.Lots), title: 'Lotes | By Fekas ERP' },
{ path: 'movimientos', loadComponent: () => import('./features/movements/movements').then(m => m.Movements), title: 'Kardex | By Fekas ERP' },
{ path: 'flujo', loadComponent: () => import('./features/workflow/workflow').then(m => m.Workflow), title: 'Desarrollo | By Fekas ERP' },
{ path: '**', loadComponent: () => import('./features/not-found').then(m => m.NotFound), title: 'Página no encontrada' }
];