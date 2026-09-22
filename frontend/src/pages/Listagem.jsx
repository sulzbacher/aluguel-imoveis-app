import { Home, LayoutList, Plus, Table } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ImovelCard } from '../components/ImovelCard'
import { RankingTable } from '../components/RankingTable'
import { getImoveis } from '../services/api'

export function Listagem() {
  const [imoveis, setImoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [modoVisualizacao, setModoVisualizacao] = useState('cards') // 'cards' ou 'tabela'

  useEffect(() => {
    carregarImoveis()
  }, [])

  const carregarImoveis = async () => {
    try {
      const data = await getImoveis()
      setImoveis(data)
    } catch (err) {
      console.error('Erro ao buscar imóveis:', err)
    } finally {
      setLoading(false)
    }
  }

  // Renderização condicional isolada para evitar ternários aninhados
  const renderConteudo = () => {
    if (loading) {
      return <div className="text-center py-12 text-slate-400">Carregando ranking de imóveis...</div>
    }

    if (imoveis.length === 0) {
      return (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-12 text-center">
          <Home className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-300">Nenhum imóvel cadastrado</h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">Adicione o primeiro imóvel para ver a análise no ranking.</p>
          <Link
            to="/novo"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" /> Cadastrar Agora
          </Link>
        </div>
      )
    }

    if (modoVisualizacao === 'tabela') {
      return <RankingTable imoveis={imoveis} />
    }

    return (
      <div className="grid gap-4">
        {imoveis.map((imovel, index) => (
          <ImovelCard key={imovel.id} imovel={imovel} posicao={index + 1} />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Home className="w-8 h-8 text-indigo-400" />
            Ranking de Imóveis
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Imóveis ordenados pelo algoritmo automático + preferências da Caroline e do Neno.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Seletor de visualização (Cards / Tabela) */}
          {imoveis.length > 0 && (
            <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center gap-1">
              <button
                onClick={() => setModoVisualizacao('cards')}
                className={`p-2 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  modoVisualizacao === 'cards' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Modo Cards"
              >
                <LayoutList className="w-4 h-4" /> Cards
              </button>
              <button
                onClick={() => setModoVisualizacao('tabela')}
                className={`p-2 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  modoVisualizacao === 'tabela' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Modo Tabela Comparativa"
              >
                <Table className="w-4 h-4" /> Tabela
              </button>
            </div>
          )}

          <Link
            to="/novo"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-5 h-5" /> Cadastrar Imóvel
          </Link>
        </div>
      </div>

      {/* Conteúdo Renderizado (Sem ternários aninhados) */}
      {renderConteudo()}
    </div>
  )
}
