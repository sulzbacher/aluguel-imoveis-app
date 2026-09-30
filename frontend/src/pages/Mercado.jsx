import { ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavegacaoAbas } from '../components/Mercado/NavegacaoAbas'
import {
  createAlimentoBase,
  createReceita,
  gerarListaMercadoAuto,
  getDadosMercado,
  toggleItemCarrinho,
} from '../services/mercadoService'

import { AbaAlimentosBase } from '../components/Mercado/AbaAlimentosBase'
import { AbaCardapioSemanal } from '../components/Mercado/AbaCardapioSemanal'
import { AbaListaMercado } from '../components/Mercado/AbaListaMercado'
import { AbaReceitas } from '../components/Mercado/AbaReceitas'

// =============================================================================
// COMPONENTE PRINCIPAL (ORQUESTRADOR)
// =============================================================================
export function Mercado() {
  const [dados, setDados] = useState({
    alimentos_base: [],
    receitas: [],
    cardapio_semanal: { dias: {} },
    lista_mercado: [],
  })
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState('mercado')

  useEffect(() => {
    carregar()
  }, [])

  const carregar = async () => {
    setLoading(true)
    try {
      const res = await getDadosMercado()
      setDados(res || {})
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleCarrinho = async (id, noCarrinho) => {
    try {
      await toggleItemCarrinho(id, noCarrinho)
      carregar()
    } catch (err) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleGerarListaAuto = async () => {
    try {
      await gerarListaMercadoAuto()
      carregar()
      setAbaAtiva('mercado')
    } catch (err) {
      alert(`Erro ao gerar lista: ${err.message}`)
    }
  }

  const handleAddAlimento = async novoAlimento => {
    try {
      await createAlimentoBase(novoAlimento)
      carregar()
    } catch (err) {
      alert(`Erro ao salvar alimento: ${err.message}`)
    }
  }

  const handleAddReceita = async novaReceita => {
    try {
      await createReceita(novaReceita)
      carregar()
    } catch (err) {
      alert(`Erro ao salvar receita: ${err.message}`)
    }
  }

  if (loading)
    return <div className="text-center py-12 text-slate-400">Carregando planejador de dieta e mercado...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60">
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-emerald-400" /> Mercado & Dieta
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Planejamento semanal de refeições, tabela nutricional e carrinho de compras otimizado.
        </p>
      </div>

      {/* Navegação por Abas */}
      <NavegacaoAbas abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />

      {/* Conteúdo da Aba Ativa */}
      {abaAtiva === 'mercado' && (
        <AbaListaMercado
          lista={dados.lista_mercado || []}
          onToggleCarrinho={handleToggleCarrinho}
          onGerarListaAuto={handleGerarListaAuto}
        />
      )}

      {abaAtiva === 'cardapio' && (
        <AbaCardapioSemanal
          cardapio={dados.cardapio_semanal}
          receitas={dados.receitas || []}
          onGerarListaAuto={handleGerarListaAuto}
        />
      )}

      {abaAtiva === 'receitas' && (
        <AbaReceitas
          receitas={dados.receitas || []}
          alimentosBase={dados.alimentos_base || []}
          onAddReceita={handleAddReceita}
        />
      )}

      {abaAtiva === 'alimentos' && (
        <AbaAlimentosBase alimentos={dados.alimentos_base || []} onAddAlimento={handleAddAlimento} />
      )}
    </div>
  )
}
