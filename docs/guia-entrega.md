GUÍA PARA ABRIR EL PROYECTO BY FEKAS ERP

1. INFORME Y DIAPOSITIVAS
Abre con Word: Informe_Final_ERP_Camaronera_UTMACH.docx.
Abre con PowerPoint: Presentacion_Final_By_Fekas.pptx. Pulsa F5 para exponer.
Ambos están junto a esta guía. No se necesita un PDF.

2. CARPETA RECOMENDADA EN ESTE EQUIPO
La versión consolidada, con tus rutas y las consultas ampliadas, está en:
C:\Users\Jordy\Documents\Codex\2026-11-05\c-users-jordy-downloads-portafolio-gestion-2\outputs\by-fekas-erp-sdd

En VS Code: Archivo > Abrir carpeta > selecciona esa carpeta.
Tu carpeta de edición original Proyecto_By_Fekas_Angular_SDD/by-fekas-erp-sdd se conserva intacta. El respaldo de su código está en work/respaldo-rutas-jordy.zip.

3. ABRIR LA APLICACIÓN
Requisitos: Node.js 24.15 o superior de la rama 24 y MongoDB con mongod disponible en PATH.
En la terminal de VS Code, desde la carpeta recomendada:

npm ci
npm run build
npm start

Espera el mensaje de arranque y abre http://127.0.0.1:3000.
Deja abierta esa terminal mientras usas el sistema. Para detenerlo, pulsa Ctrl+C.
Si ya existe una instancia de la demostración, detén esa instancia antes de iniciar otra. La vista de comprobación usada durante la preparación fue http://127.0.0.1:3001; ese puerto no es el arranque predeterminado.

Alternativa: desde PowerShell, dentro de la carpeta, ejecuta:
.\INICIAR.ps1

Para editar con recarga automática: npm run dev. Abre http://localhost:4200.
Para comprobar calidad: npm run verify. Requiere MongoDB disponible para las pruebas de integración.

4. SI LO ABRES DESDE EL ZIP EN OTRO EQUIPO
Extrae Proyecto_By_Fekas_Angular_SDD_Final.zip; abre la carpeta by-fekas-erp-sdd en VS Code y sigue el paso 3.
El ZIP no incluye node_modules ni datos persistidos. npm ci instala las dependencias; el arranque prepara datos ficticios de demostración.

5. QUÉ ABRIR DURANTE LA DEMOSTRACIÓN
/dashboard: resumen, alertas y composición por categoría.
/productos: catálogo y enlace a la ficha de cada insumo.
/productos/nuevo: alta de insumo.
/lotes y /lotes/nuevo: consulta y registro separados.
/movimientos y /movimientos/nuevo: kardex, filtros, CSV y registro separados.
/flujo: explicación del proceso.
specs/001-inventario/spec.md: especificación ampliada en español.
.github/workflows/ci.yml: automatización.
docs/copilot-registro-real.md: uso real de Copilot y regresión comprobada.
docs/git-avanzado.md y evidence/git-avanzado.txt: laboratorio real de Git avanzado.

6. GITHUB
Repositorio: https://github.com/Jordyrwd/by-fekas-erp-sdd
Versión ampliada: https://github.com/Jordyrwd/by-fekas-erp-sdd/tree/feature/consultas-reportes
Tablero público: https://github.com/users/Jordyrwd/projects/1
Hito: https://github.com/Jordyrwd/by-fekas-erp-sdd/milestone/1
CI del código con 36 pruebas: https://github.com/Jordyrwd/by-fekas-erp-sdd/actions/runs/42201409544
PR 1 fusionado: https://github.com/Jordyrwd/by-fekas-erp-sdd/pull/1
PR 5 de Marco, con cambios solicitados: https://github.com/Jordyrwd/by-fekas-erp-sdd/pull/5
PR 6 de ampliación, pendiente de revisión de Marco: https://github.com/Jordyrwd/by-fekas-erp-sdd/pull/6

Mientras PR 6 no esté integrado, para clonar la ampliación usa:
git clone --branch feature/consultas-reportes https://github.com/Jordyrwd/by-fekas-erp-sdd.git

7. PENDIENTES PERSONALES DEL EQUIPO
Marco debe completar docs/revision-marco.md en su rama con lo que realmente revisó y comprobó; el PR 5 contiene una línea vacía al cierre de esta entrega.
Después, Jordy revisa de nuevo ese aporte. Marco también debe revisar el último cambio de PR 6 y dejar su comentario propio. Con aprobación y CI satisfactorios puede integrarse PR 6; main exige una aprobación y calidad.
El tablero, hito y protección están configurados. Copilot Free se utilizó realmente con asistencia de Codex y se incorporó una prueba sugerida: 36 pruebas en total. El equipo debe comprender el registro antes de exponer.
