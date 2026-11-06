UNIVERSIDAD TÉCNICA DE MACHALA

Facultad de Ingeniería Civil

Carrera de Tecnologías de la Información

Propuesta de Desarrollo Moderno de Software e Integración de Prácticas DevOps, SDD e Inteligencia Artificial para el Sistema ERP Camaronera

Asignatura: Programación Móvil — Octavo A Diurna

Modalidad: Trabajo en equipo — Proyecto Primer Parcial

Integrantes

Jordy Samir Romero Holguín

Marco Vinicio Dumaguala Maza

Docente

Ing. CARTUCHE CALVA JOFFRE JEORWIN

Machala, El Oro, Ecuador

Periodo Académico 2026-D1

6 de noviembre de 2026

# Modelo de desarrollo de software para el ERP acuícola By Fekas Corp

## Introducción

Proponemos un proceso de desarrollo basado en especificaciones, control de versiones y verificaciones automáticas para una empresa de software ecuatoriana que mantiene un ERP acuícola. El caso de estudio es académico: los problemas organizacionales y la empresa descrita representan una situación de trabajo posible, no un diagnóstico auditado de una organización existente. La evidencia técnica proviene de un prototipo de inventario construido con Angular, una API en Node.js y MongoDB.

La solución atiende un problema concreto: una salida de bodega debe modificar el saldo y registrar el kardex sin permitir valores negativos, duplicados ni pérdidas de trazabilidad. Esta regla permite relacionar los siete bloques de investigación con decisiones verificables. El objetivo general es diseñar un modelo que convierta cada necesidad en una especificación revisable, un cambio pequeño, pruebas ejecutables y una entrega reproducible.

Los objetivos específicos son comparar estrategias de ramificación según el tamaño del equipo; definir contratos y criterios de aceptación antes de implementar; automatizar el análisis, las pruebas y la compilación; e incorporar asistencia de IA bajo revisión humana. La propuesta distingue el funcionamiento local comprobado de la adopción organizacional futura. Una suite satisfactoria o una imagen publicada no demuestran, por sí solas, disponibilidad de un servicio de producción.

# Caso de estudio y diagnóstico

By Fekas Corp. representa al cliente acuícola y su ERP. La software house ecuatoriana encargada de mantenerlo trabaja en este caso con dos integrantes: Jordy Romero como líder técnico y responsable de DevOps, y Marco Dumagual como responsable de especificaciones, documentación y gestión. Esta distribución organiza el trabajo; la participación personal debe respaldarse con actividad real de cada cuenta de GitHub.

El escenario inicial plantea archivos de código compartidos sin una historia común, cambios que se sobrescriben, despliegues manuales y reglas de inventario dispersas. El impacto no se limita a incomodidad del equipo: si se descuenta stock sin registrar su movimiento, el saldo deja de ser explicable. Si una conexión se interrumpe y el operador repite la solicitud, un segundo descuento puede pasar inadvertido.

El archivo de referencia proporcionado contiene un esquema de 26 colecciones MongoDB, una arquitectura de seguridad de referencia y una interfaz HTML. No es un respaldo con registros de producción ni una aplicación Angular terminada. El prototipo conserva el esquema e implementa el subconjunto de productos, lotes y kardex. Las colecciones de granja y bodega aportan contexto de demostración. Las demás áreas del ERP permanecen fuera del alcance funcional.

# Bloque 1 Control de versiones y estrategia de ramas

Git conserva instantáneas relacionadas mediante commits y permite comparar, integrar y recuperar cambios. Las ramas aíslan una modificación mientras el equipo mantiene una referencia estable. La historia adquiere valor operativo cuando el mensaje explica la intención y el cambio puede relacionarse con un requisito; almacenar archivos en un repositorio sin disciplina no resuelve por sí solo la coordinación (Chacon & Straub, 2014).

Git Flow separa desarrollo, versiones y correcciones mediante ramas con funciones definidas. Es razonable cuando se mantienen varias versiones o entregas con ciclos formales. Su costo aparece en las integraciones adicionales y la divergencia prolongada. El propio autor del modelo recomienda considerar flujos más sencillos para aplicaciones con entrega continua (Driessen, 2010).

Trunk Based Development concentra la colaboración alrededor de una rama principal y evita ramas de desarrollo prolongadas. Puede combinar revisiones con ramas muy breves, siempre que el equipo integre con frecuencia. Exige pruebas rápidas y capacidad de conservar la rama principal utilizable. Nombrar una rama main no demuestra que exista integración continua diaria (Hammant, s.f.).

