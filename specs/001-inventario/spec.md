# Especificación funcional del inventario acuícola

**Proyecto:** ERP Camaronera By Fekas Corp.  
**Institución:** Universidad Técnica de Machala — Programación Móvil, Octavo A Diurna.  
**Equipo:** Jordy Romero, líder técnico; Marco Dumagual, responsable propuesto de documentación y revisión.  
**Versión:** 1.1. Ampliación documental de la especificación inicial.  
**Estado:** comportamiento implementado y probado; revisión personal del compañero pendiente.

## 1. Propósito y contexto

Este documento establece el comportamiento, los datos válidos y las condiciones de aceptación del módulo de inventario. El problema principal consiste en mantener consistencia entre las existencias y su historial: una salida no puede descontarse sin registrar el movimiento correspondiente ni ejecutarse dos veces cuando el operador repite una solicitud.

El caso organizacional es académico. El archivo de referencia proporciona un esquema MongoDB de 26 colecciones, no una exportación con registros de producción. La demostración utiliza datos ficticios y una empresa, una granja, una bodega y un usuario de contexto fijo.

La versión inicial orientó el prototipo. Esta ampliación explica con mayor detalle el comportamiento existente y su trazabilidad; no se presenta como documentación escrita íntegramente antes de implementar. Cada cambio posterior debe actualizar requisito, contrato, código y prueba.

## 2. Objetivo y alcance

El objetivo es proporcionar una aplicación Angular conectada a MongoDB real para administrar productos, lotes y movimientos con integridad verificable.

**Incluye:** catálogo con búsqueda y edición; altas de lote con entrada inicial; entradas y salidas; repetición segura de operaciones; alertas de reposición; resumen por unidad; retiro lógico sin pérdida de historial.

**Excluye:** facturación electrónica, integración tributaria, pagos, nómina, producción de piscinas, autenticación y permisos de producción, selección operativa entre empresas y recuperación de desastres. Conservar el esquema completo no equivale a implementar los 26 módulos. El usuario visible de demostración no representa una sesión autenticada.

## 3. Actores y vocabulario

| Elemento | Significado |
|---|---|
| Operador de bodega | Registra insumos, lotes, entradas y salidas en la demostración. |
| Responsable de inventario | Consulta existencias y alertas; comparte el mismo acceso de demostración. |
| Líder técnico | Jordy: implementación, integración y controles automáticos. |
| Revisor | Marco: comprueba requisitos y cambios desde su cuenta; su participación debe respaldarse con evidencia real. |
| Lote | Existencias de un producto en una bodega, identificadas por un código. |
| Kardex | Historial de entradas y salidas con cantidad y saldo posterior. |
| Referencia | Identificador único de operación que permite reconocer un reintento. |
| Operación indivisible | Saldo y movimiento se confirman juntos o se deshacen juntos. |
| Repetición segura | Reenviar la misma operación devuelve el resultado anterior sin repetir el descuento. |

## 4. Reglas de negocio

| Código | Regla obligatoria |
|---|---|
| RN01 | El código de producto es único por empresa, incluso si el producto está retirado; se guarda en mayúsculas. |
| RN02 | El código de lote no se repite para una misma empresa, bodega y producto. |
| RN03 | Entradas y salidas requieren cantidades mayores que cero, de hasta 1 000 000 y con un máximo de tres decimales. |
| RN04 | El saldo de un lote permanece entre cero y 1 000 000; una operación que lo deje fuera del intervalo se rechaza. |
| RN05 | El alta de un lote crea su entrada inicial dentro de una misma transacción. |
| RN06 | Cada movimiento actualiza saldo e historial dentro de una misma transacción. |
| RN07 | Una referencia identifica una operación por empresa; el reintento idéntico no agrega otro asiento. |
| RN08 | Reutilizar la referencia con lote, tipo, cantidad o motivo diferentes genera un conflicto. |
| RN09 | Solo se puede retirar un producto con existencia total cero; se conserva su historial. |
| RN10 | Un producto activo genera alerta cuando su saldo es menor o igual a su existencia mínima. |
| RN11 | Kilogramos, litros y unidades se muestran por separado y no se suman como magnitudes equivalentes. |
| RN12 | Una operación rechazada no deja cambios parciales en saldos ni historial. |

## 5. Diccionario de datos de entrada

Los nombres entre comillas invertidas se conservan porque identifican campos del contrato y del código. Las explicaciones y los criterios se redactan en español.

