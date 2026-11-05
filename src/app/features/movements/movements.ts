import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Inventory } from '../../core/services/inventory';
import { Lot, Movement } from '../../core/models/inventory';
import { Feedback, errorMessage } from '../../shared/feedback';
@Component({ imports: [ReactiveFormsModule, DatePipe, Feedback], templateUrl: './movements.html' })
export class Movements {
private readonly api = inject(Inventory); private readonly fb = inject(FormBuilder);
readonly lots = signal<Lot[]>([]); readonly movements = signal<Movement[]>([]); readonly error = signal(''); readonly success = signal(''); readonly saving = signal(false); readonly loading = signal(true); readonly submitted = signal(false);
readonly form = this.fb.nonNullable.group({ lote_id: ['', Validators.required], tipo: ['salida' as 'entrada' | 'salida', Validators.required], cantidad: [1, [Validators.required, Validators.min(0.001), Validators.max(1000000)]], referencia: [crypto.randomUUID(), [Validators.required, Validators.minLength(3), Validators.maxLength(80)]], motivo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]] });
constructor() { this.load(); }
load() { this.loading.set(true); forkJoin({ lots: this.api.lots(), movements: this.api.movements() }).subscribe({ next: r => { this.lots.set(r.lots.filter(l => l.producto?.activo)); this.movements.set(r.movements); this.loading.set(false); }, error: e => { this.error.set(errorMessage(e)); this.loading.set(false); } }); }
save() { this.submitted.set(true); if (this.form.invalid) return; this.saving.set(true); this.error.set(''); this.success.set(''); this.api.move(this.form.getRawValue()).subscribe({ next: r => { this.success.set(r.replayed ? 'Referencia ya procesada. El stock no cambió otra vez.' : `Movimiento registrado. Saldo del lote: ${r.saldo_posterior}.`); this.saving.set(false); this.form.patchValue({ referencia: crypto.randomUUID(), motivo: '', cantidad: 1 }); this.submitted.set(false); this.load(); }, error: e => { this.error.set(errorMessage(e)); this.saving.set(false); } }); }
}