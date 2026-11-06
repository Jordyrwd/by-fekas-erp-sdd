import { Component } from '@angular/core';
@Component({ template: `
<div class="page-heading">
  <div>
    <p class="eyebrow">INGENIERÍA DE SOFTWARE</p>
    <h1>Modelo de desarrollo</h1>
    <p>Una propuesta aplicada al inventario acuícola de By Fekas Corp.</p>
  </div>
</div>

<div class="doc-grid">
  <article class="doc-card">
    <p class="doc-index">01 · ESPECIFICACIÓN</p>
    <h2>Especificación antes del código</h2>
    <p>Los requisitos, contratos y decisiones están versionados en <b>specs/001-inventario</b>. La constitución conserva las reglas y los criterios de aceptación conectan cada cambio con sus pruebas.</p>
  </article>
  <article class="doc-card">
    <p class="doc-index">02 · REVISIÓN</p>
    <h2>Revisión antes de integrar</h2>
    <p>Jordy Romero lidera la implementación técnica y DevOps. Marco Dumagual lleva especificaciones, gestión y documentación. El flujo propuesto usa ramas breves y revisiones cruzadas antes de main.</p>
  </article>
  <article class="doc-card">
    <p class="doc-index">03 · VERIFICACIÓN</p>
    <h2>Verificación automatizada</h2>
    <p>GitHub Actions instala con <b>npm ci</b>, revisa el código, ejecuta pruebas, compila Angular y comprueba transacciones contra MongoDB. El CD publica una imagen Docker cuando main supera los controles.</p>
  </article>
  <article class="doc-card">
    <p class="doc-index">04 · ASISTENCIA DE IA</p>
    <h2>IA con revisión humana</h2>
    <p>El repositorio incluye instrucciones y prompts para GitHub Copilot. Los integrantes revisan cambios y conservan evidencia de uso real. Un prompt guardado no demuestra su ejecución.</p>
  </article>
  <article class="doc-card">
    <p class="doc-index">05 · ALCANCE</p>
    <h2>Límites del MVP</h2>
    <p>Este módulo usa MongoDB real y tipos del esquema proporcionado. Los datos iniciales son ficticios. El MVP funciona localmente, con un solo tenant y sin autenticación de producción.</p>
  </article>
  <article class="doc-card">
    <p class="doc-index">06 · EQUIPO</p>
    <h2>Roles del proyecto</h2>
    <p>Dos responsables con revisión cruzada: liderazgo técnico y DevOps por un lado, especificación y documentación por el otro. Cada entrega deja evidencia verificable del proceso.</p>
  </article>
</div>

<section class="panel prose">
  <h2>Principio de trabajo</h2>
  <p>La especificación, la implementación y la verificación avanzan juntas. Ningún cambio se considera terminado hasta que sus criterios de aceptación están cubiertos por pruebas y el resultado puede reproducirse en un entorno limpio.</p>
</section>` })
export class Workflow {}
