import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const configPath = path.join(__dirname, '../../data/config_orcamento.json')
const gastosPath = path.join(__dirname, '../../data/gastos_mensais.json')
const rendaPath = path.join(__dirname, '../../data/renda_casal.json')

function lerJSON(caminho, padrao) {
  try {
    if (fs.existsSync(caminho)) {
      return JSON.parse(fs.readFileSync(caminho, 'utf8'))
    }
  } catch (err) {
    console.error(`Erro ao ler ${caminho}:`, err)
  }
  return padrao
}

// -----------------------------------------------------------------------------
// 1. MINI FUNÇÃO: Finanças Globais (Rendas e Gastos Fixos Pessoais)
// -----------------------------------------------------------------------------
function obterFinancasCasal() {
  const gastos = lerJSON(gastosPath, [])
  const renda = lerJSON(rendaPath, { carol: { entradas: [] }, neno: {} })

  // 1. Renda Carol (Entradas fixas)
  const rendaCarol = (renda.carol?.entradas || []).reduce((acc, c) => acc + Number(c.valor || 0), 0)

  // 2. Renda Neno (Soma as entradas do array OU pega a base_estimada)
  const entradasNenoArray = renda.neno?.entradas || renda.neno?.entradas_variaveis || []
  let rendaNeno = entradasNenoArray.reduce((acc, c) => acc + Number(c.valor || 0), 0)

  // Se o Neno não tiver entradas cadastradas no array, usa a base estimada de R$ 5.900
  if (rendaNeno === 0 && renda.neno?.base_estimada) {
    rendaNeno = Number(renda.neno.base_estimada)
  }

  const rendaTotalCasal = rendaCarol + (rendaNeno || 5900)

  // 3. Gastos Pessoais Contínuos (Soma apenas os que NÃO são substituídos)
  const gastosFixosContinuos = gastos
    .filter(g => !g.substituidoNaMudanca)
    .reduce((acc, g) => acc + Number(g.valor || 0), 0)

  return { rendaTotalCasal, gastosFixosContinuos }
}

// -----------------------------------------------------------------------------
// 2. MINI FUNÇÃO: Custos do Imóvel & Despesas Fixas Variáveis
// -----------------------------------------------------------------------------
function calcularCustosImovel(imovel, config) {
  const aluguel = Number(imovel.financeiro?.aluguel || 0)
  const condominio = Number(imovel.financeiro?.condominio || 0)
  const iptu = Number(imovel.financeiro?.iptu || 0)
  const custoImobiliariaSemSeguro = aluguel + condominio + iptu

  const taxaSeguroPercentual = Number(imovel.financeiro?.taxa_seguro_fianca ?? 30)
  const valorSeguroFianca = Math.round((aluguel * taxaSeguroPercentual) / 100)
  const custoImobiliariaComSeguro = custoImobiliariaSemSeguro + valorSeguroFianca

  // Contas do Imóvel (Luz, Net, Água, Gás, Tel)
  const add = imovel.financeiro?.custos_adicionais || config.custos_variaveis_padrao
  const padrao = config.custos_variaveis_padrao

  const detalhesDespesas = {
    luz: Number(add.luz ?? padrao.luz),
    internet: Number(add.internet ?? padrao.internet),
    agua: Number(add.agua ?? padrao.agua),
    gas: Number(add.gas ?? padrao.gas),
    telefone: Number(add.telefone_outros ?? padrao.telefone_outros),
  }

  const totalDespesasPessoais = Object.values(detalhesDespesas).reduce((a, b) => a + b, 0)

  return {
    custoImobiliariaSemSeguro,
    taxaSeguroPercentual,
    valorSeguroFianca,
    custoImobiliariaComSeguro,
    detalhesDespesas,
    totalDespesasPessoais,
    custoTotalComSeguro: custoImobiliariaComSeguro + totalDespesasPessoais,
    custoTotalSemSeguro: custoImobiliariaSemSeguro + totalDespesasPessoais,
  }
}

// -----------------------------------------------------------------------------
// 3. MINI FUNÇÃO: Pontuação Financeira e Ajuste de Orçamento
// -----------------------------------------------------------------------------
function calcularScoreFinanceiro(custoTotal, config) {
  const limite = config.limite_orcamento_mensal
  let bonusOuPenalidadeOrcamento = 0

  if (custoTotal <= limite) {
    bonusOuPenalidadeOrcamento = config.regras_pontuacao.bonus_dentro_do_limite
  } else {
    const excedente = custoTotal - limite
    const fator = config.regras_pontuacao.penalidade_por_100_reais_acima
    bonusOuPenalidadeOrcamento = -Math.round((excedente / 100) * fator)
  }

  let scoreFinanceiro = 100 - Math.max(0, (custoTotal - limite) / 50)
  scoreFinanceiro = Math.max(0, scoreFinanceiro)

  return {
    limiteOrcamento: limite,
    dentroDoOrcamento: custoTotal <= limite,
    bonusOuPenalidadeOrcamento,
    scoreFinanceiro,
  }
}

