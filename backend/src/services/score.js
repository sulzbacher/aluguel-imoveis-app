import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const configPath = path.join(__dirname, '../../data/config_orcamento.json')

// Carrega as configurações de orçamento
function carregarConfigOrcamento() {
  const padrao = {
    limite_orcamento_mensal: 4500,
    custos_variaveis_padrao: {
      luz: 250,
      internet: 120,
      agua: 80,
      gas: 90,
      telefone_outros: 100,
    },
    regras_pontuacao: {
      bonus_dentro_do_limite: 20,
      penalidade_por_100_reais_acima: 10,
    },
  }

  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8')
      return JSON.parse(data)
    }
  } catch (err) {
    console.warn('Aviso: Usando configurações padrão de orçamento.')
  }

  return padrao
}

export function calcularScoreImovel(imovel) {
  const config = carregarConfigOrcamento()

  // 1. Custos Básicos Imobiliária
  const aluguel = Number(imovel.financeiro?.aluguel || 0)
  const condominio = Number(imovel.financeiro?.condominio || 0)
  const iptu = Number(imovel.financeiro?.iptu || 0)
  const custoImobiliaria = aluguel + condominio + iptu

  // 2. Custos Variáveis (Padrão do JSON ou Sobrescrito no Imóvel)
  const despesasFixas = imovel.financeiro?.custos_adicionais || config.custos_variaveis_padrao

  const luz = Number(despesasFixas.luz ?? config.custos_variaveis_padrao.luz)
  const internet = Number(despesasFixas.internet ?? config.custos_variaveis_padrao.internet)
  const agua = Number(despesasFixas.agua ?? config.custos_variaveis_padrao.agua)
  const gas = Number(despesasFixas.gas ?? config.custos_variaveis_padrao.gas)
  const telefone = Number(despesasFixas.telefone_outros ?? config.custos_variaveis_padrao.telefone_outros)

  const totalDespesasPessoais = luz + internet + agua + gas + telefone

  // 3. Orçamento Total Estimado para Morar no Imóvel
  const custoTotalReal = custoImobiliaria + totalDespesasPessoais

  // 4. Cálculo de Pontuação Financeira e Bônus/Penalidade de Limite
  const limite = config.limite_orcamento_mensal
  let bonusOuPenalidadeOrcamento = 0

  if (custoTotalReal <= limite) {
    // Imóvel dentro do orçamento ganha BÔNUS EXTRA!
    bonusOuPenalidadeOrcamento = config.regras_pontuacao.bonus_dentro_do_limite
  } else {
    // Penalidade proporcional para cada R$ 100 acima do limite
    const excedente = custoTotalReal - limite
    const fatorPenalidade = config.regras_pontuacao.penalidade_por_100_reais_acima
    bonusOuPenalidadeOrcamento = -Math.round((excedente / 100) * fatorPenalidade)
  }

  // Pontuação Base Financeira (Escala de 0 a 100)
  let scoreFinanceiro = 100 - Math.max(0, (custoTotalReal - limite) / 50)
  scoreFinanceiro = Math.max(0, scoreFinanceiro)

  // 5. Módulo de Mobilidade (Distâncias)
  const distDivina = imovel.analise_geo?.distancia_divina_comedia_km || 0
  let scoreDivina = 100 - Math.max(0, distDivina - 3) * 4
  scoreDivina = Math.max(0, scoreDivina)

  const distAero = imovel.analise_geo?.distancia_aeroporto_km || 0
  let scoreAeroporto = 100 - Math.max(0, distAero - 8) * 1.5
  scoreAeroporto = Math.max(0, scoreAeroporto)

  // 6. Score Base Automático
  const scoreBase = scoreFinanceiro * 0.5 + scoreDivina * 0.35 + scoreAeroporto * 0.15

  // 7. Bônus Estruturais
  let bonusEstrutural = 0
  if (imovel.estrutura?.facil_telar_gatos) bonusEstrutural += 15
  if (imovel.estrutura?.quintal_fundos) bonusEstrutural += 15
  if ((imovel.estrutura?.quartos || 0) >= 3) bonusEstrutural += 10
  if ((imovel.estrutura?.vagas_garagem || 0) >= 2) bonusEstrutural += 10

  // 8. Penalidade Enchente
  let penalidadeGeo = 0
  if (imovel.analise_geo?.em_zona_enchente_2024) {
    penalidadeGeo += 80
  }

  // 9. Bônus Manuais do Casal
  const bonusCaroline = Number(imovel.avaliacoes_pessoais?.caroline?.bonus_manual || 0)
  const bonusNeno = Number(imovel.avaliacoes_pessoais?.neno?.bonus_manual || 0)

  // Score Final Completo
  const scoreFinal =
    scoreBase + bonusEstrutural + bonusOuPenalidadeOrcamento - penalidadeGeo + bonusCaroline + bonusNeno

  return {
    custoImobiliaria,
    totalDespesasPessoais,
    custoTotalReal,
    limiteOrcamento: limite,
    dentroDoOrcamento: custoTotalReal <= limite,
    bonusOuPenalidadeOrcamento,
    detalhesDespesas: { luz, internet, agua, gas, telefone },
    scoreBase: parseFloat(scoreBase.toFixed(1)),
    bonusEstrutural,
    penalidadeGeo,
    scoreFinal: parseFloat(scoreFinal.toFixed(1)),
  }
}