Elegimos GitHub Flow con ramas breves, compatible con avanzar hacia Trunk Based Development cuando la integración diaria se sostenga en la práctica. Evitamos agregar develop únicamente para aparentar sofisticación. Un cambio como corregir el SKU duplicado pertenece a una rama feature o fix con una prueba específica y un PR manejable.

El uso avanzado también incluye decidir cómo recuperar errores. Un cambio defectuoso ya compartido se revierte con git revert, conservando la historia. El rebase se reserva a la rama propia para actualizarla antes del PR. Si la prueba de stock falla después de una serie de cambios, git bisect ayuda a localizar el commit responsable. Los conflictos se resuelven contra el requisito y se verifican con pruebas; aceptar automáticamente una versión puede perder una validación esencial.

# Bloque 2 Colaboración y revisión de cambios

El PR es el punto donde se explica el problema, se presenta el cambio y se revisa su evidencia. La descripción debe indicar el requisito cubierto, el comportamiento resultante y los comandos realmente ejecutados. Un comentario útil describe una consecuencia observable, por ejemplo que una actualización pueda reutilizar el SKU de otro producto, y solicita una prueba que reproduzca el caso.

Conventional Commits propone una estructura de mensaje que permite distinguir cambios funcionales, correcciones y cambios incompatibles. En este proyecto se emplean mensajes como docs(sdd), test(inventario) y feat(inventario). La convención mejora la lectura y puede apoyar automatizaciones, pero no sustituye la calidad del contenido del commit (Conventional Commits, s.f.).

Jordy debe solicitar a Marco la revisión del módulo y Marco debe presentar un cambio documental que Jordy pueda revisar. Una revisión asistida por IA debe declararse como tal. Una aprobación ejecutada por una herramienta desde otra cuenta no equivale a demostrar que el compañero leyó y entendió el código. La evidencia de trabajo en equipo requiere decisiones y comentarios personales de ambos integrantes.

La política propuesta para main requiere PR, una aprobación del otro integrante, el check calidad y actualización de aprobaciones si cambia el código. La revisión examina tanto el escenario esperado como los bordes: cantidades de cero, datos inexistentes, concurrencia y errores de red. No se permite resolver un CI rojo simplemente quitando la prueba que falla.

# Bloque 3 Desarrollo basado en especificaciones

SDD trata la especificación como el artefacto central que guía implementación y validación. El valor no depende de producir muchos documentos, sino de precisar intención, límites y condiciones observables antes de pedir código. La especificación debe evolucionar cuando cambia el negocio y conservar una relación con las tareas y pruebas que la implementan (SpecDriven.ai, s.f.).

La constitución del proyecto fija Angular standalone, persistencia real y prohibición de saldos negativos. La especificación define RF01 a RF05 y explica entradas, respuestas y restricciones. El plan decide capas, rutas y transacciones. Las tareas distribuyen unidades revisables. El contrato OpenAPI describe cómo se comunican Angular y la API. Estos archivos están versionados y pueden revisarse sin ejecutar la aplicación.

GitHub Spec Kit aporta herramientas y un flujo que organiza constitución, especificación, planificación, tareas e implementación. Los nombres de habilidades dependen de la versión y de la integración del asistente. La documentación actual distingue estos comandos del asistente de las órdenes de terminal. El repositorio incluye una guía de ejecución y artefactos SDD adaptados manualmente; esa estructura no se presenta como prueba de haber ejecutado automáticamente la CLI (GitHub, s.f.-e).

## Ejemplo de aceptación del inventario

RF03 se expresa así: dado un lote con 10 kg, cuando dos solicitudes distintas intentan retirar 7 kg cada una al mismo tiempo, entonces solo una tiene éxito, el saldo final es 3 kg y existe una sola salida nueva. Otro escenario exige que repetir una referencia con el mismo contenido devuelva el resultado original, mientras reutilizarla con otra cantidad produzca un conflicto.

Estas condiciones revelan decisiones que un prompt vago dejaría abiertas. Un bloqueo visual del botón no resuelve las solicitudes de dos equipos. Un índice único no garantiza que saldo y kardex se guarden juntos. La especificación obliga a tratar concurrencia, atomicidad e idempotencia como reglas independientes. Si el docente pide devoluciones o ajustes, primero se define su significado y luego se amplía el contrato y las pruebas.

# Bloque 4 DevOps e integración y entrega continuas

