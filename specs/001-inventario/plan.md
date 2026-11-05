# Plan técnico
Angular 22 con componentes standalone y carga por rutas. Express 5 ofrece REST en /api. MongoDB replica set conserva el esquema original sin modificarlo. El inicializador aplica validadores e índices del archivo database/by_fekas_corp_db.mongodb.js usando el driver oficial.

## Rutas
/dashboard resumen; /productos lista; /productos/nuevo alta; /productos/editar/:id edición; /lotes listado y alta; /movimientos kardex y registro; /flujo documentación del proceso; comodín 404.

## Capas
core/models contratos TypeScript; core/services HTTP; features pantallas; shared estados y errores; server/domain reglas puras; server/repository persistencia; server/app HTTP; database esquema original.

## Persistencia
Tenant, granja, bodega y usuario fijos de demostración con ObjectId. Las relaciones se verifican en la aplicación porque MongoDB no impone claves foráneas. Todo movimiento y la creación de lote usan sesiones con transacción. Un índice único conserva referencia por tenant y evita duplicados. La actualización de stock usa condición cantidad_actual >= cantidad.

## Estrategia Git
main estable y ramas feature breves. No se exige develop porque el equipo tiene dos integrantes y una sola versión activa. Compararemos esta decisión con Git Flow en el informe. Cada PR incluye requisito, prueba y revisión del otro integrante. La protección requerida es calidad y una aprobación sin autoaprobación.

## Entrega
Una imagen Docker contiene build Angular y API; la base se ejecuta separada como replica set. El CD publica la imagen en GHCR desde main tras superar CI. La publicación de imagen no implica despliegue de una base pública.
