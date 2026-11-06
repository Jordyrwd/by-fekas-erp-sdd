import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Inventory } from '../../core/services/inventory';
import { Lot } from '../../core/models/inventory';
import { Feedback, errorMessage } from '../../shared/feedback';
@Component({ imports: [ReactiveFormsModule, RouterLink, Feedback], templateUrl: './movement-form.html' })
export class MovementForm {
  private readonly api = inject(Inventory);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly lots = signal<Lot[]>([]);
  readonly error = signal('');
  readonly saving = signal(false);
  readonly submitted = signal(false);
  readonly loading = signal(true);
  readonly form = this.fb.nonNullable.group({
    lote_id: ['', Validators.required],
    tipo: ['salida' as 'entrada' | 'salida', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(0.001), Validators.max(1000000)]],
    referencia: [crypto.randomUUID(), [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    motivo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]]
  });
  constructor() {
    this.api.lots().subscribe({
      next: rows => { this.lots.set(rows.filter(l => l.producto?.activo)); this.loading.set(false); },
      error: e => { this.error.set(errorMessage(e)); this.loading.set(false); }
    });
  }
  save() {
    this.submitted.set(true);
    if (this.form.invalid) return;
    this.saving.set(true);
    this.error.set('');
    this.api.move(this.form.getRawValue()).subscribe({
      next: r => this.router.navigate(['/movimientos'], {
        state: { flash: r.replayed ? 'Referencia ya procesada. El stock no cambió otra vez.' : `Movimiento registrado. Saldo del lote: ${r.saldo_posterior}.` }
      }),
      error: e => { this.error.set(errorMessage(e)); this.saving.set(false); }
    });
  }
}