DevOps exige acuerdos de responsabilidad entre quienes cambian el producto y quienes lo operan. La integración continua verifica cambios frecuentes con una construcción automatizada y pruebas. Su propósito es detectar problemas cuando todavía son pequeños y recuperables. Ejecutar una herramienta de CI en ramas que nunca se integran no satisface toda la práctica de integración continua (Fowler, 2024).

GitHub Actions organiza la automatización en workflows activados por eventos, jobs ejecutados en runners y steps ordenados. En el prototipo, un push a ramas de trabajo y un PR hacia main activan el job calidad. Este instala con npm ci, ejecuta lint y tipos, pruebas, compilación e integración contra MongoDB. Se conserva el build Angular como artefacto para inspección o entrega (GitHub, s.f.-f).

El workflow separa calidad de publicar-imagen. El segundo job depende del primero y solo se ejecuta al cambiar main. Construye una imagen que incorpora Angular y la API, la etiqueta con el SHA y la publica en GHCR. La configuración demuestra un mecanismo de entrega de un artefacto instalable. Levantar el servicio con su base de datos y verificar salud, respaldos y recuperación constituye una etapa adicional de despliegue.

La seguridad del pipeline forma parte del diseño. Los permisos por defecto son de lectura de contenido; únicamente la publicación recibe permiso de escritura de paquetes. Los secretos no se guardan en YAML. Los PR ejecutan calidad sin publicar la imagen. La guía oficial recomienda privilegios mínimos y revisar cómo las acciones manejan credenciales (GitHub, s.f.-d). Como mejora posterior se propone fijar las acciones a SHA y automatizar la revisión de sus actualizaciones.

Si el stock falla en CI, el proceso debe detener la integración. Si una versión entregada introduce un error, se puede recuperar una imagen etiquetada por SHA y revertir el cambio mediante un nuevo commit. La recuperación de datos requiere su propio respaldo y plan: revertir código no deshace automáticamente las operaciones de inventario ya guardadas.

# Bloque 5 Inteligencia artificial y GitHub Copilot

La IA facilita explorar una implementación y proponer pruebas, pero sus respuestas pueden omitir reglas de negocio o producir código inseguro. La revisión debe comprobar el resultado en el contexto del sistema. GitHub documenta limitaciones y responsabilidades del uso de sugerencias de Copilot; aceptar una respuesta por su apariencia o porque compila no demuestra corrección (GitHub, s.f.-c).

La ventana de contexto es limitada: el asistente no puede tratar todos los archivos y conversaciones como información disponible a la vez. Por ello se aporta una tarea pequeña con el requisito RF03, el contrato y los archivos relevantes. Las instrucciones de repositorio definen convenciones de implementación y comandos de validación, utilizando el archivo .github/copilot-instructions.md reconocido por GitHub (GitHub, s.f.-b).

Un prompt preparado solicita revisar cómo se conserva atomicidad entre saldo y kardex ante dos salidas simultáneas, identificar una prueba faltante y explicar el hallazgo antes de modificar archivos. Otro solicita detectar diferencias entre validación del formulario y del servidor. El resultado esperado no es una captura de código generado, sino un razonamiento contrastable y un cambio que supere las verificaciones.

Se utilizó GitHub Copilot Free en una consulta real sobre RF03, con el repositorio adjunto y límites explícitos de actuación. El registro conserva cuenta, modo visible, contexto, respuesta, decisión técnica y prueba. La consulta fue operada por Codex desde Jordyrwd por solicitud del usuario; se distingue de una sesión manual independiente de un integrante. Las capturas y la regresión comprobada se presentan en los apéndices.

# Bloque 6 Calidad de software y TDD

TDD alterna escribir una prueba del siguiente comportamiento, implementar lo necesario para satisfacerla y refactorizar conservando su resultado. La selección del siguiente caso orienta el diseño de la interfaz y el refactor evita acumular soluciones desordenadas. Una batería escrita únicamente al final verifica comportamiento, pero no demuestra ese orden de trabajo (Fowler, 2023).

Se conservó un registro rojo de las reglas de stock frente a una implementación inicial incompleta y un registro verde posterior. Los casos cubren salidas mayores al saldo, agotamiento exacto, cero, negativos, tipos inválidos y precisión decimal. Después, la lógica usa enteros de milésimas para calcular el saldo y MongoDB Decimal128 para persistirlo. La precisión acordada es de hasta tres decimales.

