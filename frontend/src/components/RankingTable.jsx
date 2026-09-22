import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

export function RankingTable({ imoveis }) {
  if (!imoveis || imoveis.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-700/60 bg-slate-800/40">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-700/60">
          <tr>
            <th className="px-4 py-3.5 text-center">#</th>
            <th className="px-4 py-3.5">Imóvel</th>
            <th className="px-4 py-3.5 text-right">Valor Total</th>
            <th className="px-4 py-3.5 text-center">Dist. Divina</th>
            <th className="px-4 py-3.5 text-center">Score Base</th>
            <th className="px-4 py-3.5 text-center text-pink-300">Bônus Caroline</th>
            <th className="px-4 py-3.5 text-center text-cyan-300">Bônus Neno</th>
            <th className="px-4 py-3.5 text-center font-bold text-indigo-400">Score Final</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {imoveis.map((imovel, index) => {
            const isTop1 = index === 0
            const bonusCaroline = imovel.avaliacoes_pessoais?.caroline?.bonus_manual || 0
            const bonusNeno = imovel.avaliacoes_pessoais?.neno?.bonus_manual || 0

            return (
              <tr key={imovel.id} className={`hover:bg-slate-800/60 transition ${isTop1 ? 'bg-amber-950/10' : ''}`}>
                {/* Posição */}
                <td className="px-4 py-4 text-center font-bold">
                  {isTop1 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black">
                      1
                    </span>
                  ) : (
                    `#${index + 1}`
                  )}
                </td>

                {/* Título & Cidade */}
                <td className="px-4 py-4 font-semibold text-slate-100">
                  <Link
                    to={`/imovel/${imovel.id}`}
                    className="hover:text-indigo-400 transition flex items-center gap-2"
                  >
                    {imovel.titulo}
                    {imovel.analise_geo?.em_zona_enchente_2024 && (
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" title="Risco Enchente 2024" />
                    )}
                  </Link>
                </td>

                {/* Preço Total */}
                <td className="px-4 py-4 text-right font-medium text-emerald-400">
                  R$ {imovel.calculos?.precoTotal?.toLocaleString('pt-BR')}
                </td>

                {/* Distância */}
                <td className="px-4 py-4 text-center text-slate-400">
                  {imovel.analise_geo?.distancia_divina_comedia_km} km
                </td>

                {/* Score Base */}
                <td className="px-4 py-4 text-center font-medium text-slate-300">{imovel.calculos?.scoreBase}</td>

                {/* Bônus Caroline */}
                <td className="px-4 py-4 text-center font-bold text-pink-400">
                  {bonusCaroline >= 0 ? `+${bonusCaroline}` : bonusCaroline}
                </td>

                {/* Bônus Neno */}
                <td className="px-4 py-4 text-center font-bold text-cyan-400">
                  {bonusNeno >= 0 ? `+${bonusNeno}` : bonusNeno}
                </td>

                {/* Score Final */}
                <td className="px-4 py-4 text-center">
                  <span className="inline-block bg-indigo-950 text-indigo-300 border border-indigo-700/50 font-black px-2.5 py-1 rounded-lg">
                    {imovel.calculos?.scoreFinal}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
