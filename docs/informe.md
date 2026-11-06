## Modelo de desarrollo de software para el ERP acuícola By Fekas Corp

### Introducción

Proponemos un proceso de desarrollo basado en especificaciones, control de versiones y verificaciones automáticas para una empresa de software ecuatoriana que mantiene un ERP acuícola. El caso de estudio es académico: los problemas organizacionales y la empresa descrita representan una situación de trabajo posible, no un diagnóstico auditado de una organización existente. La evidencia técnica proviene de un prototipo de inventario construido con Angular, una API en Node.js y MongoDB.

La solución atiende un problema concreto: una salida de bodega debe modificar el saldo y registrar el kardex sin permitir valores negativos, duplicados ni pérdidas de trazabilidad. Esta regla permite relacionar los siete bloques de investigación con decisiones verificables. El objetivo general es diseñar un modelo que convierta cada necesidad en una especificación revisable, un cambio pequeño, pruebas ejecutables y una entrega reproducible.

Los objetivos específicos son comparar estrategias de ramificación según el tamaño del equipo; definir contratos y criterios de aceptación antes de implementar; automatizar el análisis, las pruebas y la compilación; e incorporar asistencia de IA bajo revisión humana. La propuesta distingue el funcionamiento local comprobado de la adopción organizacional futura. Una suite satisfactoria o una imagen publicada no demuestran, por sí solas, disponibilidad de un servicio de producción.

## Caso de estudio y diagnóstico

By Fekas Corp. representa al cliente acuícola y su ERP. La software house ecuatoriana encargada de mantenerlo trabaja en este caso con dos integrantes: Jordy Romero como líder técnico y responsable de DevOps, y Marco Dumagual como responsable de especificaciones, documentación y gestión. Esta distribución organiza el trabajo; la participación personal debe respaldarse con actividad real de cada cuenta de GitHub.

El escenario inicial plantea archivos de código compartidos sin una historia común, cambios que se sobrescriben, despliegues manuales y reglas de inventario dispersas. El impacto no se limita a incomodidad del equipo: si se descuenta stock sin registrar su movimiento, el saldo deja de ser explicable. Si una conexión se interrumpe y el operador repite la solicitud, un segundo descuento puede pasar inadvertido.

El archivo de referencia proporcionado contiene un esquema de 26 colecciones MongoDB, una arquitectura de seguridad de referencia y una interfaz HTML. No es un respaldo con registros de producción ni una aplicación Angular terminada. El prototipo conserva el esquema e implementa el subconjunto de productos, lotes y kardex. Las colecciones de granja y bodega aportan contexto de demostración. Las demás áreas del ERP permanecen fuera del alcance funcional.

| Problema del caso | Control propuesto | Resultado comprobable |
| --- | --- | --- |
| Pérdida de versiones | Git y repositorio compartido | Historia y diferencias de cada cambio |
| Cambios sin revisión | PR pequeño y revisión del compañero | Comentarios y resolución asociados al diff |
| Reglas ambiguas | SDD y contrato OpenAPI | Criterio RF03 conectado con prueba |
| Errores al entregar | CI y contenedor | Misma secuencia de instalación y build |
| Descuento duplicado | Idempotencia y transacción | Un solo asiento por referencia |

## Control de versiones y estrategia de ramas

Git conserva instantáneas relacionadas mediante commits y permite comparar, integrar y recuperar cambios. Las ramas aíslan una modificación mientras el equipo mantiene una referencia estable. La historia adquiere valor operativo cuando el mensaje explica la intención y el cambio puede relacionarse con un requisito; almacenar archivos en un repositorio sin disciplina no resuelve por sí solo la coordinación (Chacon & Straub, 2014).

Git Flow separa desarrollo, versiones y correcciones mediante ramas con funciones definidas. Es razonable cuando se mantienen varias versiones o entregas con ciclos formales. Su costo aparece en las integraciones adicionales y la divergencia prolongada. El propio autor del modelo recomienda considerar flujos más sencillos para aplicaciones con entrega continua (Driessen, 2010).

