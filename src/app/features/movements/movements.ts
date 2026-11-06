import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Inventory } from '../../core/services/inventory';
import { Movement } from '../../core/models/inventory';
import { Feedback, errorMessage } from '../../shared/feedback';
import { filterMovements, movementsCsv, localDay } from '../../shared/inventory-report';
@Component({ imports: [FormsModule, DatePipe, RouterLink, Feedback], templateUrl: './movements.html' })
export class Movements {
  private readonly api = inject(Inventory);
  private readonly router = inject(Router);
  readonly movements = signal<Movement[]>([]);
  readonly error = signal('');
  readonly success = signal('');
  readonly loading = signal(true);
readonly search = signal(''); readonly typeFilter = signal(''); readonly from = signal(''); readonly to = signal('');
readonly invalidRange = computed(() => !!this.from() && !!this.to() && this.from() > this.to());
readonly filtered = computed(() => filterMovements(this.movements(), { search: this.search(), type: this.typeFilter(), from: this.from(), to: this.to() }));
readonly entryCount = computed(() => this.filtered().filter(m => m.tipo === 'entrada').length);
readonly exitCount = computed(() => this.filtered().filter(m => m.tipo === 'salida').length);
clearFilters() { this.search.set(''); this.typeFilter.set(''); this.from.set(''); this.to.set(''); }
exportCsv() {
  if (!this.filtered().length || this.invalidRange()) return;
  const url = URL.createObjectURL(new Blob([movementsCsv(this.filtered())], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = `kardex-${localDay(new Date().toISOString())}.csv`;
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

  constructor() {
    const flash = this.router.getCurrentNavigation()?.extras.state?.['flash'];
    if (typeof flash === 'string' && flash) this.success.set(flash);
    this.load();
  }
  load() {
    this.loading.set(true);
    this.api.movements().subscribe({
      next: rows => { this.movements.set(rows); this.loading.set(false); },
      error: e => { this.error.set(errorMessage(e)); this.loading.set(false); }
    });
  }
}
