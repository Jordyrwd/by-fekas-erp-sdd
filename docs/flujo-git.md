# Flujo colaborativo

Jordy lidera la implementación y DevOps; Marco mantiene especificaciones y gestión. Cada uno revisa el PR del otro después de leer el diff y ejecutar las pruebas que correspondan.

## Flujo elegido
main estable y ramas breves feature/* o docs/*. Integrar diariamente si la revisión y las pruebas lo permiten. Para este equipo pequeño no se utiliza develop permanente. Esta elección corresponde a GitHub Flow con integración frecuente; no basta con nombrar una rama para demostrar Trunk Based Development.

## Comandos
```powershell
git clone https://github.com/Jordyrwd/by-fekas-erp-sdd.git
cd by-fekas-erp-sdd
git switch -c feature/validacion-sku
# escribir primero prueba de un requisito
npm run verify
git add src server specs
git commit -m "fix(inventario): impedir SKU duplicado al editar"
git push -u origin feature/validacion-sku
```

Abrir PR a main, enlazar Issue, solicitar al compañero, resolver observaciones y esperar CI. Solo el otro integrante debe dar la aprobación humana. Las acciones de un asistente a través de otra cuenta no sustituyen la lectura y revisión personal.

## Git avanzado aplicado
Usar `git fetch` antes de integrar cambios, `git rebase origin/main` solo en la propia rama y sin reescribir main. Para deshacer un cambio ya compartido, usar `git revert <sha>`. Resolver conflictos revisando la regla de negocio y ejecutando las pruebas, no aceptando automáticamente una versión. `git bisect` permite localizar un commit que rompe una prueba reproducible. Si se reescribe una rama propia ya publicada, usar `--force-with-lease` y coordinar con el compañero.

## Protección de main
Requerir PR, una aprobación y check `calidad`. Descartar aprobaciones si cambia el código. Evitar force push y eliminación de main. Configurar después de que exista el primer check y comprobar que un PR fallido no pueda fusionarse. Esta política solo se considera aplicada cuando GitHub la confirma.