Trunk Based Development concentra la colaboración alrededor de una rama principal y evita ramas de desarrollo prolongadas. Puede combinar revisiones con ramas muy breves, siempre que el equipo integre con frecuencia. Exige pruebas rápidas y capacidad de conservar la rama principal utilizable. Nombrar una rama main no demuestra que exista integración continua diaria (Hammant, s.f.).

| Decisión | Git Flow | Flujo elegido |
| --- | --- | --- |
| Ramas permanentes | main y develop, más ramas de versión | main |
| Integración | Varias promociones según versión | PR breve hacia main |
| Ventaja contextual | Versiones simultáneas y releases controlados | Menor coordinación para dos integrantes |
| Riesgo | Divergencia y fusiones tardías | Integrar sin suficiente revisión o pruebas |

Elegimos GitHub Flow con ramas breves, compatible con avanzar hacia Trunk Based Development cuando la integración diaria se sostenga en la práctica. Evitamos agregar develop únicamente para aparentar sofisticación. Un cambio como corregir el SKU duplicado pertenece a una rama feature o fix con una prueba específica y un PR manejable.

El uso avanzado también incluye decidir cómo recuperar errores. Un cambio defectuoso ya compartido se revierte con git revert, conservando la historia. El rebase se reserva a la rama propia para actualizarla antes del PR. Si la prueba de stock falla después de una serie de cambios, git bisect ayuda a localizar el commit responsable. Los conflictos se resuelven contra el requisito y se verifican con pruebas; aceptar automáticamente una versión puede perder una validación esencial.

## Colaboración y revisión de cambios

El PR es el punto donde se explica el problema, se presenta el cambio y se revisa su evidencia. La descripción debe indicar el requisito cubierto, el comportamiento resultante y los comandos realmente ejecutados. Un comentario útil describe una consecuencia observable, por ejemplo que una actualización pueda reutilizar el SKU de otro producto, y solicita una prueba que reproduzca el caso.

Conventional Commits propone una estructura de mensaje que permite distinguir cambios funcionales, correcciones y cambios incompatibles. En este proyecto se emplean mensajes como docs(sdd), test(inventario) y feat(inventario). La convención mejora la lectura y puede apoyar automatizaciones, pero no sustituye la calidad del contenido del commit (Conventional Commits, s.f.).

Jordy debe solicitar a Marco la revisión del módulo y Marco debe presentar un cambio documental que Jordy pueda revisar. Una revisión asistida por IA debe declararse como tal. Una aprobación ejecutada por una herramienta desde otra cuenta no equivale a demostrar que el compañero leyó y entendió el código. La evidencia de trabajo en equipo requiere decisiones y comentarios personales de ambos integrantes.

La política propuesta para main requiere PR, una aprobación del otro integrante, el check calidad y actualización de aprobaciones si cambia el código. La revisión examina tanto el escenario esperado como los bordes: cantidades de cero, datos inexistentes, concurrencia y errores de red. No se permite resolver un CI rojo simplemente quitando la prueba que falla.

## Desarrollo basado en especificaciones

SDD trata la especificación como el artefacto central que guía implementación y validación. El valor no depende de producir muchos documentos, sino de precisar intención, límites y condiciones observables antes de pedir código. La especificación debe evolucionar cuando cambia el negocio y conservar una relación con las tareas y pruebas que la implementan (SpecDriven.ai, s.f.).

La constitución del proyecto fija Angular standalone, persistencia real y prohibición de saldos negativos. La especificación define RF01 a RF05 y explica entradas, respuestas y restricciones. El plan decide capas, rutas y transacciones. Las tareas distribuyen unidades revisables. El contrato OpenAPI describe cómo se comunican Angular y la API. Estos archivos están versionados y pueden revisarse sin ejecutar la aplicación.

GitHub Spec Kit aporta herramientas y un flujo que organiza constitución, especificación, planificación, tareas e implementación. Los nombres de habilidades dependen de la versión y de la integración del asistente. La documentación actual distingue estos comandos del asistente de las órdenes de terminal. El repositorio incluye una guía de ejecución y artefactos SDD adaptados manualmente; esa estructura no se presenta como prueba de haber ejecutado automáticamente la CLI (GitHub, s.f.-e).

### Ejemplo de aceptación del inventario