Las pruebas de Angular verifican contratos HTTP y rutas. La documentación oficial actual usa Vitest para nuevos proyectos y emulación del DOM; por ello no se copiaron opciones de ChromeHeadless propias de una configuración Karma diferente (Google, s.f.-a). El proyecto utiliza Node.js 24, compatible con Angular 22 de acuerdo con su tabla oficial (Google, s.f.-b).

Las pruebas de integración utilizan una base temporal aislada de MongoDB, aplican el esquema original y ejercen la API mediante HTTP. Comprueban que un lote duplicado no deje un kardex huérfano, que dos salidas concurrentes no sobrevendan y que solicitudes simultáneas con la misma referencia produzcan un solo asiento. Las transacciones permiten confirmar o descartar conjuntamente cambios en varios documentos (MongoDB, s.f.).

La cantidad de pruebas no constituye un porcentaje de cobertura ni una garantía de ausencia de defectos. No se afirma una cobertura medida porque no se produjo ese informe. Tampoco se atribuye a la ejecución local un resultado de Actions: el estado remoto debe consultarse por su run y SHA. La prueba visual de las pantallas complementa los casos automáticos, sin reemplazarlos.

# Bloque 7 Gestión del proyecto

GitHub Projects permite combinar issues y PR en vistas de tabla, tablero y planificación. La información asociada a los elementos ayuda a seguir responsables y estados sin duplicar listas independientes. La herramienta admite distintos métodos; el equipo debe definir qué significa avanzar un elemento y qué evidencia permite cerrarlo (GitHub, s.f.-a).

La propuesta usa Backlog, In Progress, In Review y Done. Una tarea entra a In Review cuando tiene PR y verificaciones; llega a Done cuando cumple aceptación, revisión y fusión. El milestone v1.0-MVP agrupa el alcance del parcial. Un issue para RF03 describe el problema del saldo, sus escenarios y la prueba que lo comprueba, en lugar de una etiqueta genérica como terminar backend.

El límite propuesto de trabajo en curso es una tarea funcional por integrante. Marco prioriza documentación y contrato mientras Jordy implementa la infraestructura dependiente. Cuando surge una ambigüedad, se actualiza la especificación antes de ampliar el código. Este acuerdo reduce cambios simultáneos sobre los mismos archivos y facilita PR pequeños.

# Propuesta de adopción tecnológica

La adopción debe comenzar en el módulo de inventario y ampliarse después de comprobar el flujo. No se propone migrar de una sola vez las 26 colecciones funcionales ni automatizar un proceso todavía ambiguo. El piloto combina una regla de alto riesgo con un alcance que dos personas pueden explicar y verificar.

## Planificación de dos semanas

El siguiente cronograma es una planificación propuesta, no una afirmación de actividad realizada en fechas pasadas. La historia del repositorio y las evidencias conservan sus fechas reales. La fecha académica prevista para la entrega es el 6 de noviembre de 2026.

## Impacto y costo beneficio

Los siguientes valores son supuestos de decisión, no datos históricos de By Fekas Corp. Se plantea una inversión de 32 horas a USD 10 por hora, equivalente a USD 320. El mantenimiento del flujo requiere 2 horas mensuales, equivalentes a USD 20. Si la automatización y la reducción de retrabajo ahorraran 8 horas al mes, el beneficio bruto sería USD 80 y el beneficio neto mensual USD 60. El retorno simple se alcanzaría en aproximadamente 5,3 meses, sin incluir infraestructura, impuestos ni variación de precios.

El costo de oportunidad del tiempo de revisión debe medirse. Si mantener documentos extensos consume más que el retrabajo evitado, se simplifican las especificaciones manteniendo criterios verificables. La cuenta gratuita de una herramienta tampoco elimina los costos de formación, mantenimiento o alojamiento. Se evita convertir una estimación económica en una promesa comercial.

La evaluación del piloto propone medir tiempo desde commit a despliegue, frecuencia de despliegue, tiempo de recuperación de despliegues fallidos, tasa de fallos y tasa de retrabajo por despliegue. DORA actualmente distingue estas cinco métricas. Deben analizarse juntas y por equipo, sin premiar entregas frecuentes que eleven incidentes (Harvey, s.f.). Se propone observar dos semanas de línea base y otras dos del piloto antes de afirmar reducciones porcentuales.

# Arquitectura y actividad práctica

Angular presenta las pantallas y consume la API mediante HttpClient. Las rutas cargan componentes independientes para resumen, catálogo, creación y edición de productos, lotes, movimientos y documentación del flujo. Los formularios muestran estados de carga y mensajes de error. La validación del navegador mejora la experiencia, mientras el servidor decide si una operación es válida.

