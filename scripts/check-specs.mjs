import fs from 'node:fs/promises';
for (const file of ['specs/001-inventario/spec.md', 'specs/001-inventario/plan.md', '.specify/memory/constitution.md']) {
  const text = await fs.readFile(file, 'utf8');
  if (text.length < 100) throw new Error(`Especificación incompleta: ${file}`);
}
console.log('Especificaciones presentes');