RF03 se expresa así: dado un lote con 10 kg, cuando dos solicitudes distintas intentan retirar 7 kg cada una al mismo tiempo, entonces solo una tiene éxito, el saldo final es 3 kg y existe una sola salida nueva. Otro escenario exige que repetir una referencia con el mismo contenido devuelva el resultado original, mientras reutilizarla con otra cantidad produzca un conflicto.

Estas condiciones revelan decisiones que un prompt vago dejaría abiertas. Un bloqueo visual del botón no resuelve las solicitudes de dos equipos. Un índice único no garantiza que saldo y kardex se guarden juntos. La especificación obliga a tratar concurrencia, atomicidad e idempotencia como reglas independientes. Si el docente pide devoluciones o ajustes, primero se define su significado y luego se amplía el contrato y las pruebas.

## DevOps e integración y entrega continuas

DevOps exige acuerdos de responsabilidad entre quienes cambian el producto y quienes lo operan. La integración continua verifica cambios frecuentes con una construcción automatizada y pruebas. Su propósito es detectar problemas cuando todavía son pequeños y recuperables. Ejecutar una herramienta de CI en ramas que nunca se integran no satisface toda la práctica de integración continua (Fowler, 2024).

GitHub Actions organiza la automatización en workflows activados por eventos, jobs ejecutados en runners y steps ordenados. En el prototipo, un push a ramas de trabajo y un PR hacia main activan el job calidad. Este instala con npm ci, ejecuta lint y tipos, pruebas, compilación e integración contra MongoDB. Se conserva el build Angular como artefacto para inspección o entrega (GitHub, s.f.-f).

El workflow separa calidad de publicar-imagen. El segundo job depende del primero y solo se ejecuta al cambiar main. Construye una imagen que incorpora Angular y la API, la etiqueta con el SHA y la publica en GHCR. La configuración demuestra un mecanismo de entrega de un artefacto instalable. Levantar el servicio con su base de datos y verificar salud, respaldos y recuperación constituye una etapa adicional de despliegue.

La seguridad del pipeline forma parte del diseño. Los permisos por defecto son de lectura de contenido; únicamente la publicación recibe permiso de escritura de paquetes. Los secretos no se guardan en YAML. Los PR ejecutan calidad sin publicar la imagen. La guía oficial recomienda privilegios mínimos y revisar cómo las acciones manejan credenciales (GitHub, s.f.-d). Como mejora posterior se propone fijar las acciones a SHA y automatizar la revisión de sus actualizaciones.

Si el stock falla en CI, el proceso debe detener la integración. Si una versión entregada introduce un error, se puede recuperar una imagen etiquetada por SHA y revertir el cambio mediante un nuevo commit. La recuperación de datos requiere su propio respaldo y plan: revertir código no deshace automáticamente las operaciones de inventario ya guardadas.

## Inteligencia artificial y GitHub Copilot

La IA facilita explorar una implementación y proponer pruebas, pero sus respuestas pueden omitir reglas de negocio o producir código inseguro. La revisión debe comprobar el resultado en el contexto del sistema. GitHub documenta limitaciones y responsabilidades del uso de sugerencias de Copilot; aceptar una respuesta por su apariencia o porque compila no demuestra corrección (GitHub, s.f.-c).

La ventana de contexto es limitada: el asistente no puede tratar todos los archivos y conversaciones como información disponible a la vez. Por ello se aporta una tarea pequeña con el requisito RF03, el contrato y los archivos relevantes. Las instrucciones de repositorio definen convenciones de implementación y comandos de validación, utilizando el archivo .github/copilot-instructions.md reconocido por GitHub (GitHub, s.f.-b).

Un prompt preparado solicita revisar cómo se conserva atomicidad entre saldo y kardex ante dos salidas simultáneas, identificar una prueba faltante y explicar el hallazgo antes de modificar archivos. Otro solicita detectar diferencias entre validación del formulario y del servidor. El resultado esperado no es una captura de código generado, sino un razonamiento contrastable y un cambio que supere las verificaciones.