La API valida entradas con Zod y conserva ObjectId, Date y Decimal128 del modelo original. Los índices únicos controlan SKU, combinación de bodega, producto y lote, y referencia de kardex. La creación de un lote inserta simultáneamente su entrada inicial. El retiro de producto es lógico y requiere saldo cero, de modo que el historial permanezca consultable.

El servidor arranca un replica set local de MongoDB en un puerto dedicado si no se configura una URI externa. Guarda los datos de demostración en una carpeta excluida de Git. El prototipo no implementa autenticación, aislamiento operativo entre empresas ni facturación electrónica. La arquitectura de seguridad del ZIP original es una referencia más amplia y no se atribuye como funcionalidad implementada en este módulo.

El repositorio del trabajo es https://github.com/Jordyrwd/by-fekas-erp-sdd. La carpeta evidence conserva registros y capturas locales. El evaluador puede reproducir la instalación con npm ci, la compilación y el arranque, y ejecutar las pruebas con una instancia MongoDB disponible. Las referencias a PR, tablero, pipeline y uso de Copilot deben verificarse en sus enlaces y registros efectivos al momento de la entrega.

## Especificación ampliada y trazabilidad del inventario

La especificación funcional se organiza en apartados de propósito, alcance, actores, reglas de negocio, diccionario de entradas, requisitos funcionales, requisitos de calidad, contrato de servicios, persistencia, trazabilidad, aceptación y control de cambios y ampliación de consultas. Los escenarios se redactan en español mediante Dado, Cuando y Entonces. Los nombres de archivos, campos y rutas se conservan para que el lector pueda localizar la implementación sin ambigüedad.

El documento ampliado distingue la especificación inicial que orientó el prototipo de la aclaración documental posterior. Esta distinción evita presentar como trabajo previo una descripción escrita después de implementar. En los siguientes cambios, el equipo debe discutir la regla, actualizar el contrato y preparar la prueba antes de modificar el código. La especificación permanece revisable y versionada, en lugar de convertirse en un texto estático que pierde relación con el sistema.

## Análisis de la operación crítica y sus fallos

Una salida de inventario exige más que validar un formulario. Si un lote tiene 10 kg y dos operadores solicitan 7 kg al mismo tiempo, ambas pantallas podrían mostrar inicialmente saldo suficiente. El servidor debe resolver la competencia entre solicitudes. La transacción, la condición de saldo y el tratamiento de conflictos permiten aceptar una sola salida; la comprobación esperada es saldo final 3 kg y un solo asiento aceptado. El escenario está incluido en las pruebas de integración contra MongoDB real.

La repetición segura resuelve otro problema: el operador puede perder la respuesta después de que una operación ya se confirmó. Si repite la misma referencia y el mismo contenido, el servicio recupera el resultado previo y responde 200 sin volver a descontar. Si cambia cantidad, lote, tipo o motivo, responde 409. Por ello una referencia no es un comentario libre: identifica una operación concreta y debe conservarse durante el reintento.

Las respuestas HTTP también forman parte del acuerdo: 201 indica una creación nueva, 400 datos inválidos, 404 recurso ausente y 409 conflicto de negocio. El cliente debe mostrar el mensaje y permitir corregir la entrada. Un error interno imprevisto devuelve un mensaje general, sin exponer detalles de conexión. Las restricciones del servidor se aplican aunque un cliente omita las validaciones visuales de Angular.

## Decisiones de arquitectura y límites de la demostración

La separación entre pantallas, servicios HTTP, reglas puras y repositorio evita que las reglas de negocio dependan de la presentación. Una prueba de dominio comprueba el cálculo de existencias sin navegador; una prueba de servicio Angular comprueba solicitudes y contratos; una prueba de integración comprueba base, transacción y respuesta HTTP. Estas capas detectan defectos distintos. La suite actual suma 36 pruebas: 8 de dominio, 12 de Angular y 16 de integración. No se interpreta ese número como un porcentaje de cobertura.

## Evidencia remota y criterios de cierre

La ejecución remota 42201409544, vinculada al cambio 027404802b0a87cdba6de0f545d2e5be6f7e6384, terminó satisfactoriamente después de incorporar las rutas independientes y el diseño de Jordy. Su captura corresponde al estado indicado. La publicación de imagen se omite en un PR y solo se habilita al actualizar main. La comprobación valida ese cambio exacto; una modificación posterior requiere una nueva ejecución.

