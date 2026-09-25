import { Award, Cat, ExternalLink, MapPin, ShieldAlert, TreePine } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DistanceBadge } from './DistanceBadge'
import { Tag } from './Tag'

export function ImovelCard({ imovel, posicao }) {
  const isTop1 = posicao === 1
  const score = imovel.calculos?.scoreFinal || 0

  return (
    <div
      className={`bg-slate-800/60 border rounded-2xl p-5 transition flex flex-col md:flex-row gap-6 items-start md:items-center justify-between ${
        isTop1
          ? 'border-amber-500/50 bg-amber-950/10 shadow-lg shadow-amber-500/5'
          : 'border-slate-700/60 hover:border-slate-600'
      }`}
    >
      {/* Esquerda: Ranking nº + Título, Endereço, Tags Estruturais e Distâncias */}
      <div className="flex items-start gap-4 flex-1 w-full">
        {/* Ícone de Posição (#1, #2, #3...) */}
        <div
          className={`flex flex-col items-center justify-center min-w-[52px] h-[52px] rounded-xl font-black text-xl shrink-0 ${
            isTop1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-700/60 text-slate-300'
          }`}
        >
          {isTop1 ? <Award className="w-6 h-6" /> : `#${posicao}`}
        </div>

        <div className="space-y-2.5 w-full">
          {/* Título & Link */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/imovel/${imovel.id}`}
                className="text-lg font-bold text-slate-100 hover:text-indigo-400 transition"
              >
                {imovel.titulo}
              </Link>
              {imovel.link && (
                <a
                  href={imovel.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-slate-300 transition"
                  title="Abrir anúncio original"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              {imovel.endereco}
            </p>
          </div>

          {/* Todas as Tags Unificadas (Sem Duplicidade) */}
          <div className="flex flex-wrap gap-1.5">
            <Tag color="slate">{imovel.estrutura?.quartos || 0} Quartos</Tag>
            {imovel.estrutura?.metro_quadrado > 0 && <Tag color="slate">{imovel.estrutura?.metro_quadrado} m²</Tag>}
            {imovel.estrutura?.facil_telar_gatos && (
              <Tag color="purple" icon={Cat}>
                Fácil Telar
              </Tag>
            )}
            {imovel.estrutura?.quintal_fundos && (
              <Tag color="green" icon={TreePine}>
                Quintal Fundos
              </Tag>
            )}
            {imovel.analise_geo?.em_zona_enchente_2024 ? (
              <Tag color="red" icon={ShieldAlert}>
                Alagou em 2024
              </Tag>
            ) : (
              <Tag color="blue">Sem Enchente</Tag>
            )}
          </div>

          {/* Distâncias com Badges Coloridas */}
          <div className="flex flex-wrap gap-2 pt-0.5">
            <DistanceBadge
              label="Divina"
              dados={imovel.analise_geo?.divina_comedia}
              kmFallback={imovel.analise_geo?.distancia_divina_comedia_km}
            />
            <DistanceBadge label="Mandy Studio" dados={imovel.analise_geo?.mandy_studio} />
            <DistanceBadge label="Andressa & Lucas" dados={imovel.analise_geo?.andressa_lucas} />
          </div>
        </div>
      </div>

      {/* Direita: Total Mensal Estimado + Score Final */}
      <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-700/50 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end shrink-0">
        <div className="text-left md:text-right space-y-0.5">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Mensal Est.</p>

          {/* Valor COM Seguro Fiança (Pior Caso) */}
          <p className="text-xl font-black text-emerald-400">
            R$ {(imovel.calculos?.custoTotalReal || 0).toLocaleString('pt-BR')}
            <span className="text-[10px] text-emerald-500 font-normal block">
              c/ Seguro Fiança ({imovel.financeiro?.taxa_seguro_fianca || 30}%)
            </span>
          </p>

          {/* Valor SEM Seguro (Caso consigam Fiador) */}
          <p className="text-xs text-slate-400 pt-0.5 border-t border-slate-700/40">
            Sem seguro:{' '}
            <strong className="text-slate-200">
              R$ {(imovel.calculos?.custoTotalSemSeguro || 0).toLocaleString('pt-BR')}
            </strong>
          </p>
        </div>

        {/* Badge do Score Final */}
        <div className="text-center min-w-[85px] bg-slate-900/80 border border-slate-700/80 p-3 rounded-xl shadow-inner shrink-0">
          <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Score</span>
          <span className="text-2xl font-black text-indigo-400">{score}</span>
        </div>
      </div>
    </div>
  )
}
