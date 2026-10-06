import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cartoesPath = path.join(__dirname, '../../../data/cartoes_credito.json')
const gastosPath = path.join(__dirname, '../../../data/gastos_mensais.json')
const faturasPath = path.join(__dirname, '../../../data/faturas_cartoes.json')

export function lerJSON(caminho, padrao) {
  try {
    if (fs.existsSync(caminho)) {
      return JSON.parse(fs.readFileSync(caminho, 'utf8'))
    }
  } catch (err) {
    console.error(`Erro ao ler ${caminho}:`, err)
  }
  return padrao
}

export function salvarJSON(caminho, dados) {
  try {
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf8')
  } catch (err) {
    console.error(`Erro ao salvar ${caminho}:`, err)
  }
}

export function getMesFaturaAtual(data = new Date()) {
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()
  return `01-${mes}-${ano}`
}

export function normalizarMesKey(mes) {
  if (!mes) return getMesFaturaAtual()

  if (/^\d{4}-\d{2}$/.test(mes)) {
    const [ano, mesNumero] = mes.split('-')
    return `01-${mesNumero}-${ano}`
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(mes)) {
    return mes
  }

  return getMesFaturaAtual()
}

export function paraMesAno(mesKey) {
  const chave = normalizarMesKey(mesKey)
  const match = /^\d{2}-(\d{2})-(\d{4})$/.exec(chave)
  if (!match) return getMesFaturaAtual()

  const [, mes, ano] = match
  return `${ano}-${mes}`
}

function parseMesFaturaKey(chave) {
  const match = /^\d{2}-\d{2}-\d{4}$/.exec(chave || '')
  if (!match) return null

  const [dia, mes, ano] = chave.split('-')
  return new Date(Number(ano), Number(mes) - 1, Number(dia))
}

export function getMesFaturaMaisRecente(faturas = lerDadosFaturas()) {
  const chaves = Object.keys(faturas || {}).filter(chave => parseMesFaturaKey(chave))

  if (!chaves.length) {
    return getMesFaturaAtual()
  }

  return chaves.sort((a, b) => parseMesFaturaKey(b) - parseMesFaturaKey(a))[0]
}

export function getMesesDisponiveisFaturas() {
  const faturas = lerDadosFaturas()
  const meses = Object.keys(faturas || {})
    .map(normalizarMesKey)
    .filter(Boolean)
    .sort((a, b) => parseMesFaturaKey(b) - parseMesFaturaKey(a))
    .map(chave => paraMesAno(chave))

  return [...new Set(meses)]
}

export function lerDadosCartoes() {
  const dados = lerJSON(cartoesPath, { cartoes: [] })

  return {
    ...(dados || {}),
    cartoes: Array.isArray(dados?.cartoes) ? dados.cartoes : [],
  }
}

export function salvarDadosCartoes(dados) {
  const payload = {
    ...(dados || {}),
    cartoes: Array.isArray(dados?.cartoes) ? dados.cartoes : [],
  }

  salvarJSON(cartoesPath, payload)
}

export function lerDadosFaturas() {
  const dados = lerJSON(faturasPath, {})
  return dados && typeof dados === 'object' ? dados : {}
}

export function lerComprasDoMes(mesKey = getMesFaturaAtual()) {
  const faturas = lerDadosFaturas()
  const chaveDisponivel = faturas?.[mesKey] ? mesKey : getMesFaturaMaisRecente(faturas)
  const mes = faturas?.[chaveDisponivel] || {}
  return Array.isArray(mes.compras) ? mes.compras : []
}

export function salvarComprasDoMes(compras, mesKey = getMesFaturaAtual()) {
  const faturas = lerDadosFaturas()
  const payloadCompras = Array.isArray(compras) ? compras : []

  faturas[mesKey] = {
    ...(faturas[mesKey] || {}),
    compras: payloadCompras,
  }

  salvarJSON(faturasPath, faturas)
  return payloadCompras
}

