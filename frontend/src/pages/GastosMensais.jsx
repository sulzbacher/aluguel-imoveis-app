import { DollarSign, Trash2, TrendingUp, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createGasto, createRenda, deleteGasto, deleteRenda, getGastosERendas } from '../services/api'

export function GastosMensais() {
  const [data, setData] = useState({ gastos: [], renda: {}, resumo: {} })
  const [loading, setLoading] = useState(true)

  // Form Gasto
  const [formGasto, setFormGasto] = useState({
    descricao: '',
    categoria: 'Geral',
    valor: '',
    tipo: 'Fixo Pessoal',
    substituidoNaMudanca: false,
  })

  // Form Renda Neno (Freelas/Inconstantes)
  const [formRendaNeno, setFormRendaNeno] = useState({
    descricao: '',
    valor: '',
    data: '',
    tipo: 'Flexível / Freela',
  })

  useEffect(() => {
    carregar()
  }, [])

  const carregar = async () => {
    try {
      const res = await getGastosERendas()
      setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddGasto = async e => {
    e.preventDefault()
    if (!formGasto.descricao || !formGasto.valor) return
    try {
      await createGasto({ ...formGasto, valor: Number(formGasto.valor) })
      setFormGasto({ descricao: '', categoria: 'Geral', valor: '', tipo: 'Fixo Pessoal', substituidoNaMudanca: false })
      carregar()
    } catch (err) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleDeleteGasto = async id => {
    if (confirm('Remover esta despesa?')) {
      await deleteGasto(id)
      carregar()
    }
  }

  const handleAddRendaNeno = async e => {
    e.preventDefault()
    if (!formRendaNeno.descricao || !formRendaNeno.valor) return
    try {
      await createRenda('neno', { ...formRendaNeno, valor: Number(formRendaNeno.valor) })
      setFormRendaNeno({ descricao: '', valor: '', data: '', tipo: 'Flexível / Freela' })
      carregar()
    } catch (err) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleDeleteRenda = async (pessoa, id) => {
    if (confirm('Remover esta entrada de renda?')) {
      await deleteRenda(pessoa, id)
      carregar()
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-400">Carregando dados financeiros...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" /> Planilha de Gastos & Rendas do Casal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Planejamento completo de entradas, saídas fixas do casal e contas da casa atual.
          </p>
        </div>
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Renda Total Casal</span>
          <p className="text-2xl font-black text-emerald-400">
            R$ {(data.resumo?.rendaTotalCasal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-slate-500">
            Carol: R$ {data.resumo?.rendaCarol} | Neno: R$ {data.resumo?.rendaNeno}
          </p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Gastos Atuais Totais</span>
          <p className="text-2xl font-black text-rose-400">
            R$ {(data.resumo?.totalGeralGastos || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-slate-500">Todas as contas cadastradas</p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Gastos Fixos Contínuos</span>
          <p className="text-xl font-bold text-slate-200">
            R$ {(data.resumo?.gastosQueContinuam || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-indigo-400">Permanecem após a mudança</p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Gastos Casa Antiga</span>
          <p className="text-xl font-bold text-amber-300">
            R$ {(data.resumo?.gastosSubstituidos || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-amber-500 font-medium">Serão trocados no imóvel novo</p>
        </div>
      </div>

      {/* SEÇÃO 1: RENDAS DO CASAL */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" /> Entradas / Salários do Casal
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Carol */}
          <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <h3 className="font-bold text-slate-100 text-sm">Carol (Ambev - Padrão Fixo)</h3>
              <span className="text-xs font-bold text-emerald-400">
                R$ {data.resumo?.rendaCarol?.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="space-y-2">
              {data.renda?.carol?.entradas?.map(e => (
                <div key={e.id} className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">{e.descricao}</span>
                    <span className="text-[10px] text-slate-400">Todo dia {e.dia}</span>
                  </div>
                  <span className="font-bold text-emerald-300">
                    R$ {Number(e.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card Neno */}
          <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <h3 className="font-bold text-slate-100 text-sm">Neno (Músico / Shows / Freelas)</h3>
              <span className="text-xs font-bold text-emerald-400">
                R$ {data.resumo?.rendaNeno?.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="space-y-2">
              {data.renda?.neno?.entradas_variaveis?.map(e => (
                <div key={e.id} className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">{e.descricao}</span>
                    <span className="text-[10px] text-slate-400">
                      {e.data ? `Previsto: ${e.data}` : 'Intermitente'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-300">
                      R$ {Number(e.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => handleDeleteRenda('neno', e.id)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Adicionar Freela Neno */}
            <form onSubmit={handleAddRendaNeno} className="pt-2 border-t border-slate-700/40 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block">+ Adicionar Entrada / Show Neno</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Ex: Show Baile"
                  required
                  value={formRendaNeno.descricao}
                  onChange={e => setFormRendaNeno({ ...formRendaNeno, descricao: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Valor R$"
                  required
                  value={formRendaNeno.valor}
                  onChange={e => setFormRendaNeno({ ...formRendaNeno, valor: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg p-2 transition"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: TABELA DE GASTOS MENSAIS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
          <DollarSign className="w-5 h-5 text-rose-400" /> Planilha de Gastos
        </h2>

        {/* Form Adicionar Gasto */}
        <form
          onSubmit={handleAddGasto}
          className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-2xl space-y-3"
        >
          <span className="text-xs font-bold text-slate-300 block">+ Adicionar Novo Gasto</span>
          <div className="grid md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Descrição (Ex: Farmácia)"
              required
              value={formGasto.descricao}
              onChange={e => setFormGasto({ ...formGasto, descricao: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 md:col-span-2"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Valor R$"
              required
              value={formGasto.valor}
              onChange={e => setFormGasto({ ...formGasto, valor: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
            />
            <select
              value={formGasto.substituidoNaMudanca}
              onChange={e => setFormGasto({ ...formGasto, substituidoNaMudanca: e.target.value === 'true' })}
              className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
            >
              <option value="false">Fixo Pessoal (Continua)</option>
              <option value="true">Substituído na Mudança (Casa Antiga)</option>
            </select>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg p-2 transition"
            >
              Salvar Gasto
            </button>
          </div>
        </form>

        {/* Tabela de Gastos */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/60 bg-slate-900/60 text-slate-400 text-xs uppercase font-semibold">
                <th className="p-3.5">Descrição</th>
                <th className="p-3.5">Categoria</th>
                <th className="p-3.5">Status na Mudança</th>
                <th className="p-3.5">Valor</th>
                <th className="p-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 text-xs text-slate-200">
              {data.gastos?.map(gasto => (
                <tr key={gasto.id} className="hover:bg-slate-700/20 transition">
                  <td className="p-3.5 font-medium">{gasto.descricao}</td>
                  <td className="p-3.5 text-slate-400">{gasto.categoria}</td>
                  <td className="p-3.5">
                    {gasto.substituidoNaMudanca ? (
                      <span className="bg-amber-950/60 text-amber-300 border border-amber-700/40 px-2 py-0.5 rounded font-semibold text-[10px]">
                        Substituído (Casa Antiga)
                      </span>
                    ) : (
                      <span className="bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded font-semibold text-[10px]">
                        Fixo Continua
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 font-bold text-slate-100">
                    R$ {Number(gasto.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDeleteGasto(gasto.id)}
                      className="p-1 text-rose-400 hover:bg-rose-950/40 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
