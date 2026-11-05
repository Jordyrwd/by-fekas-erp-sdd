# Constitución del proyecto
Versión 1.0.0. Caso académico By Fekas Corp. Responsable técnico Jordy Romero. Responsable de especificaciones Marco Dumagual.

1. Cada funcionalidad comienza con criterios observables en specs/001-inventario/spec.md.
2. Los datos conservan las colecciones, tipos BSON y validadores del esquema proporcionado por el estudiante.
3. El saldo y el kardex cambian en una misma transacción MongoDB. Se prohíben cantidades negativas y sobreventa.
4. El código se organiza en core, features y shared; la lógica del servidor queda fuera del navegador.
5. Las ramas son breves y pasan por PR, revisión cruzada y CI antes de main.
6. La IA asiste; los integrantes revisan código y documentan su intervención real.
7. El MVP no se expone a Internet sin autenticación, autorización, TLS y operación segura.
