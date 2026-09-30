import { useState } from 'react'
// =============================================================================
// 4. MINI COMPONENTE: Formulário de Novo Gasto
// =============================================================================
export function FormNovoGasto({ onAddGasto }) {
  const [form, setForm] = useState({
    descricao: '',
    categoria: 'Geral',
    valor: '',
    tipo: 'Fixo Pessoal',
    substituidoNaMudanca: false,
    prioridade: 2,
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.descricao || !form.valor) return
    onAddGasto(form)
    setForm({
      descricao: '',
      categoria: 'Geral',
      valor: '',
      tipo: 'Fixo Pessoal',
      substituidoNaMudanca: false,
      prioridade: 2,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-2xl space-y-3">
      <span className="text-xs font-bold text-slate-300 block">+ Adicionar Novo Gasto Mestre</span>
      <div className="grid md:grid-cols-6 gap-3">
        <input
          type="text"
          placeholder="Descrição (Ex: Farmácia)"
          required
          value={form.descricao}
          onChange={e => setForm({ ...form, descricao: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 md:col-span-2"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Valor R$"
          required
          value={form.valor}
          onChange={e => setForm({ ...form, valor: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
        />
        <select
          value={form.substituidoNaMudanca}
          onChange={e => setForm({ ...form, substituidoNaMudanca: e.target.value === 'true' })}
          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
        >
          <option value="false">Fixo Pessoal (Continua)</option>
          <option value="true">Substituído na Mudança</option>
        </select>
        <select
          value={form.prioridade}
          onChange={e => setForm({ ...form, prioridade: Number(e.target.value) })}
          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
        >
          <option value={1}>1 - Cartões & Dívidas</option>
          <option value={2}>2 - Habitação & Essenciais</option>
          <option value={3}>3 - Flexíveis / Outros</option>
        </select>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg p-2 transition"
        >
          Salvar Gasto
        </button>
      </div>
    </form>
  )
}
