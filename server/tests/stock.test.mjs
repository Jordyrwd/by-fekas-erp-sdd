import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextStock, quantity } from '../domain/stock.mjs';

test('RF03 salida válida descuenta saldo', () => assert.equal(nextStock(10, 'salida', 7), 3));
test('RF03 rechaza salida mayor al saldo', () => assert.throws(() => nextStock(10, 'salida', 11), /Stock insuficiente/));
test('RF03 entrada agrega saldo sin error decimal', () => assert.equal(nextStock(0.1, 'entrada', 0.2), 0.3));
test('RF03 rechaza cero y negativos', () => { for (const n of [0, -1]) assert.throws(() => nextStock(10, 'entrada', n)); });
test('RF03 rechaza NaN, infinito, texto y precisión excesiva', () => { for (const n of [NaN, Infinity, '2', 0.0001]) assert.throws(() => quantity(n)); });
test('RF03 rechaza tipo y saldo inválidos', () => { assert.throws(() => nextStock(10, 'ajuste', 2)); assert.throws(() => nextStock(-1, 'salida', 1)); });
test('RF03 permite agotar un lote exactamente', () => assert.equal(nextStock(1.005, 'salida', 1.005), 0));
test('RF03 limita el saldo máximo', () => assert.throws(() => nextStock(1000000, 'entrada', 1), /máximo/));
