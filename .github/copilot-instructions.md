# By Fekas ERP
Lee primero specs/001-inventario/spec.md, plan.md y contracts/openapi.json.
Angular standalone, rutas lazy, formularios reactivos, signals y TypeScript estricto.
La API Express usa MongoDB real y Decimal128. No reemplazar por localStorage.
Toda salida de inventario es atómica y registra kardex dentro de una transacción.
No permitir saldos negativos, SKU repetidos, lotes repetidos ni referencias reutilizadas con otro contenido.
No agregar autenticación aparente ni guardar secretos. El MVP es una demostración local de un solo tenant.
Antes de cambiar reglas, actualizar especificación y pruebas. Ejecutar npm run verify.
Explica archivos cambiados, límites, requisitos cubiertos y pruebas ejecutadas.
No inventes pruebas, fechas, revisiones humanas, resultados de CI ni uso de herramientas.