| Campo | Restricción |
|---|---|
| Código de producto (`sku`) | De 2 a 30 caracteres: letras, números y guion. Se eliminan espacios exteriores y se convierte a mayúsculas. |
| Nombre (`nombre`) | De 2 a 100 caracteres, sin espacios exteriores. |
| Categoría (`categoria`) | `balanceado`, `probiotico`, `quimico`, `fertilizante` u `otro`. |
| Unidad (`unidad`) | `kg`, `l` o `unidad`. |
| Existencia mínima (`stock_minimo`) | De 0 a 1 000 000, máximo tres decimales. |
| Identificador relacionado | 24 caracteres hexadecimales; la relación debe existir en el contexto de la empresa. |
| Código de lote (`codigo_lote`) | De 2 a 50 caracteres. |
| Cantidad (`cantidad`) | Mayor que cero, hasta 1 000 000 y máximo tres decimales. |
| Costo unitario (`costo_unitario`) | De 0 a 1 000 000 y máximo tres decimales; costo referencial de inventario. |
| Vencimiento (`vence_at`) | Opcional; fecha con formato año-mes-día. |
| Tipo (`tipo`) | `entrada` o `salida`; no se admiten ajustes ambiguos. |
| Referencia (`referencia`) | De 3 a 80 caracteres; se conserva al reintentar la misma operación. |
| Motivo (`motivo`) | De 3 a 200 caracteres, que describan la razón de la operación. |

El servidor rechaza campos adicionales en las escrituras. Las validaciones de Angular ayudan al operador; la validación del servidor sigue siendo obligatoria.

## 6. Requisitos funcionales y aceptación

### RF01. Administrar el catálogo de insumos

**Historia:** como operador de bodega, quiero registrar, localizar y actualizar insumos para identificar correctamente los artículos del inventario.

**Precondición:** servidor y base disponibles; para editar, el producto debe existir y estar activo.

**Flujo:** abrir el catálogo, buscar o registrar un producto, completar sus datos, guardar y consultar el resultado.

| Escenario | Dado | Cuando | Entonces |
|---|---|---|---|
| CA01.1 Alta | Código nuevo y datos válidos | Se guarda | Se crea un producto activo y se responde 201. |
| CA01.2 Normalización | Código `bal-040` | Se registra | Se conserva como `BAL-040`. |
| CA01.3 Duplicado | Código existente, incluso retirado | Se intenta crear otro igual | Se responde 409 sin incorporar un duplicado. |
| CA01.4 Edición | Producto activo | Se guardan datos válidos | Se responde 200 y la consulta muestra la modificación. |
| CA01.5 Conflicto al editar | Dos productos distintos | Uno intenta usar el código del otro | Se responde 409 y conserva sus datos anteriores. |
| CA01.6 Validación | Nombre vacío, unidad no admitida o mínimo negativo | Se intenta guardar | Se responde 400 y no se persisten cambios. |
| CA01.7 Persistencia | Producto guardado | Se reinicia el servidor usando la misma base | El producto continúa disponible. |

**Poscondición:** se modifica únicamente el producto aceptado; editar el catálogo no genera movimientos.

### RF02. Registrar y consultar lotes

**Historia:** como operador, quiero registrar lotes por producto para consultar saldos y vencimientos referenciales.

**Precondición:** producto activo y contexto de granja y bodega de demostración disponibles.

**Flujo:** abrir Lotes, seleccionar producto, indicar código, cantidad y costo; agregar vencimiento opcional y guardar.

| Escenario | Dado | Cuando | Entonces |
|---|---|---|---|
| CA02.1 Alta válida | Producto activo y código nuevo | Se registra el lote | Se responde 201 y se crean lote y entrada inicial juntos. |
| CA02.2 Duplicado | Código existente para producto y bodega | Se repite el alta | Se responde 409 sin lote ni movimiento adicionales. |
| CA02.3 Relación inválida | Producto inexistente o retirado | Se intenta crear el lote | Se rechaza sin generar existencias. |
| CA02.4 Cantidad inválida | Cantidad cero, negativa o con más de tres decimales | Se envía el alta | Se responde 400 sin escrituras. |
| CA02.5 Fallo parcial | La transacción no logra completar todas las escrituras | Falla el alta | No queda un lote sin entrada ni una entrada sin lote. |

**Poscondición:** saldo inicial y primer asiento representan la misma cantidad.

