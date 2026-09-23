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
      {/* Ranking nº + Título */}
      <div className="flex items-start gap-4 flex-1">
        <div
          className={`flex flex-col items-center justify-center min-w-[52px] h-[52px] rounded-xl font-black text-xl ${
            isTop1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-700/60 text-slate-300'
          }`}
        >
          {isTop1 ? <Award className="w-6 h-6" /> : `#${posicao}`}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/imovel/${imovel.id}`}
              className="text-lg font-bold text-slate-100 hover:text-indigo-400 transition"
            >
              {imovel.titulo}
            </Link>
            {imovel.link && (
              <a href={imovel.link} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <p className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {imovel.endereco}
          </p>

          {/* Tags estruturais rápidas */}
          <div className="flex flex-wrap gap-1.5 pt-1">
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
        </div>
      </div>

      {/* Info de Valores, Distâncias e Score */}
      <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-700/50 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
        <div className="text-left md:text-right">
          <p className="text-xs text-slate-400">Total Mensal</p>
          <p className="text-base font-bold text-emerald-400">
            R$ {imovel.calculos?.precoTotal?.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Divina: {imovel.analise_geo?.distancia_divina_comedia_km} km</p>
        </div>

        {/* Seção de Distâncias com Cores Dinâmicas */}
        <div className="flex flex-wrap gap-2 pt-2">
          <DistanceBadge
            label="Divina"
            km={imovel.analise_geo?.divina_comedia?.km}
            tempoMin={imovel.analise_geo?.divina_comedia?.tempo_min}
          />
          <DistanceBadge
            label="Mandy Studio"
            km={imovel.analise_geo?.mandy_studio?.km}
            tempoMin={imovel.analise_geo?.mandy_studio?.tempo_min}
          />
          <DistanceBadge
            label="Andressa & Lucas"
            km={imovel.analise_geo?.andressa_lucas?.km}
            tempoMin={imovel.analise_geo?.andressa_lucas?.tempo_min}
          />
        </div>

        {/* Adicionar a badge de m² e quartos nas tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
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

        {/* Score Badge */}
        <div className="text-center min-w-[90px] bg-slate-900/80 border border-slate-700/80 p-3 rounded-xl">
          <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Score</span>
          <span className="text-2xl font-black text-indigo-400">{score}</span>
        </div>
      </div>
    </div>
  )
}
