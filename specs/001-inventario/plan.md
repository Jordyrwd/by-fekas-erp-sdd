# Plan técnico y decisiones de arquitectura

## 1. Objetivo
Implementar RF01 a RF05 de la especificación con separación entre interfaz, servicios, reglas y persistencia. La aplicación utiliza Angular 22, una interfaz de servicios Express 5 y MongoDB real. La versión inicial ya fue comprobada; los cambios documentales se revisan mediante el mismo PR.

## 2. Distribución de responsabilidades técnicas
| Capa | Responsabilidad | Ubicación |
|---|---|---|
| Pantallas Angular | Formularios, consultas, navegación y mensajes | `src/app/features` |
| Contratos de datos | Tipos compartidos por la interfaz | `src/app/core/models` |
| Acceso HTTP | Solicitudes y tratamiento de respuestas | `src/app/core/services` |
| Reglas puras | Límites, precisión y cálculo de existencias | `server/domain` |
| Servicios HTTP | Validación de entrada y respuestas | `server/app.mjs` |
| Persistencia | Consultas, transacciones y relaciones | `server/repository.mjs` |
| Esquema original | Validadores e índices de las 26 colecciones | `database` |

## 3. Navegación
| Ruta | Pantalla |
|---|---|
| `/dashboard` | Resumen de inventario y alertas |
| `/productos` | Catálogo con búsqueda y filtros |
| `/productos/nuevo` | Alta de producto |
| `/productos/editar/:id` | Edición de producto |
| `/lotes` | Consulta y registro de lotes |
| `/movimientos` | Kardex y registro de entradas o salidas |
| `/flujo` | Explicación del proceso de desarrollo |
| Ruta no reconocida | Pantalla de recurso no encontrado |

Las pantallas se cargan por rutas independientes y usan componentes autónomos. Los formularios reactivos validan antes de enviar, pero el servidor vuelve a comprobar cada escritura.

## 4. Operación crítica: una salida
1. Validar el cuerpo y el identificador recibido.
2. Iniciar una transacción y buscar la referencia de la operación.
3. Si ya existe, comparar el contenido: devolver el resultado original o rechazar la referencia conflictiva.
4. Consultar lote y producto activo dentro del contexto fijo de la empresa.
5. Calcular el nuevo saldo mediante milésimas enteras.
6. Actualizar el lote con condición de saldo suficiente.
7. Insertar el movimiento con referencia única y saldo posterior.
8. Confirmar ambas escrituras juntas; ante fallo, revertir la transacción.

El conjunto de réplicas habilita transacciones. Los reintentos transaccionales y el índice único resuelven conflictos concurrentes; las pruebas simultáneas comprueban el resultado, no solo la respuesta de una solicitud aislada.

## 5. Decisiones y alternativas
| Decisión | Justificación | Límite |
|---|---|---|
| Conservar MongoDB | Aprovecha el esquema proporcionado y permite validar persistencia real | Las relaciones se verifican en la aplicación |
| Tres colecciones funcionales | Permite completar una regla de negocio de principio a fin | Las otras áreas del ERP no están implementadas |
| Cantidades decimales y milésimas | Evita desviaciones al sumar o restar existencias | Hasta tres decimales y máximo 1 000 000 |
| Retiro lógico | Mantiene trazabilidad de productos y movimientos | No se reutiliza el código retirado |
| Contexto fijo de demostración | Reduce alcance y hace reproducible la práctica | No proporciona autenticación ni separación operativa entre empresas |
| Rama principal y ramas breves | Dos integrantes y una sola versión activa | Requiere revisión y controles antes de integrar |

## 6. Verificación y riesgos
La suite inicial contiene 8 pruebas de dominio, 12 Angular y 16 de integración MongoDB. Se comprueban límites, duplicados, concurrencia, repetición segura y retiro. La demostración visual complementa las pruebas; no equivale a cobertura completa de interacción de usuario.

Los riesgos principales son ejecutar MongoDB sin transacciones, publicar la demostración sin autenticación, modificar contratos sin actualizar clientes y confundir un reintento con una operación nueva. Se controlan con la configuración de conjunto de réplicas, enlace local, revisión de contrato y referencia estable.

## 7. Integración y entrega
`main` representa la versión aceptada; `feature/inventario` contiene la propuesta pendiente de revisión. No se agrega una rama permanente de desarrollo porque existe una sola versión activa. Cada solicitud debe relacionar requisito, prueba y revisión del compañero.

GitHub Actions instala dependencias, analiza, prueba, compila e integra contra MongoDB. Una ejecución satisfactoria se vincula al cambio exacto comprobado. En una actualización de `main`, el flujo puede publicar una imagen Docker en GHCR. La publicación de esa imagen no significa que exista un servicio público desplegado.

El contenedor reúne Angular compilado y la interfaz de servicios; MongoDB se mantiene separado. Para aceptar la entrega académica también deben completarse hito, tablero, protección, revisión personal y evidencia real de Copilot.

## 8. Consultas ampliadas
La ruta /producto/:id agrega ficha con lotes e historial. Los filtros y la exportación del kardex se calculan en la interfaz sobre los últimos 200 registros recibidos. Las funciones puras de reportes residen en src/app/shared/inventory-report.ts y se verifican con seis pruebas específicas. El panel calcula la distribución monetaria con lotes de MongoDB y presenta los valores también como texto.

## 9. Conservación de la navegación del equipo
Se incorporan las altas en /lotes/nuevo y /movimientos/nuevo como componentes independientes. La organización del código se explica en docs/estructura-proyecto.md. Los listados conservan el diseño de Jordy y los reportes se integran sin eliminar esas rutas.
