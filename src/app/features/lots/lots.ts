import { Component, inject, signal } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Inventory } from '../../core/services/inventory';
import { Lot } from '../../core/models/inventory';
import { Feedback, errorMessage } from '../../shared/feedback';
@Component({ imports: [DatePipe, CurrencyPipe, RouterLink, Feedback], templateUrl: './lots.html' })
export class Lots {
  private readonly api = inject(Inventory);
  private readonly route = inject(ActivatedRoute);
  readonly lots = signal<Lot[]>([]);
  readonly error = signal('');
  readonly success = signal('');
  readonly loading = signal(true);
  constructor() {
    if (this.route.snapshot.queryParamMap.has('creado')) this.success.set('Lote y entrada inicial registrados.');
    this.load();
  }
  load() {
    this.loading.set(true);
    this.api.lots().subscribe({
      next: rows => { this.lots.set(rows); this.loading.set(false); },
      error: e => { this.error.set(errorMessage(e)); this.loading.set(false); }
    });
  }
}
