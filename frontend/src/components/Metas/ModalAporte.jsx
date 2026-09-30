import { Coins, X } from 'lucide-react'
import { useState } from 'react'
// =============================================================================
// 3. MINI COMPONENTE: Modal para Registrar Aporte
// =============================================================================
export function ModalAporte({ caixinha, onClose, onConfirmarAporte }) {
  const [valor, setValor] = useState('')
  const [observacao, setObservacao] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (!valor || Number(valor) <= 0) return
    onConfirmarAporte(caixinha.id, { valor: Number(valor), observacao })
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-400" /> Aportar em: {caixinha.titulo}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Valor do Depósito (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="Ex: 300.00"
              value={valor}
              onChange={e => setValor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Observação / Origem</label>
            <input
              type="text"
              placeholder="Ex: Sobra do freela / Caixinha Mercado Pago"
              value={observacao}
              onChange={e => setObservacao(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 text-slate-300 font-semibold text-xs px-4 py-2 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl"
            >
              Confirmar Depósito
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
