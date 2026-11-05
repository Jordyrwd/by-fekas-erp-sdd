# Especificación del inventario acuícola

## Contexto y alcance
Caso académico ficticio de una software house ecuatoriana que mantiene el ERP acuícola By Fekas Corp. El ZIP de referencia define 26 colecciones MongoDB, pero no incorpora datos de una empresa en producción. El MVP implementa insumos_productos, lotes_inventario y movimientos_kardex, con granja y bodega de demostración. Los datos iniciales son ficticios.

## Requisitos funcionales y aceptación

### RF01 Catálogo de insumos
Como bodeguero quiero registrar, buscar y editar insumos para identificar el inventario.
Given un SKU nuevo y nombre, categoría, unidad y stock mínimo válidos
When guardo el insumo
Then la API responde 201 y el producto permanece tras reiniciar el servidor.
Given un SKU existente, incluso inactivo
When creo o actualizo otro producto con ese SKU
Then responde 409 sin modificar el catálogo.
El SKU se normaliza a mayúsculas. Categorías: balanceado, probiotico, quimico, fertilizante, otro. Unidades: kg, l, unidad. Nombre 2 a 100 caracteres, stock mínimo de 0 a 1000000 con máximo 3 decimales.

### RF02 Registro de lotes
Given un producto activo, un código nuevo, una fecha y cantidad positiva
When registro un lote
Then se crea el lote y su entrada inicial en una misma transacción.
Given el mismo código de lote para producto y bodega
When intento registrarlo otra vez
Then responde 409.

### RF03 Movimientos y concurrencia
Como bodeguero quiero registrar entradas y salidas sin saldos negativos.
Given un lote con 10 kg disponibles
When solicito una salida de 11 kg
Then responde 409 y saldo y kardex permanecen intactos.
Given un lote con 10 kg
When dos solicitudes concurrentes solicitan 7 kg cada una
Then solo una tiene éxito, el saldo final es 3 kg y se registra una sola salida.
Given una referencia ya procesada
When repito exactamente la operación
Then devuelve el resultado original sin descontar otra vez.
Given una referencia ya procesada
When la reutilizo con cantidad, tipo, lote o motivo diferentes
Then responde 409.
Las cantidades son positivas, máximo 1000000 y precisión de 3 decimales. El saldo total del lote no puede superar 1000000. No se admiten ajustes ambiguos en este MVP.

### RF04 Alertas y resumen
Given productos y lotes
When consulto el panel
Then muestra productos activos, lotes, valor referencial, alertas y movimientos recientes.
Un producto activo genera alerta si su saldo agregado es menor o igual al mínimo. Unidades distintas se muestran separadas y no se suman como si fueran equivalentes.

### RF05 Retiro lógico
Given un producto sin saldo
When lo retiro
Then activo pasa a false y permanece su historial.
Given un producto con saldo positivo
When intento retirarlo
Then responde 409.

## Requisitos no funcionales
RNF01 Persistencia MongoDB con validación BSON, índices únicos y replica set para transacciones.
RNF02 Formularios accesibles, errores visibles, diseño adaptable y rutas independientes.
RNF03 API y servidor de demostración enlazados a 127.0.0.1 por defecto.
RNF04 Pipeline reproducible con npm ci, lint, tests, build y pruebas de integración MongoDB.
RNF05 No subir .env, bases de datos ni credenciales al repositorio.

## Fuera del alcance
Facturación electrónica, validación tributaria SRI, pagos, nómina, multitenancy operativo, autenticación y autorización de producción. El usuario demo fijo no representa una sesión autenticada.

## Decisiones aclaradas antes de implementar
La base es MongoDB, no un arreglo en memoria. Usamos cantidades BSON Decimal128; la API recibe y entrega números con máximo 3 decimales. El retiro es lógico para conservar auditoría. La referencia es única por tenant y actúa como clave de idempotencia.
