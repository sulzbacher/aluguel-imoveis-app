import { Target, X } from 'lucide-react'
import { useState } from 'react'
// =============================================================================
// 4. MINI COMPONENTE: Modal Criar Nova Caixinha
// =============================================================================
export function ModalNovaCaixinha({ onClose, onCriar }) {
  const [form, setForm] = useState({
    titulo: '',
    categoria: 'Conquista Pessoal',
    valor_original_divida: '',
    percentual_desconto: '',
    valor_alvo: '',
    aporte_mensal_sugerido: '',
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.titulo || !form.valor_alvo) return

    onCriar({
      ...form,
      valor_original_divida: Number(form.valor_original_divida || 0),
      percentual_desconto: Number(form.percentual_desconto || 0),
      valor_alvo: Number(form.valor_alvo),
      aporte_mensal_sugerido: Number(form.aporte_mensal_sugerido || 0),
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" /> Criar Nova Caixinha / Meta
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Título da Meta</label>
            <input
              type="text"
              required
              placeholder="Ex: Nova Guitarra / Carteira CNH / Carro"
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Categoria</label>
              <select
                value={form.categoria}
                onChange={e => setForm({ ...form, categoria: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              >
                <option value="Conquista Pessoal">Conquista Pessoal</option>
                <option value="Dívidas">Dívida / Renegociação</option>
                <option value="Imóvel Novo">Entrada Imóvel</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Meta Financeira (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ex: 4418.59"
                value={form.valor_alvo}
                onChange={e => setForm({ ...form, valor_alvo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>
          </div>

          {form.categoria === 'Dívidas' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl">
              <div>
                <label className="text-[10px] font-semibold text-amber-300 block mb-1">Valor Original Dívida</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 23377.46"
                  value={form.valor_original_divida}
                  onChange={e => setForm({ ...form, valor_original_divida: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-amber-300 block mb-1">% Desconto Serasa</label>
                <input
                  type="number"
                  placeholder="Ex: 81"
                  value={form.percentual_desconto}
                  onChange={e => setForm({ ...form, percentual_desconto: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-100"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Aporte Mensal Previsto (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="Ex: 300.00"
              value={form.aporte_mensal_sugerido}
              onChange={e => setForm({ ...form, aporte_mensal_sugerido: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 text-slate-300 font-semibold text-xs px-4 py-2 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl"
            >
              Salvar Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
