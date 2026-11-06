import { Component, input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
export function errorMessage(error: unknown): string {
if (error instanceof HttpErrorResponse) return error.status === 0 ? 'No hay conexión con la API. Inicia el servidor e inténtalo otra vez.' : (error.error?.details?.join(' · ') ?? error.error?.message ?? 'No fue posible completar la operación.');
return 'Ocurrió un error inesperado.';
}
@Component({ selector: 'app-feedback', template: `@if (error()) { <div role="alert" class="feedback error">{{ error() }}</div> } @if (success()) { <div role="status" class="feedback success">{{ success() }}</div> } @if (loading()) { <div role="status" class="loading">Cargando información…</div> }` })
export class Feedback { error = input(''); success = input(''); loading = input(false); }
