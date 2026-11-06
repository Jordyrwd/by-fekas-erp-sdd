export function quantity(value, allowZero = false) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || (!allowZero && value === 0) || value > 1000000 || Math.abs(value * 1000 - Math.round(value * 1000)) > 1e-6) {
    throw new Error('Cantidad inválida: máximo 1000000 y 3 decimales');
  }
  return Math.round(value * 1000);
}

export function nextStock(current, type, amount) {
  const balance = quantity(current, true);
  const delta = quantity(amount);
  if (!['entrada', 'salida'].includes(type)) throw new Error('Tipo de movimiento inválido');
  const next = balance + (type === 'entrada' ? delta : -delta);
  if (next < 0) throw new Error('Stock insuficiente');
  if (next > 1000000000) throw new Error('Saldo supera el máximo');
  return next / 1000;
}
