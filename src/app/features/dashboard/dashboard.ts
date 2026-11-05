import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Inventory } from '../../core/services/inventory';
import { Summary } from '../../core/models/inventory';
import { Feedback, errorMessage } from '../../shared/feedback';
@Component({ imports: [CurrencyPipe, DatePipe, DecimalPipe, RouterLink, Feedback], templateUrl: './dashboard.html' })
export class Dashboard {
readonly summary = signal<Summary | null>(null); readonly error = signal(''); private readonly api = inject(Inventory);
constructor() { this.load(); }
load() { this.error.set(''); this.api.summary().subscribe({ next: d => this.summary.set(d), error: e => this.error.set(errorMessage(e)) }); }
}