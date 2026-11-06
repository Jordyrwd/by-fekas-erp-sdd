# By Fekas ERP con SDD

Proyecto del primer parcial de Programación Móvil, Universidad Técnica de Machala. Jordy Romero (`Jordyrwd`), líder técnico y DevOps. Marco Dumagual (`Marco738d`), especificaciones, documentación y gestión.

## Qué incluye
Angular 22 standalone, rutas lazy, formularios reactivos, API Express 5 y MongoDB real. Productos con SKU único, lotes, entradas y salidas, kardex, alertas de mínimos e idempotencia. El inicializador aplica las 26 colecciones del esquema original suministrado; el MVP opera las colecciones de inventario. Datos iniciales ficticios.

## Inicio rápido en Windows
Requisitos: Node.js 24.15 o superior de la rama 24 y MongoDB Community con `mongod` en PATH. En el equipo de Jordy ya se encontró MongoDB 9 instalado. No se necesita Atlas ni una cuenta pagada.

```powershell
npm ci
npm run build
npm start
```

Abrir http://127.0.0.1:3000. El arranque inicia un replica set local en el puerto 27028 y guarda datos en `data/mongo`, sin tocar otras bases instaladas. La base de demostración es `by_fekas_corp_demo`. Si `mongod` no está en PATH:

```powershell
$env:MONGOD_PATH='C:/ruta/MongoDB/bin/mongod.exe'
npm start
```

También se incluye INICIAR.ps1. Para desarrollar con recarga, `npm run dev` y abrir http://localhost:4200. Detener con Ctrl+C, esperar el cierre de MongoDB y evitar abrir dos instancias del arranque automático a la vez.

## Docker como alternativa
Con Docker instalado, `docker compose up --build`. El contenedor de MongoDB no publica un puerto al exterior. La aplicación solo se publica en 127.0.0.1:3000. Esta alternativa debe verificarse en un equipo con Docker antes de presentarla como ejecutada.

## Validación
```powershell
npm run lint
npm test
# Requiere MongoDB de demostración funcionando en otra terminal
npm run test:integration
```
`npm run verify` agrupa lint, dominio, Angular, build e integración. Las pruebas de integración crean y eliminan únicamente una base aislada con prefijo `fekas_test_`; no alteran la base de demostración.

## SDD y organización
`specs/001-inventario/spec.md`: requisitos y Gherkin. `plan.md`: arquitectura. `tasks.md`: tareas. `contracts/openapi.json`: contrato HTTP. `.specify/memory/constitution.md`: reglas. `docs/spec-kit.md`: demostración con la herramienta oficial y distinción respecto a los artefactos preparados manualmente.

Código Angular en `src/app/core`, `features` y `shared`. API en `server`, esquema original en `database`. `docs/flujo-git.md` explica ramas, PR, rebase, revert y protección. `docs/copilot-prompts.md` incluye prompts y registro de uso real.

## CI y entrega
El workflow `Calidad y entrega` ejecuta npm ci, lint, tests, build e integración contra MongoDB 9.0.4 en replica set. Conserva el build Angular como artefacto. En main, después de superar calidad, construye y publica una imagen GHCR etiquetada por SHA y `latest`. Eso constituye entrega automatizada de una imagen, no prueba de un despliegue público del ERP.

## Demostración de cinco minutos
1. Mostrar especificación RF03 y el contrato de movimientos.
2. Abrir resumen, catálogo y lotes.
3. Registrar salida válida y comprobar el nuevo saldo.
4. Intentar una salida mayor al saldo y mostrar el rechazo.
5. Mostrar pruebas, PR y ejecución de Actions reales.

## Alcance y seguridad
El caso de empresa y los datos son ficticios. La API usa un tenant, granja, bodega y usuario demo fijos, sin login real. No usar en producción ni exponer públicamente sin autenticación, autorización, aislamiento por tenant, TLS, rate limits, copias y supervisión. El ZIP original incluía una arquitectura de seguridad más amplia que se conserva como referencia de alcance y no se atribuye a este MVP.

## Evidencias
`evidence/` conserva capturas y registros de pruebas obtenidos durante la construcción. Las revisiones humanas y el uso de Copilot deben demostrarse con la actividad real de los integrantes. No se modificaron fechas para simular trabajo anterior. El cronograma de dos semanas del informe es una propuesta de planificación.

## Consultas ampliadas
- Ficha de cada producto con saldo, valor, lotes e historial relacionado.
- Kardex con búsqueda, filtros por tipo y fechas inclusivas de Ecuador y exportación CSV de resultados.
- Distribución del valor referencial por categoría con datos de MongoDB.
- 35 pruebas: 8 de dominio, 12 Angular y 15 de integración.

## Estado de revisión
El PR 1 fue integrado a main. La ampliación de consultas se presenta en una nueva rama para revisión antes de integrar. El aporte documental de Marco requiere completar docs/revision-marco.md y abrir su propio PR. Las capturas de GitHub conservan sus fechas reales. Consulta docs/guia-entrega.md.