Jordy declara acceso a Copilot Free. La propuesta no depende de funciones premium. La documentación incluye un registro para fecha real, modelo visible, contexto, prompt, respuesta y decisión humana. Debe distinguirse la asistencia de Codex durante la preparación de los artefactos del uso efectivo de GitHub Copilot en su propia interfaz. No se atribuyen a Copilot interacciones que todavía no se hayan realizado.

## Calidad de software y TDD

TDD alterna escribir una prueba del siguiente comportamiento, implementar lo necesario para satisfacerla y refactorizar conservando su resultado. La selección del siguiente caso orienta el diseño de la interfaz y el refactor evita acumular soluciones desordenadas. Una batería escrita únicamente al final verifica comportamiento, pero no demuestra ese orden de trabajo (Fowler, 2023).

Se conservó un registro rojo de las reglas de stock frente a una implementación inicial incompleta y un registro verde posterior. Los casos cubren salidas mayores al saldo, agotamiento exacto, cero, negativos, tipos inválidos y precisión decimal. Después, la lógica usa enteros de milésimas para calcular el saldo y MongoDB Decimal128 para persistirlo. La precisión acordada es de hasta tres decimales.

Las pruebas de Angular verifican contratos HTTP y rutas. La documentación oficial actual usa Vitest para nuevos proyectos y emulación del DOM; por ello no se copiaron opciones de ChromeHeadless propias de una configuración Karma diferente (Google, s.f.-a). El proyecto utiliza Node.js 24, compatible con Angular 22 de acuerdo con su tabla oficial (Google, s.f.-b).

Las pruebas de integración utilizan una base temporal aislada de MongoDB, aplican el esquema original y ejercen la API mediante HTTP. Comprueban que un lote duplicado no deje un kardex huérfano, que dos salidas concurrentes no sobrevendan y que solicitudes simultáneas con la misma referencia produzcan un solo asiento. Las transacciones permiten confirmar o descartar conjuntamente cambios en varios documentos (MongoDB, s.f.).

| Nivel | Pruebas locales observadas | Propósito |
| --- | --- | --- |
| Dominio | 8 | Reglas numéricas y tipos de movimiento |
| Angular | 6 | Contratos HTTP y navegación |
| Integración MongoDB | 15 | Persistencia, validadores, concurrencia y retiros |
| Total | 29 | Casos superados en la ejecución local registrada |

La cantidad de pruebas no constituye un porcentaje de cobertura ni una garantía de ausencia de defectos. No se afirma una cobertura medida porque no se produjo ese informe. Tampoco se atribuye a la ejecución local un resultado de Actions: el estado remoto debe consultarse por su run y SHA. La prueba visual de las pantallas complementa los casos automáticos, sin reemplazarlos.

## Gestión del proyecto

GitHub Projects permite combinar issues y PR en vistas de tabla, tablero y planificación. La información asociada a los elementos ayuda a seguir responsables y estados sin duplicar listas independientes. La herramienta admite distintos métodos; el equipo debe definir qué significa avanzar un elemento y qué evidencia permite cerrarlo (GitHub, s.f.-a).

La propuesta usa Backlog, In Progress, In Review y Done. Una tarea entra a In Review cuando tiene PR y verificaciones; llega a Done cuando cumple aceptación, revisión y fusión. El milestone v1.0-MVP agrupa el alcance del parcial. Un issue para RF03 describe el problema del saldo, sus escenarios y la prueba que lo comprueba, en lugar de una etiqueta genérica como terminar backend.

El límite propuesto de trabajo en curso es una tarea funcional por integrante. Marco prioriza documentación y contrato mientras Jordy implementa la infraestructura dependiente. Cuando surge una ambigüedad, se actualiza la especificación antes de ampliar el código. Este acuerdo reduce cambios simultáneos sobre los mismos archivos y facilita PR pequeños.

## Propuesta de adopción tecnológica

La adopción debe comenzar en el módulo de inventario y ampliarse después de comprobar el flujo. No se propone migrar de una sola vez las 26 colecciones funcionales ni automatizar un proceso todavía ambiguo. El piloto combina una regla de alto riesgo con un alcance que dos personas pueden explicar y verificar.