// -----------------------------------------------------------------------------
// 4. MINI FUNÇÃO: Mobilidade e Distâncias
// -----------------------------------------------------------------------------
function calcularScoreMobilidade(analiseGeo) {
  const distDivina = Number(analiseGeo?.divina_comedia?.km ?? analiseGeo?.distancia_divina_comedia_km ?? 0)
  let scoreDivina = 0
  if (distDivina > 0) {
    scoreDivina = Math.max(0, 100 - Math.max(0, distDivina - 3) * 4)
  }

  const distAero = Number(analiseGeo?.aeroporto?.km ?? analiseGeo?.distancia_aeroporto_km ?? 0)
  let scoreAeroporto = 0
  if (distAero > 0) {
    scoreAeroporto = Math.max(0, 100 - Math.max(0, distAero - 8) * 1.5)
  }

  return { scoreDivina, scoreAeroporto }
}

// -----------------------------------------------------------------------------
// 5. MINI FUNÇÃO: Bônus Estruturais (Quartos, m², Gatos, Garagem)
// -----------------------------------------------------------------------------
function calcularBonusEstrutural(estrutura) {
  let bonus = 0

  if (estrutura?.facil_telar_gatos) bonus += 15
  if (estrutura?.quintal_fundos) bonus += 15
  if ((estrutura?.quartos || 0) >= 3) bonus += 10
  if ((estrutura?.vagas_garagem || 0) >= 2) bonus += 10

  // Regra de Metragem (m²)
  const m2 = Number(estrutura?.metro_quadrado || 0)
  if (m2 >= 100) {
    bonus += 15
  } else if (m2 >= 60) {
    bonus += 10
  } else if (m2 > 0 && m2 < 39) {
    bonus -= 10
  }

  return bonus
}

// -----------------------------------------------------------------------------
// FUNÇÃO PRINCIPAL
// -----------------------------------------------------------------------------
export function calcularScoreImovel(imovel) {
  const config = lerJSON(configPath, {
    limite_orcamento_mensal: 4500,
    custos_variaveis_padrao: { luz: 250, internet: 120, agua: 80, gas: 90, telefone_outros: 100 },
    regras_pontuacao: { bonus_dentro_do_limite: 20, penalidade_por_100_reais_acima: 10 },
  })

  // 1. Dados Financeiros Globais do Casal
  const { rendaTotalCasal, gastosFixosContinuos } = obterFinancasCasal()

  // 2. Custos do Imóvel Específico
  const custos = calcularCustosImovel(imovel, config)

  // 3. Sobra Líquida
  const sobraLiquidaComSeguro = rendaTotalCasal - gastosFixosContinuos - custos.custoTotalComSeguro
  const sobraLiquidaSemSeguro = rendaTotalCasal - gastosFixosContinuos - custos.custoTotalSemSeguro

  // 4. Módulo Financeiro
  const finScore = calcularScoreFinanceiro(custos.custoTotalComSeguro, config)

  // 5. Módulo Mobilidade
  const mobScore = calcularScoreMobilidade(imovel.analise_geo)

  // 6. Score Base Automático (Pesos: 50% Financeiro, 35% Divina, 15% Aeroporto)
  const scoreBase = finScore.scoreFinanceiro * 0.5 + mobScore.scoreDivina * 0.35 + mobScore.scoreAeroporto * 0.15

  // 7. Atributos Estruturais
  const bonusEstrutural = calcularBonusEstrutural(imovel.estrutura)

  // 8. Penalidade Enchente
  const penalidadeGeo = imovel.analise_geo?.em_zona_enchente_2024 ? 80 : 0

  // 9. Bônus Manuais do Casal
  const bonusCaroline = Number(imovel.avaliacoes_pessoais?.caroline?.bonus_manual || 0)
  const bonusNeno = Number(imovel.avaliacoes_pessoais?.neno?.bonus_manual || 0)

  // Score Final
  const scoreFinal =
    scoreBase + bonusEstrutural + finScore.bonusOuPenalidadeOrcamento - penalidadeGeo + bonusCaroline + bonusNeno

  return {
    custoImobiliaria: custos.custoImobiliariaComSeguro,
    custoImobiliariaSemSeguro: custos.custoImobiliariaSemSeguro,
    taxaSeguroPercentual: custos.taxaSeguroPercentual,
    valorSeguroFianca: custos.valorSeguroFianca,
    totalDespesasPessoais: custos.totalDespesasPessoais,
    custoTotalReal: custos.custoTotalComSeguro,
    custoTotalSemSeguro: custos.custoTotalSemSeguro,
    rendaTotalCasal,
    gastosFixosContinuos,
    sobraLiquidaComSeguro,
    sobraLiquidaSemSeguro,
    limiteOrcamento: finScore.limiteOrcamento,
    dentroDoOrcamento: finScore.dentroDoOrcamento,
    bonusOuPenalidadeOrcamento: finScore.bonusOuPenalidadeOrcamento,
    detalhesDespesas: custos.detalhesDespesas,
    scoreBase: parseFloat(scoreBase.toFixed(1)),
    bonusEstrutural,
    penalidadeGeo,
    scoreFinal: parseFloat(scoreFinal.toFixed(1)),
  }
}
