import { ArrowRight, Award, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGastosERendas, getImoveis } from '../services/api'

export function Dashboard() {
  const [topImovel, setTopImovel] = useState(null)
  const [financas, setFinancas] = useState({ resumo: {} })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregar()
  }, [])

  const carregar = async () => {
    try {
      const [imoveisData, financasData] = await Promise.all([getImoveis(), getGastosERendas()])
      if (imoveisData && imoveisData.length > 0) {
        setTopImovel(imoveisData[0]) // Imóvel #1 do ranking
      }
      setFinancas(financasData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-400">Carregando painel principal...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Boas-vindas */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-800/40 p-6 rounded-3xl space-y-2">
        <h1 className="text-2xl font-black text-slate-100">Painel Financeiro & Habitação do Casal</h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Visão geral consolidada dos orçamentos, da sobra líquida estimada no mês e do imóvel líder nas preferências da
          Carol e do Neno.
        </p>
      </div>

      {/* Grid de Atalhos e Estatísticas */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card Renda vs Gastos */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Finanças do Mês</span>
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Renda Total Casal</span>
            <p className="text-2xl font-black text-emerald-400">
              R$ {(financas.resumo?.rendaTotalCasal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-700/40 flex justify-between text-xs text-slate-300">
            <span>Gastos Fixos Pessoais:</span>
            <span className="font-bold">R$ {(financas.resumo?.gastosQueContinuam || 0).toLocaleString('pt-BR')}</span>
          </div>
          <Link
            to="/gastos"
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold pt-1"
          >
            Ver Planilha de Gastos completa <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card Imóvel Líder do Ranking */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3 md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> Imóvel #1 no Ranking
              </span>
              <span className="text-xs font-black text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-700/50">
                Score: {topImovel?.calculos?.scoreFinal || 0}
              </span>
            </div>

            {topImovel ? (
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-100">{topImovel.titulo}</h3>
                <p className="text-xs text-slate-400">{topImovel.endereco}</p>
                <div className="pt-2 flex flex-wrap gap-3 text-xs">
                  <span className="text-emerald-400 font-bold">
                    Custo Est: R$ {(topImovel.calculos?.custoTotalReal || 0).toLocaleString('pt-BR')}/mês
                  </span>
                  <span className="text-slate-300 font-semibold">
                    Sobra Líquida: R$ {(topImovel.calculos?.sobraLiquidaComSeguro || 0).toLocaleString('pt-BR')}/mês
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Nenhum imóvel cadastrado no ranking ainda.</p>
            )}
          </div>

          <Link
            to="/ranking"
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold pt-3"
          >
            Explorar Ranking Completo de Imóveis <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
