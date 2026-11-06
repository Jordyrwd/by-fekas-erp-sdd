import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Inventory } from '../../core/services/inventory';
import { Product } from '../../core/models/inventory';
import { Feedback, errorMessage } from '../../shared/feedback';
@Component({ imports: [ReactiveFormsModule, RouterLink, Feedback], templateUrl: './lot-form.html' })
export class LotForm {
  private readonly api = inject(Inventory);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly products = signal<Product[]>([]);
  readonly error = signal('');
  readonly saving = signal(false);
  readonly submitted = signal(false);
  readonly loading = signal(true);
  readonly form = this.fb.nonNullable.group({
    producto_id: ['', Validators.required],
    codigo_lote: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    cantidad: [1, [Validators.required, Validators.min(0.001), Validators.max(1000000)]],
    costo_unitario: [0, [Validators.required, Validators.min(0), Validators.max(1000000)]],
    vence_at: ['']
  });
  constructor() {
    this.api.products().subscribe({
      next: rows => { this.products.set(rows.filter(p => p.activo)); this.loading.set(false); },
      error: e => { this.error.set(errorMessage(e)); this.loading.set(false); }
    });
  }
  save() {
    this.submitted.set(true);
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    this.saving.set(true);
    this.error.set('');
    this.api.createLot({ ...raw, vence_at: raw.vence_at || undefined }).subscribe({
      next: () => this.router.navigate(['/lotes'], { queryParams: { creado: '1' } }),
      error: e => { this.error.set(errorMessage(e)); this.saving.set(false); }
    });
  }
}