| Etapa | Acciones | Condición de salida |
| --- | --- | --- |
| Diagnóstico | Registrar incidentes y medir tiempos actuales | Línea base y alcance aprobados |
| Estandarización | Repositorio, mensajes, ramas y revisión | Cambio pequeño integrado por PR |
| SDD | Constitución, RF y contrato del inventario | Aceptación revisada por ambos |
| Automatización | CI, base aislada, build y contenedor | Falla reproducible bloquea integración |
| IA supervisada | Prompts con contexto y registro de decisiones | Sugerencia revisada y probada |
| Operación | Acceso, respaldos, despliegue y recuperación | Ensayo de recuperación satisfactorio |

### Planificación de dos semanas

El siguiente cronograma es una planificación propuesta, no una afirmación de actividad realizada en fechas pasadas. La historia del repositorio y las evidencias conservan sus fechas reales. La fecha académica prevista para la entrega es el 6 de noviembre de 2026.

| Días del plan | Actividad | Responsable principal |
| --- | --- | --- |
| 1 y 2 | Diagnóstico, requisitos y contrato | Marco con revisión de Jordy |
| 3 y 4 | Esquema, semillas, pruebas y API | Jordy |
| 5 y 6 | Rutas Angular y formularios | Jordy |
| 7 y 8 | Integración, Actions y PR cruzados | Ambos |
| 9 | Informe, referencias y evidencias | Marco |
| 10 | Ensayo, correcciones y presentación | Ambos |

### Impacto y costo beneficio

Los siguientes valores son supuestos de decisión, no datos históricos de By Fekas Corp. Se plantea una inversión de 32 horas a USD 10 por hora, equivalente a USD 320. El mantenimiento del flujo requiere 2 horas mensuales, equivalentes a USD 20. Si la automatización y la reducción de retrabajo ahorraran 8 horas al mes, el beneficio bruto sería USD 80 y el beneficio neto mensual USD 60. El retorno simple se alcanzaría en aproximadamente 5,3 meses, sin incluir infraestructura, impuestos ni variación de precios.

| Ahorro hipotético mensual | Beneficio bruto | Neto después de USD 20 | Retorno simple |
| --- | --- | --- | --- |
| 4 horas | USD 40 | USD 20 | 16 meses |
| 8 horas | USD 80 | USD 60 | 5,3 meses |
| 12 horas | USD 120 | USD 100 | 3,2 meses |

El costo de oportunidad del tiempo de revisión debe medirse. Si mantener documentos extensos consume más que el retrabajo evitado, se simplifican las especificaciones manteniendo criterios verificables. La cuenta gratuita de una herramienta tampoco elimina los costos de formación, mantenimiento o alojamiento. Se evita convertir una estimación económica en una promesa comercial.

La evaluación del piloto propone medir tiempo desde commit a despliegue, frecuencia de despliegue, tiempo de recuperación de despliegues fallidos, tasa de fallos y tasa de retrabajo por despliegue. DORA actualmente distingue estas cinco métricas. Deben analizarse juntas y por equipo, sin premiar entregas frecuentes que eleven incidentes (Harvey, s.f.). Se propone observar dos semanas de línea base y otras dos del piloto antes de afirmar reducciones porcentuales.

## Arquitectura y actividad práctica

Angular presenta las pantallas y consume la API mediante HttpClient. Las rutas cargan componentes independientes para resumen, catálogo, creación y edición de productos, lotes, movimientos y documentación del flujo. Los formularios muestran estados de carga y mensajes de error. La validación del navegador mejora la experiencia, mientras el servidor decide si una operación es válida.

La API valida entradas con Zod y conserva ObjectId, Date y Decimal128 del modelo original. Los índices únicos controlan SKU, combinación de bodega, producto y lote, y referencia de kardex. La creación de un lote inserta simultáneamente su entrada inicial. El retiro de producto es lógico y requiere saldo cero, de modo que el historial permanezca consultable.

El servidor arranca un replica set local de MongoDB en un puerto dedicado si no se configura una URI externa. Guarda los datos de demostración en una carpeta excluida de Git. El prototipo no implementa autenticación, aislamiento operativo entre empresas ni facturación electrónica. La arquitectura de seguridad del ZIP original es una referencia más amplia y no se atribuye como funcionalidad implementada en este módulo.