La evidencia distingue tres solicitudes de integración: el PR 1 fue fusionado por el equipo; el PR 5 fue abierto por Marco y recibió una solicitud de cambios porque su archivo estaba vacío; el PR 6 contiene la ampliación y está pendiente de revisión personal de Marco. La revisión del PR 5 se realizó con asistencia de Codex desde la cuenta de Jordy, por solicitud expresa del usuario. No se presenta como revisión manual independiente del estudiante.

El hito v1.0-MVP agrupa el alcance previsto del parcial. La evidencia de gestión se evalúa por la relación entre incidencias, responsables, cambios y criterios de cierre. Una tarjeta creada no equivale a una tarea terminada y una asignación de responsable no sustituye la participación personal.

## Conservación de las rutas y organización del repositorio

La versión final conserva la separación que realizó Jordy entre las pantallas de consulta y las de registro: /lotes/nuevo y /movimientos/nuevo son rutas independientes. El catálogo conserva sus altas y edición. La ficha /producto/:id reúne saldo, mínimo, valor referencial, lotes e historial del mismo insumo. Los filtros y la exportación se integraron en la consulta del kardex, conservando el diseño del equipo.

La estructura contiene dos partes de ejecución: src corresponde al cliente Angular y server al servidor. Las demás carpetas cumplen funciones diferentes: database conserva el esquema; specs y .specify mantienen el trabajo SDD; .github contiene automatización e instrucciones; docs explica decisiones y evidence conserva resultados. dist se genera al compilar. Reducir físicamente todo a dos directorios sin ajustar herramientas, rutas y contenedores aumentaría el riesgo de romper la reproducción. La organización responde a responsabilidades y no al número mínimo de carpetas visibles.

## Ampliación de las consultas y aceptación

RF06 permite consultar la ficha y los lotes relacionados. RF07 combina búsqueda por producto, lote, referencia o motivo con tipo y fechas inclusivas de Ecuador. El archivo CSV conserva los filtros activos, escapa comillas y saltos de línea y neutraliza fórmulas potenciales. La exportación y el historial de la ficha abarcan los 200 movimientos recientes disponibles, por lo que no se presentan como una exportación histórica completa. RF08 calcula la distribución del valor en USD por categoría con cantidades actuales y costos de lotes; los saldos físicos de unidades diferentes continúan separados.

Las seis pruebas adicionales comprueban el día local de Ecuador, la combinación de filtros, el intervalo invertido, el escape CSV, la neutralización de fórmulas y el valor agrupado. Se verificaron además navegación y descarga real del CSV en el navegador. El resultado actual suma 36 pruebas: 8 de dominio, 12 Angular y 16 de integración MongoDB. La compilación y el análisis estático también terminaron correctamente tras integrar las rutas del equipo.

## Controles de Git y estado comprobado

La rama main tiene una regla real que exige solicitud de integración, una aprobación, el control calidad, actualización frente a la base y resolución de conversaciones. Las aprobaciones quedan invalidadas cuando aparecen cambios revisables nuevos, y la regla también se aplica a administradores. Este control impide que una comprobación satisfactoria sustituya la revisión del compañero. Las fechas de cambios y ejecuciones se conservan como ocurrieron.

El tablero By Fekas ERP SDD se creó con las incidencias 2, 3 y 4 y los PR 5 y 6. El aporte documental de Marco está en curso porque requiere contenido; la ampliación está en revisión. Las incidencias de revisión pendientes permanecen en preparación. El tablero es público por autorización expresa del usuario y está disponible en https://github.com/users/Jordyrwd/projects/1. Marco tiene acceso de colaborador al repositorio y las incidencias 2 y 3 están asignadas a su cuenta.

También se ejecutó un laboratorio aislado de Git avanzado: se provocó y resolvió un conflicto real, se recuperó trabajo con stash, se actualizó una rama mediante rebase, se integró con avance rápido y se trasladó una corrección con cherry-pick. El registro completo está en evidence/git-avanzado.txt y el ZIP incluye el historial del laboratorio. Sus commits se identifican como ejercicio, no como contribuciones de estudiantes al ERP; la práctica no reescribe la historia pública del producto.

El cierre de la evidencia personal requiere que Marco complete el documento del PR 5 y revise el último cambio del PR 6. Se ejecutó una consulta real con Copilot Free, operada por Codex desde la cuenta de Jordy, y se conservó el mensaje y su respuesta. Copilot recomendó una carrera entre referencias iguales con cantidades distintas, reconoció el límite de lectura de pruebas truncadas y no afirmó ejecutar pruebas. La evaluación técnica asistida contrastó la respuesta con el código e incorporó una regresión que pasó contra MongoDB. Los integrantes deben comprender y explicar el resultado; no se atribuye esta operación como sesión manual independiente de Marco.

