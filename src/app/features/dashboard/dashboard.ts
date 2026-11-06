import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Inventory } from '../../core/services/inventory';
import { Lot, Summary } from '../../core/models/inventory';
import { Feedback, errorMessage } from '../../shared/feedback';
import { forkJoin } from 'rxjs';
import { inventoryValue } from '../../shared/inventory-report';
@Component({ imports: [CurrencyPipe, DatePipe, DecimalPipe, RouterLink, Feedback], templateUrl: './dashboard.html' })
export class Dashboard {
readonly summary = signal<Summary | null>(null); readonly error = signal(''); private readonly api = inject(Inventory);
readonly lots = signal<Lot[]>([]);
readonly distribution = computed(() => inventoryValue(this.lots()));
readonly valuedCategories = computed(() => this.distribution().filter(c => c.value > 0).length);
readonly totalValue = computed(() => this.distribution().reduce((sum, c) => sum + c.value, 0));
readonly donut = computed(() => {
  let cursor = 0;
  const colors = ['#285e48', '#729665', '#adc591', '#d5b66a', '#a9bdba'];
  if (!this.totalValue()) return '#e9eee8';
  return 'conic-gradient(' + this.distribution().map((c, i) => { const start = cursor; cursor += c.percent; return `${colors[i]} ${start}% ${cursor}%`; }).join(',') + ')';
});
constructor() { this.load(); }
load() { this.error.set(''); forkJoin({ summary: this.api.summary(), lots: this.api.lots() }).subscribe({ next: d => { this.summary.set(d.summary); this.lots.set(d.lots); }, error: e => this.error.set(errorMessage(e)) }); }
}