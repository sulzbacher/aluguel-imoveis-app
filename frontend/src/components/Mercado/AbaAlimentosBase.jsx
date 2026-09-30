import { useState } from 'react'
// =============================================================================
// 5. MINI COMPONENTE: ABA 4 - ALIMENTOS BASE (TABELA DE MACROS POR 100G)
// =============================================================================
export function AbaAlimentosBase({ alimentos, onAddAlimento }) {
  const [form, setForm] = useState({
    nome: '',
    categoria: 'Proteínas',
    proteina_100g: '',
    carbo_100g: '',
    gordura_100g: '',
    calorias_100g: '',
    preco_unidade: '',
    unidade: 'kg',
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.nome) return
    onAddAlimento(form)
    setForm({
      nome: '',
      categoria: 'Proteínas',
      proteina_100g: '',
      carbo_100g: '',
      gordura_100g: '',
      calorias_100g: '',
      preco_unidade: '',
      unidade: 'kg',
    })
  }

  return (
    <div className="space-y-6">
      {/* Form Cadastro */}
      <form onSubmit={handleSubmit} className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
        <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
          + Cadastrar Alimento Tabela Nutricional
        </h3>
        <div className="grid md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Nome (Ex: Peito de Frango)"
            required
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
          />
          <input
            type="number"
            step="0.1"
            placeholder="Proteína (g) / 100g"
            value={form.proteina_100g}
            onChange={e => setForm({ ...form, proteina_100g: e.target.value })}
            className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
          />
          <input
            type="number"
            step="0.1"
            placeholder="Carbo (g) / 100g"
            value={form.carbo_100g}
            onChange={e => setForm({ ...form, carbo_100g: e.target.value })}
            className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
          />
          <input
            type="number"
            step="0.1"
            placeholder="Gordura (g) / 100g"
            value={form.gordura_100g}
            onChange={e => setForm({ ...form, gordura_100g: e.target.value })}
            className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Preço R$ (kg/duzia)"
            value={form.preco_unidade}
            onChange={e => setForm({ ...form, preco_unidade: e.target.value })}
            className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
          />
          <select
            value={form.unidade}
            onChange={e => setForm({ ...form, unidade: e.target.value })}
            className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
          >
            <option value="kg">Por Quilo (kg)</option>
            <option value="duzia">Dúzia</option>
            <option value="un">Unidade</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl p-2.5 transition md:col-span-2"
          >
            Salvar Alimento
          </button>
        </div>
      </form>

      {/* Tabela Alimentos */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-700/60 bg-slate-900/60 text-slate-400 uppercase font-semibold">
              <th className="p-3.5">Alimento</th>
              <th className="p-3.5">Proteína / 100g</th>
              <th className="p-3.5">Carbo / 100g</th>
              <th className="p-3.5">Gordura / 100g</th>
              <th className="p-3.5">Preço Base</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40 text-slate-200">
            {alimentos.map(ali => (
              <tr key={ali.id} className="hover:bg-slate-700/20">
                <td className="p-3.5 font-bold text-slate-100">{ali.nome}</td>
                <td className="p-3.5 text-emerald-400 font-semibold">{ali.proteina_100g}g</td>
                <td className="p-3.5 text-indigo-400 font-semibold">{ali.carbo_100g}g</td>
                <td className="p-3.5 text-amber-400 font-semibold">{ali.gordura_100g}g</td>
                <td className="p-3.5 text-slate-300 font-semibold">
                  R$ {Number(ali.preco_unidade || 0).toFixed(2)} / {ali.unidade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
