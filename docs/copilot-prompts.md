# Uso de GitHub Copilot

Copilot Free declarado por Jordy. No se requieren funciones premium ni revisión automática de PR. Las cuotas y modelos dependen de la cuenta; revisar disponibilidad en el editor antes de la demostración.

## Prompt 1 revisión de la regla RF03
Abre specs/001-inventario/spec.md y server/repository.mjs. Revisa RF03. Explica cómo se garantiza atomicidad entre saldo y kardex y qué sucede con dos salidas simultáneas de 7 cuando el saldo es 10. Señala un caso de prueba que falte. No cambies archivos todavía.

## Prompt 2 prueba de regresión
Con base en RF01 y en los tests existentes, propón una prueba que cambie el SKU de un producto por el de otro. Debe esperar HTTP 409 y comprobar que el nombre y el SKU anteriores permanecen intactos. No elimines validaciones ni modifiques el esquema MongoDB.

## Prompt 3 revisión Angular
Lee src/app/features/products/product-form.ts y el contrato OpenAPI. Identifica diferencias entre validación de cliente y servidor para SKU, nombre y cantidades. Propón un cambio mínimo y explica cómo verificarlo. No uses any ni sustituyas HttpClient por localStorage.

## Registro de uso real
Guardar por cada interacción: fecha real, integrante, herramienta y modelo visible, archivos de contexto, prompt, respuesta, decisión humana y prueba ejecutada. Los prompts anteriores están preparados; no constituyen evidencia de ejecución. Este proyecto también recibió asistencia de Codex, que debe distinguirse del uso posterior de Copilot.

## Riesgos y revisión
Una sugerencia puede compilar y aun violar el negocio. Revisar concurrencia, exactitud decimal, acceso a datos y dependencias. No pegar credenciales ni información de clientes reales. Una revisión automática nunca reemplaza la aprobación de Marco o Jordy.
