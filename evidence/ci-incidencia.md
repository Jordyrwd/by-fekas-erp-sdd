# Incidencia real de compatibilidad del runner
El run 42132714667 del PR 1 superó instalación, lint, 14 pruebas de dominio y Angular y build. MongoDB 8.0 se detuvo antes de las pruebas de integración con el mensaje de incompatibilidad de kernel SERVER-121912.

Cambiar solo ubuntu-latest por ubuntu-24.04 no resolvió la incidencia. Los logs adicionales permitieron identificar la causa. Se fijó la imagen mongo:9.0.4, cuya documentación incluye soporte actualizado para Ubuntu y el ajuste de comprobación del kernel.

Fuentes oficiales consultadas:
- https://jira.mongodb.org/browse/SERVER-131779
- https://www.mongodb.com/docs/manual/release-notes/9.0/

El resultado posterior debe consultarse en el run del commit corregido. La incidencia no se ocultó eliminando las pruebas de integración.