# Reflexión sobre el proceso

## El problema que resuelve Git

Git permite coordinar cambios sobre una historia común y recuperar una versión explicable. En este caso vincula la regla que impide saldos negativos con el commit y las pruebas que la implementan. La posibilidad de comparar y revertir cambios reduce la dependencia de archivos sueltos. Su eficacia requiere mensajes claros, integración frecuente y acuerdos del equipo.

## La importancia actual de DevOps

DevOps permite tratar la entrega y la operación como responsabilidades del mismo proceso. El modelo propuesto comprueba la aplicación antes de integrar y produce un artefacto identificado por SHA. Esto reduce pasos manuales y hace investigable una falla. También obliga a planificar recuperación, respaldos y observación después de publicar, aspectos que un build exitoso no cubre.

## El cambio que introduce la inteligencia artificial

La IA aumenta la capacidad de proponer código, pero eleva la importancia de definir restricciones y evaluar resultados. En RF03, el valor del ingeniero consiste en descubrir que concurrencia e idempotencia son requisitos distintos y exigir una prueba para cada uno. El trabajo se desplaza hacia especificar, experimentar y auditar, conservando responsabilidad sobre el código aceptado.

## La herramienta de mayor utilidad

En el modelo de trabajo, GitHub Actions conecta reglas que de otro modo dependerían de la memoria de cada integrante. En la construcción local, las pruebas contra MongoDB fueron especialmente útiles porque comprobaron que una salida rechazada no dejara efectos parciales. La utilidad de Actions se confirma cuando esa misma verificación se ejecuta remotamente sobre el commit del PR y bloquea una integración defectuosa.

# Conclusiones y recomendaciones

El prototipo muestra cómo una regla empresarial puede atravesar especificación, contrato, implementación y verificación. El uso de una base real permitió comprobar condiciones que una simulación en memoria habría ocultado. La relación entre saldo y kardex requiere transacciones, y la repetición de solicitudes requiere además idempotencia. Cada control responde a un fallo diferente.

Para un equipo de dos personas y una versión activa, un flujo breve hacia main reduce coordinación innecesaria. La revisión del compañero debe examinar efectos y casos límite, y su ejecución personal debe quedar registrada. Las herramientas de IA aportan propuestas que necesitan contexto y evaluación; la evidencia debe identificar la herramienta utilizada realmente.

Se recomienda concluir la revisión cruzada de los PR, verificar el check remoto del commit entregado y comprender y validar el registro de Copilot antes de la exposición. Como siguiente etapa empresarial, se deben incorporar autenticación, autorización, aislamiento por tenant, copias de seguridad y ensayos de recuperación. El objetivo de la adopción es mejorar la capacidad de entregar y explicar cambios con seguridad, y sus beneficios deben medirse en el piloto.

# Referencias

Chacon, S., & Straub, B. (2014). Pro Git (2.ª ed.). Apress. https://git-scm.com/book/en/v2

Conventional Commits. (s.f.). Conventional Commits 1.0.0. https://www.conventionalcommits.org/en/v1.0.0/

Driessen, V. (2010, 5 de enero). A successful Git branching model. nvie.com. https://nvie.com/posts/a-successful-git-branching-model/

Fowler, M. (2023, 11 de diciembre). Test driven development. https://martinfowler.com/bliki/TestDrivenDevelopment.html

Fowler, M. (2024, 18 de enero). Continuous integration. https://martinfowler.com/articles/continuousIntegration.html

GitHub. (s.f.-a). About Projects. GitHub Docs. https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects

GitHub. (s.f.-b). Adding repository custom instructions for GitHub Copilot. GitHub Docs. https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions

GitHub. (s.f.-c). Application card GitHub Copilot inline suggestions. GitHub Docs. https://docs.github.com/en/copilot/responsible-use/inline-suggestions

GitHub. (s.f.-d). Secure use reference. GitHub Docs. https://docs.github.com/en/actions/reference/security/secure-use

GitHub. (s.f.-e). Spec Driven Development quickstart. Spec Kit Documentation. https://github.github.com/spec-kit/quickstart.html

GitHub. (s.f.-f). Understanding GitHub Actions. GitHub Docs. https://docs.github.com/en/actions/get-started/understand-github-actions

Google. (s.f.-a). Unit testing. Angular. https://angular.dev/guide/testing

