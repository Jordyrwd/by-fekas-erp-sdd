import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Inventory } from '../../core/services/inventory';
import { Lot, Product } from '../../core/models/inventory';
import { Feedback, errorMessage } from '../../shared/feedback';
@Component({ imports: [ReactiveFormsModule, DatePipe, CurrencyPipe, Feedback], templateUrl: './lots.html' })
export class Lots {
private readonly api = inject(Inventory); private readonly fb = inject(FormBuilder);
readonly lots = signal<Lot[]>([]); readonly products = signal<Product[]>([]); readonly error = signal(''); readonly success = signal(''); readonly showForm = signal(false); readonly saving = signal(false); readonly loading = signal(true); readonly submitted = signal(false);
readonly form = this.fb.nonNullable.group({ producto_id: ['', Validators.required], codigo_lote: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]], cantidad: [1, [Validators.required, Validators.min(0.001), Validators.max(1000000)]], costo_unitario: [0, [Validators.required, Validators.min(0), Validators.max(1000000)]], vence_at: [''] });
constructor() { this.load(); }
load() { this.loading.set(true); forkJoin({ lots: this.api.lots(), products: this.api.products() }).subscribe({ next: r => { this.lots.set(r.lots); this.products.set(r.products.filter(p => p.activo)); this.loading.set(false); }, error: e => { this.error.set(errorMessage(e)); this.loading.set(false); } }); }
save() { this.submitted.set(true); if (this.form.invalid) return; const raw = this.form.getRawValue(); this.saving.set(true); this.error.set(''); this.api.createLot({ ...raw, vence_at: raw.vence_at || undefined }).subscribe({ next: () => { this.success.set('Lote y entrada inicial registrados.'); this.showForm.set(false); this.saving.set(false); this.form.reset(); this.submitted.set(false); this.load(); }, error: e => { this.error.set(errorMessage(e)); this.saving.set(false); } }); }
}