### RF03. Registrar movimientos sin saldos negativos ni descuentos duplicados

**Historia:** como operador, quiero registrar entradas y salidas con referencia y motivo para conservar la trazabilidad.

**Precondición:** lote y producto activo existentes, cantidad y datos válidos.

**Flujo:** seleccionar lote, indicar tipo y cantidad, completar referencia y motivo y confirmar. El servidor comprueba la referencia y confirma conjuntamente el saldo y el asiento.

| Escenario | Dado | Cuando | Entonces |
|---|---|---|---|
| CA03.1 Salida | Lote con 10 kg | Se retiran 4 kg | Respuesta 201, saldo 6 kg y una salida con saldo posterior 6. |
| CA03.2 Entrada | Lote con 10 kg | Se ingresan 2,125 kg | Saldo 12,125 kg y un nuevo asiento de entrada. |
| CA03.3 Insuficiencia | Lote con 10 kg | Se solicitan 11 kg | Respuesta 409; saldo e historial intactos. |
| CA03.4 Concurrencia | Lote con 10 kg | Dos solicitudes distintas retiran 7 kg simultáneamente | Solo una prospera, saldo final 3 kg y una sola salida aceptada. |
| CA03.5 Reintento | Referencia procesada | Se repiten exactamente lote, tipo, cantidad y motivo | Respuesta 200 con resultado anterior; no se descuenta otra vez. |
| CA03.6 Referencia conflictiva | Referencia procesada | Se cambia lote, tipo, cantidad o motivo | Respuesta 409 sin alterar el resultado original. |
| CA03.7 Límite | Saldo próximo al máximo | Una entrada superaría 1 000 000 | Respuesta 409, sin asiento adicional. |
| CA03.8 Precisión | Cantidad con más de tres decimales | Se envía | Respuesta 400, sin redondeo silencioso. |
| CA03.9 Inexistencia | Identificador válido de un lote inexistente | Se registra un movimiento | Respuesta 404 sin modificar otros lotes. |

**Poscondición:** un movimiento aceptado corresponde a una única transición de saldo. El historial se ordena por fecha descendente; el prototipo devuelve hasta 200 movimientos recientes.

### RF04. Consultar resumen y alertas

**Historia:** como responsable de inventario, quiero consultar indicadores para priorizar la reposición.

| Escenario | Dado | Cuando | Entonces |
|---|---|---|---|
| CA04.1 Resumen | Productos y lotes | Se abre Resumen | Se muestran productos activos, lotes, valor, alertas y cinco movimientos recientes. |
| CA04.2 Umbral | Producto activo con saldo igual o inferior al mínimo | Se consulta | Aparece en reposición prioritaria. |
| CA04.3 Unidades | Productos en kg, litros y unidades | Se consultan existencias | Se muestran totales separados. |
| CA04.4 Valor | Cantidades actuales y costos unitarios | Se calcula el indicador | Se suma cantidad por costo; es un valor referencial, no un estado contable. |

### RF05. Retirar productos conservando su historial

**Historia:** como operador, quiero retirar productos que ya no se utilizan sin borrar sus antecedentes.

| Escenario | Dado | Cuando | Entonces |
|---|---|---|---|
| CA05.1 Permitido | Producto activo sin saldo | Se confirma el retiro | Respuesta 200, actividad falsa e historial conservado. |
| CA05.2 Impedido | Producto con saldo positivo | Se intenta retirar | Respuesta 409 y continúa activo. |
| CA05.3 Historial | Producto retirado | Se inspeccionan lotes y movimientos | No han sido eliminados. |
| CA05.4 Código reservado | Producto retirado | Se intenta reutilizar su código | Respuesta 409. |

## 7. Requisitos de calidad y operación

| Código | Requisito | Comprobación y límite |
|---|---|---|
| RNC01 | Persistencia real | MongoDB con validadores e índices originales; no se sustituye por almacenamiento del navegador. |
| RNC02 | Consistencia | Transacciones para movimientos y altas de lote; requiere conjunto de réplicas, incluso de un nodo. |
| RNC03 | Precisión | Cantidades con representación decimal BSON y cálculo de existencias con milésimas enteras. El valor monetario no se certifica como contabilidad. |
| RNC04 | Usabilidad | Etiquetas, errores visibles, rutas independientes y diseño adaptable; sin certificación formal de accesibilidad. |
| RNC05 | Exposición local | Enlace predeterminado a `127.0.0.1`; no habilita por sí mismo un servicio público seguro. |
| RNC06 | Reproducibilidad | Instalación de dependencias bloqueadas, análisis, pruebas y compilación automatizados. |
| RNC07 | Confidencialidad | No versionar credenciales, archivo de entorno ni datos persistidos. |
| RNC08 | Trazabilidad | Relacionar requisitos, pruebas, incidencia y solicitud de integración con el cambio comprobado. |
| RNC09 | Errores controlados | No devolver credenciales ni detalles internos de la base ante un fallo imprevisto. |

