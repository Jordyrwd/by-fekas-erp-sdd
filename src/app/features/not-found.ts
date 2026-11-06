import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ imports: [RouterLink], template: `
<section class="panel not-found">
  <p class="eyebrow">ERROR 404</p>
  <h1>Página no encontrada</h1>
  <p>Esta dirección no corresponde a un módulo del ERP. Revisa el enlace o vuelve al resumen de inventario.</p>
  <a class="button primary" routerLink="/dashboard">Volver al resumen</a>
</section>` })
export class NotFound {}
