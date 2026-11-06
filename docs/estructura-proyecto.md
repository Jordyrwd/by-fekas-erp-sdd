# Organización del proyecto

La aplicación tiene dos partes de ejecución: `src` es el cliente Angular y `server` la interfaz de servicios y las reglas del servidor. No es necesario que las carpetas se llamen frontend y backend para que exista esa separación.

| Carpeta | Finalidad |
|---|---|
| src | Componentes, rutas, formularios y servicios Angular. |
| server | Servicios HTTP, reglas de inventario, persistencia y pruebas del servidor. |
| database | Esquema MongoDB proporcionado, con validadores e índices. |
| specs y .specify | Especificación, contratos, plan y constitución SDD solicitados en el trabajo. |
| .github | Automatización de calidad y guías para Copilot. |
| docs | Investigación, decisiones y guías de reproducción. |
| evidence | Capturas y resultados reales de verificación. |
| public | Recursos estáticos de Angular. |
| scripts | Comprobaciones auxiliares. |
| dist | Resultado generado al compilar; se puede regenerar. |
| node_modules y .angular | Dependencias y caché locales; no se entregan en el código fuente. |
| data | Persistencia local de la demostración; no se publica en GitHub. |

## Rutas conservadas del trabajo de Jordy
El catálogo y las listas permanecen separados de las altas: /productos/nuevo, /lotes/nuevo y /movimientos/nuevo. Se conserva el diseño y la navegación de su versión. La ficha /producto/:id y los filtros de consulta se integran como ampliación. Los archivos raíz configuran instalación, compilación, contenedor y pruebas, por lo que no se trasladan únicamente para reducir el número visible de carpetas.