export function sincronizarComGastosMensais() {
  const gastos = lerJSON(gastosPath, [])
  const compras = lerComprasDoMes()

  const faturaCaixa = compras
    .filter(c => c.cartao_id === 'cartao_caixa_mulher')
    .reduce((a, b) => a + Number(b.valor_parcela || 0), 0)

  const faturaNeon = compras
    .filter(c => c.cartao_id === 'cartao_neon_neno')
    .reduce((a, b) => a + Number(b.valor_parcela || 0), 0)

  const faturaNubank = compras
    .filter(c => c.cartao_id === 'cartao_nubank_neno')
    .reduce((a, b) => a + Number(b.valor_parcela || 0), 0)

  const gCaixa = gastos.find(g => /caixa mulher/i.test(g.descricao))
  if (gCaixa) gCaixa.valor = faturaCaixa

  const gNeon = gastos.find(g => /neon/i.test(g.descricao))
  if (gNeon) gNeon.valor = faturaNeon

  const gNubank = gastos.find(g => /nubank/i.test(g.descricao))
  if (gNubank) gNubank.valor = faturaNubank

  salvarJSON(gastosPath, gastos)
}

export function fecharEAvancarFaturaCartao(cartaoId, mesPago) {
  const cartao = lerDadosCartoes().cartoes.find(c => c.id === cartaoId)
  if (!cartao) return

  const mesKey = mesPago || getMesFaturaAtual()
  const faturas = lerDadosFaturas()
  const comprasMes = Array.isArray(faturas?.[mesKey]?.compras) ? faturas[mesKey].compras : []
  const comprasAtuais = comprasMes.filter(compra => compra.cartao_id === cartaoId)
  const novasCompras = []

  comprasAtuais.forEach(compra => {
    if (compra.totalParcelas && compra.totalParcelas > 1) {
      const proximaParcela = Number(compra.parcelaAtual || 1) + 1

      if (proximaParcela <= compra.totalParcelas) {
        novasCompras.push({
          ...compra,
          parcelaAtual: proximaParcela,
        })
      }
    }
  })

  const comprasRestantes = comprasMes.filter(compra => compra.cartao_id !== cartaoId)
  faturas[mesKey] = {
    ...(faturas[mesKey] || {}),
    compras: [...comprasRestantes, ...novasCompras],
  }

  const novaFatura = novasCompras.reduce((acc, c) => acc + Number(c.valorParcela || c.valor || 0), 0)
  const totalComprometido = novasCompras.reduce((acc, c) => {
    const parcelasRestantes = (c.totalParcelas || 1) - (c.parcelaAtual - 1)
    return acc + Number(c.valorParcela || c.valor) * parcelasRestantes
  }, 0)

  salvartFaturas(faturas)
  cartao.faturaAtual = parseFloat(novaFatura.toFixed(2))
  cartao.limiteComprometido = parseFloat(totalComprometido.toFixed(2))
  cartao.limiteDisponivel = parseFloat((Number(cartao.limite || 0) - totalComprometido).toFixed(2))

  salvarDadosCartoes({ cartoes: lerDadosCartoes().cartoes })
}

function salvartFaturas(faturas) {
  salvarJSON(faturasPath, faturas)
}

export function processarViradaFatura(
  mesAtualKey = '01-09-2026',
  mesProximoKey = '01-10-2026',
  cartaoId = 'cartao_caixa_mulher'
) {
  const dataPath = path.join(process.cwd(), 'data', 'faturas_cartoes.json')

  if (!fs.existsSync(dataPath)) return

  const faturasData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  const faturaAtual = faturasData[mesAtualKey]?.compras || []

  const comprasProximaFatura = []

  faturaAtual.forEach(compra => {
    if (compra.cartao_id !== cartaoId) return

    if (compra.tipo === 'Recorrente') {
      comprasProximaFatura.push({
        ...compra,
        id: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        parcela_atual: 1,
      })
    } else if (compra.tipo === 'Parcelado') {
      if (compra.parcelas_totais > 1 && compra.parcela_atual < compra.parcelas_totais) {
        comprasProximaFatura.push({
          ...compra,
          id: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          parcela_atual: compra.parcela_atual + 1,
        })
      }
    }
  })

  if (!faturasData[mesProximoKey]) {
    faturasData[mesProximoKey] = { compras: [] }
  }

  faturasData[mesProximoKey].compras = comprasProximaFatura

  fs.writeFileSync(dataPath, JSON.stringify(faturasData, null, 2), 'utf8')

  return comprasProximaFatura
}