No se han medido disponibilidad, carga máxima ni tiempos de respuesta de producción. Las mejoras económicas y operativas del informe son una propuesta, no resultados observados.

## 8. Contrato de servicios y respuestas

El contrato completo se conserva en [contracts/openapi.json](contracts/openapi.json).

| Método y ruta | Finalidad | Requisito |
|---|---|---|
| `GET /api/health` | Comprobar servidor y conexión a MongoDB | RNC01 |
| `GET /api/productos` | Consultar catálogo y existencias agregadas | RF01 |
| `POST /api/productos` | Crear producto | RF01 |
| `PUT /api/productos/:id` | Actualizar producto | RF01 |
| `DELETE /api/productos/:id` | Retirar lógicamente | RF05 |
| `GET /api/lotes` | Consultar lotes y relaciones | RF02 |
| `POST /api/lotes` | Crear lote y entrada inicial | RF02 |
| `GET /api/movimientos` | Consultar kardex reciente | RF03 |
| `POST /api/movimientos` | Registrar operación o recuperar reintento | RF03 |
| `GET /api/dashboard` | Consultar resumen y alertas | RF04 |

| Respuesta | Interpretación |
|---|---|
| 200 | Consulta, actualización o reintento idéntico resuelto. |
| 201 | Recurso u operación nueva creada. |
| 400 | Datos, formato o identificador inválidos. |
| 404 | Recurso o ruta no encontrados. |
| 409 | Duplicado, saldo insuficiente, referencia conflictiva o retiro impedido. |
| 413 | Solicitud superior al límite configurado de 20 kilobytes. |
| 500 | Fallo interno no previsto; mensaje general y revisión de registros del servidor. |

## 9. Persistencia y decisiones técnicas

Las colecciones funcionales son `insumos_productos`, `lotes_inventario` y `movimientos_kardex`. Se utilizan identificadores de contexto fijo para empresa, granja, bodega y usuario. El servicio verifica las relaciones porque MongoDB no aplica claves foráneas.

La transacción une las escrituras relacionadas. La actualización de una salida exige saldo suficiente; los conflictos de escritura se resuelven con la política de reintentos del controlador transaccional. El índice único por empresa y referencia impide duplicados. Comparar el contenido permite distinguir un reintento legítimo de una referencia reutilizada incorrectamente.

Las cantidades se almacenan como decimales BSON. Las reglas validan hasta tres decimales y calculan con milésimas enteras para evitar desviaciones al sumar o restar existencias.

## 10. Matriz de trazabilidad

| Requisito | Implementación | Evidencia |
|---|---|---|
| RF01 | Catálogo, formulario, servicio HTTP y repositorio | Integración: creación, duplicado, validación y edición conflictiva; pruebas del servicio Angular. |
| RF02 | Pantalla Lotes y alta transaccional | Integración: alta, duplicado y ausencia de escrituras parciales. |
| RF03 | Pantalla Movimientos, reglas y transacción | Dominio e integración: límites, concurrencia y repetición segura. |
| RF04 | Resumen y agregaciones | Consulta real del panel; no se afirma cobertura automatizada completa de sus escenarios visuales. |
| RF05 | Retiro lógico en interfaz y repositorio | Integración: impedimento con saldo y retiro lógico sin borrado. |
| RNC06 | Flujo de GitHub Actions | Ejecución asociada al cambio: análisis, 29 pruebas y compilación en la versión inicial comprobada. |

Referencias para verificar la matriz:

- `server/domain/stock.mjs` y `server/tests/stock.test.mjs`.
- `server/app.mjs`, `server/repository.mjs` y `server/tests/integration/inventory.test.mjs`.
- Pruebas de servicios y rutas ubicadas en `src/app`.
- `.github/workflows/ci.yml` y registros de `evidence`.

