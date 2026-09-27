import { AlertCircle, ArrowRight, Award, Calendar, CheckCircle2, CreditCard, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCartoes, getGastosERendas, getHistoricoGastosMes, getImoveis } from '../services/api'

export function Dashboard() {
  const [topImoveis, setTopImoveis] = useState([])
  const [financas, setFinancas] = useState({ resumo: {}, renda: {} })
  const [cartoesData, setCartoesData] = useState({ cartoes: [], totalFaturasGeral: 0 })
  const [historicoMes, setHistoricoMes] = useState({ contas: [], resumo: {} })
  const [loading, setLoading] = useState(true)

  const mesAtual = '2026-10'

  useEffect(() => {
    carregar()
  }, [])

  const carregar = async () => {
    try {
      const [imoveisData, financasData, cartoesRes, historicoRes] = await Promise.all([
        getImoveis(),
        getGastosERendas(),
        getCartoes(),
        getHistoricoGastosMes(mesAtual),
      ])

      setTopImoveis(imoveisData ? imoveisData.slice(0, 3) : [])
      setFinancas(financasData || {})
      setCartoesData(cartoesRes || {})
      setHistoricoMes(historicoRes || {})
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-400">Carregando painel financeiro...</div>

  const contasProximas = (historicoMes.contas || []).filter(c => !c.pago).slice(0, 4)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* BOAS-VINDAS & RESUMO MENSAL */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-800/40 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Painel de Acompanhamento ({mesAtual})
          </span>
          <h1 className="text-2xl font-black text-slate-100">CasalHome Dashboard</h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Visão centralizada de faturas de cartões, fluxo de caixa mensal e os melhores imóveis selecionados.
          </p>
        </div>

        {/* Card do Progresso do Mês */}
        <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl min-w-[260px] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Contas Pagas no Mês</span>
            <span className="font-bold text-emerald-400">{historicoMes.resumo?.percentualConcluido || 0}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${historicoMes.resumo?.percentualConcluido || 0}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] pt-1">
            <span className="text-slate-400">Restante:</span>
            <span className="font-bold text-rose-400">
              R$ {(historicoMes.resumo?.totalPendente || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* LINHA 1: CARTÕES DE CRÉDITO & RESUMO FINANCEIRO */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Bloco Finanças Gerais */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-400" /> Orcamento do Casal
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded font-bold">Entradas</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block">Renda Total Casal</span>
              <p className="text-2xl font-black text-emerald-400">
                R$ {(financas.resumo?.rendaTotalCasal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Carol (Ambev):</span>
                <span className="font-semibold text-slate-200">
                  R$ {(financas.resumo?.rendaCarol || 0).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Neno (Shows/Freelas):</span>
                <span className="font-semibold text-slate-200">
                  R$ {(financas.resumo?.rendaNeno || 0).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/gastos"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold pt-2 border-t border-slate-700/40"
          >
            Acessar Planilha de Gastos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Bloco Resumo dos Cartões de Crédito (2 colunas) */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-4 md:col-span-2 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-400" /> Faturas dos Cartões de Crédito
              </span>
              <span className="text-xs font-bold text-rose-400">
                Total: R$ {(cartoesData.totalFaturasGeral || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {cartoesData.cartoes?.map(c => {
                const perc = c.limite > 0 ? Math.min(100, Math.round((c.limiteComprometido / c.limite) * 100)) : 0
                return (
                  <div key={c.id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-200">{c.nome}</span>
                      <span className="text-[10px] text-slate-400">{c.titular}</span>
                    </div>
                    <p className="text-base font-black text-rose-400">
                      R$ {c.faturaAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${perc > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${perc}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 block text-right">{perc}% limite usado</span>
                  </div>
                )
              })}
            </div>
          </div>

          <Link
            to="/cartoes"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold pt-2 border-t border-slate-700/40"
          >
            Gerenciar Compras & Assinaturas nos Cartões <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* LINHA 2: TOP 3 IMÓVEIS NO RANKING */}
      <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> Líderes do Ranking de Imóveis
          </span>
          <Link
            to="/ranking"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            Ver Ranking Completo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {topImoveis.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {topImoveis.map((imovel, index) => (
              <div
                key={imovel.id}
                className="bg-slate-900/80 border border-slate-700/60 p-4 rounded-xl space-y-3 flex flex-col justify-between hover:border-slate-600 transition"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/40">
                      #{index + 1} Lugar
                    </span>
                    <span className="text-xs font-black text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-700/50">
                      Score: {imovel.calculos?.scoreFinal || 0}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm line-clamp-1">{imovel.titulo}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{imovel.endereco}</p>

                  <div className="pt-2 space-y-1 text-xs border-t border-slate-800">
                    <div className="flex justify-between text-slate-300">
                      <span>Custo Est. Total:</span>
                      <span className="font-bold text-emerald-400">
                        R$ {(imovel.calculos?.custoTotalReal || 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Sobra Líquida:</span>
                      <span className="font-bold text-slate-200">
                        R$ {(imovel.calculos?.sobraLiquidaComSeguro || 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/imovel/${imovel.id}`}
                  className="text-center text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded-lg transition font-medium mt-2"
                >
                  Ver Ficha Detalhada
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">Nenhum imóvel cadastrado ainda.</p>
        )}
      </div>

      {/* LINHA 3: PRÓXIMOS VENCIMENTOS PENDENTES */}
      <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" /> Próximas Contas a Pagar no Mês
          </span>
          <span className="text-xs text-slate-400">{contasProximas.length} contas pendentes</span>
        </div>

        {contasProximas.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {contasProximas.map(conta => (
              <div key={conta.gasto_id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Vencimento</span>
                  <span className="font-bold text-amber-400">Dia {conta.dia_vencimento || 10}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-200 truncate">{conta.descricao}</h4>
                <p className="text-sm font-black text-rose-400">
                  R$ {Number(conta.valor_previsto || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Todas as contas deste mês já foram pagas!
          </div>
        )}
      </div>
    </div>
  )
}
