# Práctica de Git avanzado

Se ejecutó un laboratorio aislado para demostrar conflicto y resolución, recuperación temporal con stash, rebase, integración de avance rápido y cherry-pick. No se modificó la historia pública del ERP ni las fechas de las contribuciones.

Los resultados íntegros se encuentran en evidence/git-avanzado.txt. El ZIP incluye evidence/git-avanzado.bundle para inspeccionar la historia del laboratorio. Sus commits están identificados como laboratorio y no representan aportes de Marco o Jordy al producto.

## Qué se comprobó
- Dos ramas modificaron la misma regla y Git detectó un conflicto real. La resolución conservó validación de saldo y registro del kardex.
- Un archivo temporal se guardó con stash y se recuperó; se comprobó su ausencia y reaparición.
- Una rama documental se actualizó con rebase sobre una base que había avanzado y se integró con avance rápido.
- Una corrección aislada se trasladó con cherry-pick.

## Aplicación al ERP
Rebase se reserva para una rama propia; una corrección compartida se revierte mediante un nuevo cambio para conservar trazabilidad. Cada integración debe respetar especificación, revisión y pruebas. El laboratorio explica las operaciones y sus efectos; el repositorio público acredita ramas, PR, comprobaciones y participación real.
