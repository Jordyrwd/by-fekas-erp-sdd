import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductInput, Lot, LotInput, Movement, MovementInput, Summary } from '../models/inventory';
@Injectable({ providedIn: 'root' })
export class Inventory {
private readonly http = inject(HttpClient);
products() { return this.http.get<Product[]>('/api/productos'); }
saveProduct(product: ProductInput, id?: string) { return id ? this.http.put<Product>(`/api/productos/${id}`, product) : this.http.post<Product>('/api/productos', product); }
retireProduct(id: string) { return this.http.delete<{ message: string }>(`/api/productos/${id}`); }
lots() { return this.http.get<Lot[]>('/api/lotes'); }
createLot(lot: LotInput) { return this.http.post<Lot>('/api/lotes', lot); }
movements() { return this.http.get<Movement[]>('/api/movimientos'); }
move(movement: MovementInput) { return this.http.post<Movement>('/api/movimientos', movement); }
summary() { return this.http.get<Summary>('/api/dashboard'); }
}