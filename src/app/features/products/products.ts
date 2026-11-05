import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Inventory } from '../../core/services/inventory';
import { Product } from '../../core/models/inventory';
import { Feedback, errorMessage } from '../../shared/feedback';
@Component({ imports: [FormsModule, RouterLink, Feedback], templateUrl: './products.html' })
export class Products {
private readonly api = inject(Inventory);
readonly products = signal<Product[]>([]); readonly search = signal(''); readonly category = signal(''); readonly error = signal(''); readonly success = signal(''); readonly loading = signal(true); readonly retiring = signal('');
readonly filtered = computed(() => this.products().filter(p => p.activo && (!this.category() || p.categoria === this.category()) && `${p.nombre} ${p.sku}`.toLocaleLowerCase().includes(this.search().toLocaleLowerCase())));
constructor() { this.load(); }
load() { this.loading.set(true); this.api.products().subscribe({ next: p => { this.products.set(p); this.loading.set(false); }, error: e => { this.error.set(errorMessage(e)); this.loading.set(false); } }); }
retire(p: Product) { this.error.set(''); this.api.retireProduct(p.id).subscribe({ next: r => { this.success.set(r.message); this.retiring.set(''); this.load(); }, error: e => { this.error.set(errorMessage(e)); this.retiring.set(''); } }); }
}