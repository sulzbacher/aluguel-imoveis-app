import { Clock, Navigation } from 'lucide-react'

export function DistanceBadge({ label, dados, kmFallback }) {
  // Trata compatibilidade: tanto se receber o objeto { km, tempo_min } quanto apenas o número km
  let km = 0
  let tempoMin = 0

  if (dados && typeof dados === 'object') {
    km = Number(dados.km || 0)
    tempoMin = Number(dados.tempo_min || Math.round((km / 28) * 60))
  } else if (typeof dados === 'number') {
    km = dados
    tempoMin = Math.round((km / 28) * 60)
  } else if (typeof kmFallback === 'number') {
    km = kmFallback
    tempoMin = Math.round((km / 28) * 60)
  }

  // Se a distância for 0 ou inválida, não renderiza o badge para evitar poluição
  if (!km || km <= 0) return null

  // Estilo de cores conforme o tempo estimado
  let colorStyle = 'bg-emerald-950/50 text-emerald-300 border-emerald-700/50' // Verde (< 12 min)

  if (tempoMin > 25) {
    colorStyle = 'bg-rose-950/50 text-rose-300 border-rose-700/50' // Vermelho (> 25 min)
  } else if (tempoMin > 12) {
    colorStyle = 'bg-amber-950/50 text-amber-300 border-amber-700/50' // Amarelo (12 ~ 25 min)
  }

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-medium ${colorStyle}`}>
      <Navigation className="w-3.5 h-3.5 shrink-0" />
      <span>
        <strong>{label}:</strong> {km} km
      </span>
      <span className="opacity-75 flex items-center gap-0.5 border-l border-current/30 pl-1.5 ml-0.5">
        <Clock className="w-3 h-3" /> ~{tempoMin} min
      </span>
    </div>
  )
}