Google. (s.f.-b). Version compatibility. Angular. https://angular.dev/reference/versions

Hammant, P. (s.f.). Introduction. Trunk Based Development. https://trunkbaseddevelopment.com/

Harvey, N. (s.f.). DORA’s software delivery performance metrics. DORA. https://dora.dev/guides/dora-metrics/

MongoDB. (s.f.). Transactions. Node.js Driver. https://www.mongodb.com/docs/drivers/node/current/crud/transactions/

SpecDriven.ai. (s.f.). Spec Driven Development. https://specdriven.ai/

# Apéndice A Resumen del inventario

Figura A1. Panel Angular conectado a MongoDB con seis productos iniciales ficticios, seis lotes y dos alertas.

Nota. Captura propia de la ejecución local del prototipo. Datos de demostración.

# Apéndice B Catálogo de insumos

Figura B1. Catálogo con búsqueda, categorías, saldos y acciones de edición y retiro lógico.

Nota. Captura propia de la ejecución local del prototipo. Datos de demostración.

# Apéndice C Verificación real en GitHub Actions

Figura 3. Ejecución satisfactoria de la versión con rutas y consultas ampliadas.

Nota. Captura directa de GitHub Actions para el cambio 0274048. El control de calidad terminó satisfactoriamente; la publicación de imagen no se ejecuta en este evento de PR. Fuente: https://github.com/Jordyrwd/by-fekas-erp-sdd/actions/runs/42201409544.

# Apéndice D Integración inicial del proyecto

Figura 4. PR 1 fusionado desde feature/inventario hacia main.

Nota. Captura aportada por Jordy en imagenes github.docx. Acredita que el PR 1 fue fusionado; no acredita una aprobación previa de Marco. Fuente: https://github.com/Jordyrwd/by-fekas-erp-sdd/pull/1.

# Apéndice E Incidencias de trabajo

Figura 5. Incidencias 2, 3 y 4 registradas para revisión y documentación.

Nota. Captura propia del listado de incidencias. La imagen acredita su creación, no la finalización de tareas ni la existencia de un hito o tablero. Fuente: https://github.com/Jordyrwd/by-fekas-erp-sdd/issues.

# Apéndice F Ficha del insumo

Figura 6. Consulta de un producto con sus lotes e historial.

Nota. Captura propia de la aplicación Angular conectada a MongoDB. Las cantidades y costos corresponden a datos ficticios de demostración.

# Apéndice G Consulta y exportación del kardex

Figura 7. Consulta del kardex con búsqueda, filtros y exportación.

Nota. Se comprobó la descarga CSV para BAL-040 y el archivo contiene únicamente el movimiento de ese producto. El reporte comprende los 200 movimientos recientes devueltos por el servicio.

# Apéndice H Protección real de la rama principal

Figura 8. Revisión y controles obligatorios para main.

Nota. Captura directa de la configuración guardada en GitHub. La regla exige PR, una aprobación, calidad y resolución de conversaciones; se aplica también al administrador.

# Apéndice I Tablero de seguimiento

Figura 9. Incidencias y solicitudes de integración del equipo.

Nota. Captura propia del proyecto By Fekas ERP SDD. Los estados reflejan tareas pendientes, trabajo en curso y revisión. Fuente: https://github.com/users/Jordyrwd/projects/1.

# Apéndice J Revisión del aporte documental

Figura 10. Solicitud de cambios sobre el PR abierto por Marco.

Nota. Revisión asistida desde Jordyrwd por solicitud del usuario. El documento estaba vacío al revisar; se solicitó requisito, observación técnica y comprobación real antes de aprobar. Fuente: https://github.com/Jordyrwd/by-fekas-erp-sdd/pull/5.

# Apéndice K Uso real de GitHub Copilot

Figura 11. Consulta de RF03 con contexto del repositorio en Copilot Free.

Nota. Captura real de la consulta operada por Codex desde Jordyrwd. La herramienta identificó las rutas y declaró límites de consulta. No se afirmó ejecución de pruebas por Copilot.

# Apéndice L Recomendación de regresión

Figura 12. Propuesta de prueba y límites declarados por Copilot.

Nota. La recomendación se contrastó con el código y se implementó como una prueba real de integración. Su resultado se registra en docs/copilot-registro-real.md.

# Apéndice M Hito del parcial

Figura 13. Hito v1.0-MVP con issues y PR asociados.

Nota. El hito contiene el PR inicial fusionado y los cinco elementos abiertos. La finalización de gestión no implica que todos los elementos estén terminados.