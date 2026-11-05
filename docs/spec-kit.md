# SDD y GitHub Spec Kit

La especificación, constitución, plan y tareas incluidas son artefactos SDD escritos en el proyecto. No se afirma que esta carpeta haya sido generada automáticamente por la CLI de Spec Kit.

## Demostración con la herramienta oficial
Consultar primero https://github.github.com/spec-kit/quickstart.html porque los nombres de comandos cambian por versión e integración. Instalar la CLI oficial siguiendo su README, fijar una versión publicada y anotar `specify --version`.

En una copia o rama nueva del repositorio, ejecutar `specify init --here --ai copilot` según la ayuda de la versión instalada. Revisar el diff antes de aceptar sobrescrituras. La extensión o modo de Copilot elegido determina la sintaxis de sus habilidades.

En el modo actual de habilidades de Copilot, el flujo documentado incluye `/speckit-constitution`, `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement` y `/speckit-converge`. Algunas integraciones y versiones utilizan `/speckit.constitution` y la forma con puntos. Son comandos del asistente, no órdenes que deban pegarse en PowerShell.

Usar como entrada la especificación RF01 a RF05 ya revisada. Comparar la salida generada con el contrato y las pruebas. Guardar versión de herramienta, prompt y diff real. Si la CLI no se ejecutó, presentar los documentos como adaptación manual del proceso, no como ejecución comprobada de Spec Kit.