La suite ampliada suma 8 pruebas de dominio, 12 de Angular y 16 de integración: 36 en total. Ese total no representa un porcentaje de cobertura ni garantiza ausencia de defectos.

## 11. Condiciones de aceptación de la entrega

### 11.1 Comprobación funcional

- Instalar, compilar e iniciar con MongoDB disponible.
- Crear un producto y comprobar que persiste.
- Crear un lote y verificar su entrada inicial.
- Registrar una salida válida y consultar saldo y asiento.
- Intentar una salida excesiva y comprobar rechazo sin cambios.
- Repetir una referencia idéntica sin otro descuento.
- Consultar alertas y existencias separadas por unidad.
- Ejecutar análisis y pruebas sin errores.

### 11.2 Cierre de colaboración

- Marco acepta la invitación de colaborador y revisa personalmente el último cambio del PR.
- Se resuelven observaciones y se completa hito y tablero con responsables reales.
- La rama principal exige revisión y comprobación de calidad.
- Se registra una interacción real con Copilot y su evaluación humana.
- Se incorporan capturas del propio proyecto con explicación y enlace de origen.
- Se integra el PR tras cumplir controles y se revisa la ejecución de la rama principal.

Las condiciones documentales continúan pendientes mientras no exista evidencia. El prototipo funcionando no sustituye la demostración de trabajo en equipo.

## 12. Control de cambios

1. Identificar requisito y escenario afectados.
2. Proponer la modificación y su justificación en una incidencia.
3. Actualizar especificación y contrato si cambian datos o respuestas.
4. Agregar una prueba que reproduzca la necesidad o el defecto.
5. Implementar y ejecutar los controles.
6. Solicitar revisión antes de integrar.

Los nombres de herramientas, campos, archivos y rutas se conservan por compatibilidad. La redacción y todos los criterios de aceptación están en español.

## 13. Ampliación de consultas y reportes

### RF06. Ficha del producto
Como responsable de inventario quiero abrir un producto desde el catálogo o una alerta y consultar su saldo, mínimo, valor referencial, lotes y movimientos relacionados.

- Dado un producto existente, cuando abro su ficha, entonces solo se muestran sus lotes y sus movimientos entre los 200 últimos disponibles.
- Dado un identificador inexistente, cuando abro la ficha, entonces se informa que el producto no existe y se ofrece volver al catálogo.
- Los productos retirados conservan su consulta histórica; no se muestran acciones de edición para ellos.

### RF07. Filtrar y exportar kardex
Como operador quiero filtrar movimientos por texto, tipo y fechas para exportar el resultado de una consulta.

- La búsqueda contempla producto, código, lote, referencia y motivo; los filtros se combinan.
- Las fechas inicial y final son inclusivas y se interpretan en Ecuador continental.
- Un intervalo invertido muestra un error y deshabilita la exportación.
- La exportación CSV incluye solo los resultados visibles, con encabezados, unidad, cantidad y saldo posterior. Si no hay resultados no se exporta.
- Los textos se escapan para conservar comillas y saltos; las fórmulas potenciales se neutralizan al abrir el archivo en una hoja de cálculo.
- La consulta y el archivo se limitan a los 200 movimientos recientes que devuelve el servicio. No se presentan como exportación histórica completa.

### RF08. Distribución del valor del inventario
Como responsable quiero comparar el valor referencial de las categorías para identificar dónde se concentra el inventario.

- El valor de cada lote es su cantidad actual por su costo unitario.
- La distribución agrupa importes en USD por categoría, sin sumar cantidades de unidades distintas.
- El gráfico y su leyenda se calculan con los lotes consultados en MongoDB; no se inventan tendencias temporales.
- Sin valor disponible se muestra la leyenda en cero y una distribución neutra.

La ampliación incorpora seis pruebas de reportes: límites de fecha, combinación de filtros, intervalo inválido, escape CSV, neutralización de fórmulas y valor agrupado. Estas se suman a las 29 pruebas iniciales, para un total de 35.

## 14. Regresión propuesta por Copilot
La revisión real de RF03 recomendó comprobar referencias concurrentes con contenido diferente. Se incorporó una prueba contra MongoDB que exige respuestas 201 y 409, un único asiento y saldo igual al saldo anterior más la cantidad aceptada. El registro y los límites de la consulta se documentan en docs/copilot-registro-real.md. Esta prueba se suma a las seis de reportes y las 29 iniciales: 36 en total.
