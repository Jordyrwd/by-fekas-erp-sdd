import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Inventory } from '../../core/services/inventory';
import { Lot, Movement, Product } from '../../core/models/inventory';
import { Feedback, errorMessage } from '../../shared/feedback';
import { categoryNames } from '../../shared/inventory-report';

@Component({ imports: [CurrencyPipe, DatePipe, DecimalPipe, RouterLink, Feedback], templateUrl: './product-detail.html' })
export class ProductDetail {
  private readonly api = inject(Inventory);
  private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id');
  readonly product = signal<Product | null>(null);
  readonly lots = signal<Lot[]>([]);
  readonly movements = signal<Movement[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly categories = categoryNames;
  readonly value = computed(() => this.lots().reduce((sum, l) => sum + l.cantidad_actual * l.costo_unitario, 0));
  constructor() { this.load(); }
  load() {
    this.loading.set(true); this.error.set('');
    forkJoin({ products: this.api.products(), lots: this.api.lots(), movements: this.api.movements() }).subscribe({
      next: data => {
        const product = data.products.find(p => p.id === this.id);
        this.product.set(product ?? null);
        if (!product) this.error.set('El producto solicitado no existe. Regresa al catálogo para seleccionar otro.');
        const lots = data.lots.filter(l => l.producto_id === this.id);
        const ids = new Set(lots.map(l => l.id));
        this.lots.set(lots); this.movements.set(data.movements.filter(m => ids.has(m.lote_id)));
        this.loading.set(false);
      },
      error: error => { this.error.set(errorMessage(error)); this.loading.set(false); },
    });
  }
}