| Requisito | Implementación | Verificación |
| --- | --- | --- |
| RF01 | Catálogo y formularios | SKU único, edición y contratos HTTP |
| RF02 | Lotes y entrada inicial | Transacción y rollback por duplicado |
| RF03 | Saldo y movimientos | Concurrencia e idempotencia |
| RF04 | Resumen y alertas | Mínimos y unidades separadas |
| RF05 | Retiro lógico | Rechazo con stock y conservación histórica |

El repositorio del trabajo es https://github.com/Jordyrwd/by-fekas-erp-sdd. La carpeta evidence conserva registros y capturas locales. El evaluador puede reproducir la instalación con npm ci, la compilación y el arranque, y ejecutar las pruebas con una instancia MongoDB disponible. Las referencias a PR, tablero, pipeline y uso de Copilot deben verificarse en sus enlaces y registros efectivos al momento de la entrega.

## Reflexión sobre el proceso

### El problema que resuelve Git

Git permite coordinar cambios sobre una historia común y recuperar una versión explicable. En este caso vincula la regla que impide saldos negativos con el commit y las pruebas que la implementan. La posibilidad de comparar y revertir cambios reduce la dependencia de archivos sueltos. Su eficacia requiere mensajes claros, integración frecuente y acuerdos del equipo.

### La importancia actual de DevOps

DevOps permite tratar la entrega y la operación como responsabilidades del mismo proceso. El modelo propuesto comprueba la aplicación antes de integrar y produce un artefacto identificado por SHA. Esto reduce pasos manuales y hace investigable una falla. También obliga a planificar recuperación, respaldos y observación después de publicar, aspectos que un build exitoso no cubre.

### El cambio que introduce la inteligencia artificial

La IA aumenta la capacidad de proponer código, pero eleva la importancia de definir restricciones y evaluar resultados. En RF03, el valor del ingeniero consiste en descubrir que concurrencia e idempotencia son requisitos distintos y exigir una prueba para cada uno. El trabajo se desplaza hacia especificar, experimentar y auditar, conservando responsabilidad sobre el código aceptado.

### La herramienta de mayor utilidad

En el modelo de trabajo, GitHub Actions conecta reglas que de otro modo dependerían de la memoria de cada integrante. En la construcción local, las pruebas contra MongoDB fueron especialmente útiles porque comprobaron que una salida rechazada no dejara efectos parciales. La utilidad de Actions se confirma cuando esa misma verificación se ejecuta remotamente sobre el commit del PR y bloquea una integración defectuosa.

## Conclusiones y recomendaciones

El prototipo muestra cómo una regla empresarial puede atravesar especificación, contrato, implementación y verificación. El uso de una base real permitió comprobar condiciones que una simulación en memoria habría ocultado. La relación entre saldo y kardex requiere transacciones, y la repetición de solicitudes requiere además idempotencia. Cada control responde a un fallo diferente.

Para un equipo de dos personas y una versión activa, un flujo breve hacia main reduce coordinación innecesaria. La revisión del compañero debe examinar efectos y casos límite, y su ejecución personal debe quedar registrada. Las herramientas de IA aportan propuestas que necesitan contexto y evaluación; la evidencia debe identificar la herramienta utilizada realmente.

Se recomienda concluir la revisión cruzada de los PR, verificar el check remoto del commit entregado y completar el registro de Copilot antes de la exposición. Como siguiente etapa empresarial, se deben incorporar autenticación, autorización, aislamiento por tenant, copias de seguridad y ensayos de recuperación. El objetivo de la adopción es mejorar la capacidad de entregar y explicar cambios con seguridad, y sus beneficios deben medirse en el piloto.

## Referencias

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

## Apéndice A Resumen del inventario

Figura A1. Panel Angular conectado a MongoDB con seis productos iniciales ficticios, seis lotes y dos alertas.

Nota. Captura propia de la ejecución local del prototipo. Datos de demostración.

## Apéndice B Catálogo de insumos

Figura B1. Catálogo con búsqueda, categorías, saldos y acciones de edición y retiro lógico.

Nota. Captura propia de la ejecución local del prototipo. Datos de demostración.
