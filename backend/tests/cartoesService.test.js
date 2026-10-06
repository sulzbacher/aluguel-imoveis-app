import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getMesesDisponiveisFaturas,
  lerComprasDoMes,
  normalizarMesKey,
  paraMesAno,
} from '../src/services/cartoes/cartoesService.js'

test('normalizarMesKey aceita os dois formatos de chave de mês', () => {
  assert.equal(normalizarMesKey('2026-10'), '01-10-2026')
  assert.equal(normalizarMesKey('01-10-2026'), '01-10-2026')
})

test('paraMesAno converte as chaves de fatura para o formato usado no select do front', () => {
  assert.equal(paraMesAno('2026-10'), '2026-10')
  assert.equal(paraMesAno('01-09-2026'), '2026-09')
})

test('getMesesDisponiveisFaturas expõe meses válidos em ordem recente primeiro', () => {
  const meses = getMesesDisponiveisFaturas()
  assert.ok(Array.isArray(meses))
  assert.ok(meses.includes('2026-09'))
  assert.ok(meses.includes('2026-10'))
  assert.equal(meses[0], '2026-10')
})

test('lerComprasDoMes retorna array do mês escolhido sem depender do catálogo de cartões', () => {
  const compras = lerComprasDoMes('2026-10')
  assert.ok(Array.isArray(compras))
})
