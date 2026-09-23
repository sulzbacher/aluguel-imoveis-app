import { User } from 'lucide-react'

export function ObservacaoBox({ autor, cor, observacoes, bonusManual, onChangeObs, onChangeBonus, readOnly = false }) {
  const isCaroline = autor.toLowerCase() === 'caroline'
  const themeColor = isCaroline ? 'border-pink-500/30 bg-pink-950/10' : 'border-cyan-500/30 bg-cyan-950/10'
  const badgeColor = isCaroline ? 'bg-pink-500/20 text-pink-300' : 'bg-cyan-500/20 text-cyan-300'

  return (
    <div className={`p-4 rounded-xl border ${themeColor} flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg ${badgeColor}`}>
            <User className="w-4 h-4" />
          </span>
          <h3 className="font-semibold capitalize text-slate-200">
            {isCaroline ? 'Anotações da Caroline' : 'Anotações do Leonardo'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Bônus/Ônus Manual:</span>
          {readOnly ? (
            <span
              className={`font-bold px-2 py-0.5 rounded text-sm ${bonusManual >= 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}
            >
              {bonusManual >= 0 ? `+${bonusManual}` : bonusManual} pts
            </span>
          ) : (
            <input
              type="number"
              value={bonusManual}
              onChange={e => onChangeBonus(Number(e.target.value))}
              className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm text-center font-bold text-slate-100 focus:outline-none focus:border-indigo-500"
              placeholder="0"
            />
          )}
        </div>
      </div>

      {readOnly ? (
        <p className="text-sm text-slate-300 italic min-h-[40px] bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
          {observacoes || 'Nenhuma observação informada.'}
        </p>
      ) : (
        <textarea
          value={observacoes}
          onChange={e => onChangeObs(e.target.value)}
          rows={3}
          placeholder={`Adicione aqui impressões sobre personalidade, iluminação, vibe...`}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
        />
      )}
    </div>
  )
}
