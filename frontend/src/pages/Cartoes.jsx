import { ArrowLeft, Check, CreditCard, Edit2, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createCompra, deleteCompra, getCartoes, updateLimiteCartao } from '../services/api'

export function Cartoes() {
  const [data, setData] = useState({ cartoes: [], totalFaturasGeral: 0 })
  const [loading, setLoading] = useState(true)
  const [editandoLimiteId, setEditandoLimiteId] = useState(null)
  const [novoLimiteInput, setNovoLimiteInput] = useState('')

  // Form para nova compra
  const [form, setForm] = useState({
    cartao_id: 'cartao_caixa_mulher',
    descricao: '',
    categoria: 'Geral',
    valor_total: '',
    parcelas_totais: '1',
    tipo: 'Parcelado',
  })

  useEffect(() => {
    carregar()
  }, [])

  const carregar = async () => {
    try {
      const res = await getCartoes()
      setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSalvarLimite = async cartaoId => {
    try {
      await updateLimiteCartao(cartaoId, Number(novoLimiteInput))
      setEditandoLimiteId(null)
      carregar()
    } catch (err) {
      alert(`Erro ao atualizar limite: ${err.message}`)
    }
  }

  const handleAddCompra = async e => {
    e.preventDefault()
    if (!form.descricao || !form.valor_total) return

    try {
      await createCompra({
        ...form,
        valor_total: Number(form.valor_total),
        parcelas_totais: Number(form.parcelas_totais),
      })
      setForm({
        cartao_id: 'cartao_caixa_mulher',
        descricao: '',
        categoria: 'Geral',
        valor_total: '',
        parcelas_totais: '1',
        tipo: 'Parcelado',
      })
      carregar()
    } catch (err) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleDeleteCompra = async id => {
    if (confirm('Remover esta compra do cartão?')) {
      await deleteCompra(id)
      carregar()
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-400">Carregando gestão de cartões...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Voltar */}
      <Link to="/gastos" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Voltar para Gastos Mensais
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-400" /> Gestão de Cartões & Faturas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Acompanhamento de limite disponível, assinaturas e parcelas dos 3 cartões do casal.
          </p>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80 text-right">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Faturas do Mês</span>
          <span className="text-xl font-black text-rose-400">
            R$ {(data.totalFaturasGeral || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* CARDS DOS 3 CARTÕES DE CRÉDITO */}
      <div className="grid md:grid-cols-3 gap-6">
        {data.cartoes?.map(c => {
          const percentualUso = c.limite > 0 ? Math.min(100, Math.round((c.limiteComprometido / c.limite) * 100)) : 0

          return (
            <div
              key={c.id}
              className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{c.nome}</h3>
                    <span className="text-[10px] text-slate-400">Titular: {c.titular}</span>
                  </div>
                  <span className="bg-indigo-950/80 text-indigo-300 border border-indigo-700/40 text-[10px] font-bold px-2 py-0.5 rounded">
                    Fatura: R$ {c.faturaAtual.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Edição do Limite */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Limite Total:</span>
                    {editandoLimiteId === c.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={novoLimiteInput}
                          onChange={e => setNovoLimiteInput(e.target.value)}
                          className="w-20 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-100"
                        />
                        <button
                          onClick={() => handleSalvarLimite(c.id)}
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="font-bold text-slate-200 flex items-center gap-1">
                        R$ {Number(c.limite || 0).toLocaleString('pt-BR')}
                        <button
                          onClick={() => {
                            setEditandoLimiteId(c.id)
                            setNovoLimiteInput(c.limite || '')
                          }}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Limite Disponível:</span>
                    <span className="font-bold text-emerald-400">R$ {c.limiteDisponivel.toLocaleString('pt-BR')}</span>
                  </div>

                  {/* Barra de Progresso do Limite */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full transition-all ${
                        percentualUso > 80 ? 'bg-rose-500' : percentualUso > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentualUso}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block text-right">
                    {percentualUso}% do limite comprometido
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* FORMULÁRIO PARA ADICIONAR NOVA COMPRA / PARCELA / ASSINATURA */}
      <form onSubmit={handleAddCompra} className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-4">
        <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-400" /> Lançar Compra / Assinatura / Parcela
        </h3>

        <div className="grid md:grid-cols-6 gap-3">
          {/* Seleção do Cartão */}
          <div className="md:col-span-1">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Selecione o Cartão</label>
            <select
              value={form.cartao_id}
              onChange={e => setForm({ ...form, cartao_id: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
            >
              <option value="cartao_caixa_mulher">Caixa Mulher (Carol)</option>
              <option value="cartao_neon_neno">Neon (Neno)</option>
              <option value="cartao_nubank_neno">Nubank (Neno)</option>
            </select>
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Descrição</label>
            <input
              type="text"
              placeholder="Ex: Netflix, Curso Domestika, Roupas..."
              required
              value={form.descricao}
              onChange={e => setForm({ ...form, descricao: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
            />
          </div>

          {/* Tipo de Lançamento */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tipo de Cobrança</label>
            <select
              value={form.tipo}
              onChange={e =>
                setForm({
                  ...form,
                  tipo: e.target.value,
                  parcelas_totais: e.target.value === 'Recorrente' ? '1' : form.parcelas_totais,
                })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 font-medium"
            >
              <option value="Parcelado">Compra Parcelada</option>
              <option value="Recorrente">Assinatura Recorrente</option>
            </select>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              {form.tipo === 'Recorrente' ? 'Valor Mensal (R$)' : 'Valor Total (R$)'}
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              required
              value={form.valor_total}
              onChange={e => setForm({ ...form, valor_total: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
            />
          </div>

          {/* Parcelas Totais (Disponível apenas se for Parcelado) */}
          {form.tipo === 'Parcelado' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nº de Parcelas</label>
              <input
                type="number"
                min="1"
                max="48"
                value={form.parcelas_totais}
                onChange={e => setForm({ ...form, parcelas_totais: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
        >
          {form.tipo === 'Recorrente' ? 'Lançar Assinatura Recorrente' : 'Lançar Compra Parcelada'}
        </button>
      </form>

      {/* LISTA DE COMPRAS LANÇADAS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-indigo-400" /> Lançamentos nos Cartões
        </h2>

        <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/60 bg-slate-900/60 text-slate-400 text-xs uppercase font-semibold">
                <th className="p-3.5">Cartão</th>
                <th className="p-3.5">Descrição</th>
                <th className="p-3.5">Parcelas</th>
                <th className="p-3.5">Valor da Parcela</th>
                <th className="p-3.5">Valor Total</th>
                <th className="p-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 text-xs text-slate-200">
              {data.cartoes?.flatMap(cartao =>
                cartao.compras.map(compra => (
                  <tr key={compra.id} className="hover:bg-slate-700/20 transition">
                    <td className="p-3.5 font-bold text-slate-300">{cartao.nome}</td>
                    <td className="p-3.5 font-medium">{compra.descricao}</td>
                    <td className="p-3.5 text-slate-400">
                      {compra.parcelas_totais > 1
                        ? `${compra.parcela_atual} de ${compra.parcelas_totais}x`
                        : 'À Vista / Assinatura'}
                    </td>
                    <td className="p-3.5 font-bold text-rose-400">
                      R$ {Number(compra.valor_parcela || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} /mês
                    </td>
                    <td className="p-3.5 text-slate-400">
                      R$ {Number(compra.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteCompra(compra.id)}
                        className="p-1 text-rose-400 hover:bg-rose-950/40 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
