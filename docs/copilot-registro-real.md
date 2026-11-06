# Registro real de GitHub Copilot

Fecha: 6 de noviembre de 2026. Cuenta: Jordyrwd. Herramienta: GitHub Copilot Free en github.com, modalidad Ask. Modelo: Auto; la interfaz de reintento identifica GPT-6 Luna. La consulta fue operada por Codex por solicitud del usuario; no se atribuye como sesión manual independiente de un estudiante.

Conversación: https://github.com/copilot/c/393436c3-a462-458c-8978-5c792ba6bdfa. La conversación puede requerir la sesión de su propietario; las capturas incluidas en la entrega conservan la evidencia visible.

## Contexto y prompt
Se adjuntó el repositorio Jordyrwd/by-fekas-erp-sdd y se solicitó revisar RF03, su especificación, repository.mjs, las reglas de existencias y las pruebas de integración. El escenario fue dos salidas de 7 kg sobre saldo 10 kg. Se pidió explicar transacciones y reintentos, recomendar una prueba y declarar límites; no modificar archivos ni afirmar que ejecutó pruebas. Algunas letras de las rutas se omitieron en la entrada de la interfaz; Copilot reconoció y corrigió explícitamente las rutas antes de consultar los archivos. La captura conserva el mensaje original.

## Respuesta y límites declarados
Copilot explicó que solo una salida debe aceptarse, con saldo final 3 kg; que saldo y kardex se confirman dentro de una transacción; y que se comparan lote, tipo, cantidad y motivo al reutilizar una referencia. Recomendó dos solicitudes simultáneas con la misma referencia y contenido diferente. Declaró que los cuerpos de algunas pruebas aparecieron truncados y que no ejecutó pruebas ni cambió archivos. Los enlaces consultados corresponden al cambio 4831a85 de main, cuya regla RF03 no cambió en la ampliación de consultas.

## Evaluación técnica asistida
Codex contrastó la explicación con la transacción, la condición de saldo y el manejo del índice único del servidor. La propuesta cubre una carrera diferente de la ya probada con solicitudes idénticas, por lo que se incorporó una prueba de regresión: una sola respuesta 201, una 409, un único asiento y un único efecto en el saldo. No se modificó la implementación del servidor para acomodar la prueba.

## Resultado real
La nueva prueba RF03 referencia simultánea con cantidades distintas conserva un solo efecto pasó contra MongoDB. La suite suma 8 de dominio, 12 Angular y 16 de integración: 36 en total. Las capturas son evidence/copilot-respuesta.png y evidence/copilot-recomendacion.png. El equipo debe leer y comprender esta evaluación antes de exponer; no se presenta como validación manual independiente realizada por Marco.
