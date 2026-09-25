import { ArrowLeft, Plus, Trash2, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createGasto, deleteGasto, getGastos } from '../services/api'

export function GastosMensais() {
  const [gastosData, setGastosData] = useState({ gastos: [], resumo: {} })
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    descricao: '',
    categoria: 'Geral',
    valor: '',
    tipo: 'Fixo',
  })

  useEffect(() => {
    carregar()
  }, [])

  const carregar = async () => {
    try {
      const data = await getGastos()
      setGastosData(data)
    } catch (err) {
      console.error('Erro ao carregar gastos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async e => {
    e.preventDefault()
    if (!form.descricao || !form.valor) return

    try {
      await createGasto({ ...form, valor: Number(form.valor) })
      setForm({ descricao: '', categoria: 'Geral', valor: '', tipo: 'Fixo' })
      carregar()
    } catch (err) {
      alert(`Erro ao salvar gasto: ${err.message}`)
    }
  }

  const handleDelete = async id => {
    if (confirm('Deseja remover este item da planilha de gastos?')) {
      await deleteGasto(id)
      carregar()
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-400">Carregando planilha de gastos...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Botão de Voltar */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Voltar para o Ranking
      </Link>

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-indigo-400" /> Planilha de Gastos Mensais
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Planeamento de despesas do casal para o próximo mês (independente do imóvel).
          </p>
        </div>
      </div>

      {/* Cards de Resumo dos Gastos */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total de Gastos Mês</span>
          <p className="text-2xl font-black text-emerald-400">
            R$ {(gastosData.resumo?.totalGeral || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Gastos Fixos</span>
          <p className="text-xl font-bold text-slate-200">
            R$ {(gastosData.resumo?.totalFixos || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Gastos Variáveis Estimados</span>
          <p className="text-xl font-bold text-indigo-300">
            R$ {(gastosData.resumo?.totalVariaveis || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Formulário para Adicionar Novo Gasto */}
      <form onSubmit={handleAdd} className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-4">
        <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-400" /> Adicionar Nova Despesa
        </h3>

        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição</label>
            <input
              type="text"
              placeholder="Ex: Cartão de Crédito, Farmácia, Mercado..."
              required
              value={form.descricao}
              onChange={e => setForm({ ...form, descricao: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              required
              value={form.valor}
              onChange={e => setForm({ ...form, valor: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo</label>
            <select
              value={form.tipo}
              onChange={e => setForm({ ...form, tipo: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-slate-100"
            >
              <option value="Fixo">Fixo</option>
              <option value="Variável">Variável</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
        >
          Adicionar à Planilha
        </button>
      </form>

      {/* Tabela / Lista de Gastos */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700/60 bg-slate-900/60 text-slate-400 text-xs uppercase font-semibold">
              <th className="p-4">Descrição</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Valor</th>
              <th className="p-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40 text-sm text-slate-200">
            {gastosData.gastos?.map(gasto => (
              <tr key={gasto.id} className="hover:bg-slate-700/20 transition">
                <td className="p-4 font-medium">{gasto.descricao}</td>
                <td className="p-4">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-md font-semibold ${
                      gasto.tipo === 'Fixo'
                        ? 'bg-slate-700/60 text-slate-300'
                        : 'bg-indigo-950/60 text-indigo-300 border border-indigo-700/40'
                    }`}
                  >
                    {gasto.tipo}
                  </span>
                </td>
                <td className="p-4 font-bold text-slate-100">
                  R$ {Number(gasto.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(gasto.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                    title="Excluir item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {gastosData.gastos?.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-slate-400 text-xs">
                  Nenhuma despesa cadastrada ainda. Use o formulário acima para adicionar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
