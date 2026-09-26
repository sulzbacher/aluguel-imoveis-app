import {
  ArrowLeft,
  Building2,
  Calculator,
  Cat,
  ExternalLink,
  MapPin,
  RefreshCw,
  Save,
  ShieldAlert,
  Trash2,
  TreePine,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ObservacaoBox } from '../components/ObservacaoBox'
import { Tag } from '../components/Tag'
import { deleteImovel, getImovel, reavaliarImovel, updateImovel } from '../services/api'

export function DetalhesImovel() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [imovel, setImovel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [recalculando, setRecalculando] = useState(false)

  const handleReavaliar = async () => {
    setRecalculando(true)
    try {
      const updated = await reavaliarImovel(id)
      setImovel(updated)
      alert('Imóvel reavaliado com sucesso! As distâncias, tempos e scores foram atualizados.')
    } catch (err) {
      alert(`Erro ao reavaliar imóvel: ${err.message}`)
    } finally {
      setRecalculando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [id])

  const carregar = async () => {
    try {
      const data = await getImovel(id)
      setImovel(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await updateImovel(id, imovel)
      setImovel(updated)
      alert('Anotações e bônus salvos com sucesso!')
    } catch (err) {
      alert(`Erro ao salvar alterações: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja remover este imóvel do ranking?')) {
      await deleteImovel(id)
      navigate('/')
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-400">Carregando detalhes...</div>
  if (!imovel) return <div className="text-center py-12 text-slate-400">Imóvel não encontrado.</div>

  const lat = imovel.coordenadas?.lat
  const lng = imovel.coordenadas?.lng
  const temCoordenadas = lat && lng && lat !== 0 && lng !== 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Voltar */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Voltar para o Ranking
      </Link>

      {/* Header com Título, Endereço e Link Externo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-100">{imovel.titulo}</h1>
            {imovel.link && (
              <a
                href={imovel.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-700/50 hover:bg-indigo-900/60 transition text-xs font-semibold"
              >
                Abrir Anúncio <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0" /> {imovel.endereco}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Botão Reavaliar / Recalcular */}
          <button
            onClick={handleReavaliar}
            disabled={recalculando}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2.5 rounded-xl transition text-sm"
            title="Recalcular distâncias, tempos e regras de pontuação"
          >
            <RefreshCw className={`w-4 h-4 text-indigo-400 ${recalculando ? 'animate-spin' : ''}`} />
            {recalculando ? 'Recalculando...' : 'Reavaliar Imóvel'}
          </button>

          {/* Botão Salvar */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20 text-sm"
          >
            <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>

          {/* Botão Lixeira */}
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-800/40 hover:bg-rose-900/40 transition"
            title="Excluir Imóvel"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Resumo da Estrutura do Imóvel & Destaques */}
      <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
        <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-400" /> Estrutura & Características do Imóvel
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Dormitórios</span>
            <span className="text-lg font-bold text-slate-100">{imovel.estrutura?.quartos || 0} Quartos</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Área Útil</span>
            <span className="text-lg font-bold text-slate-100">
              {imovel.estrutura?.metro_quadrado ? `${imovel.estrutura.metro_quadrado} m²` : 'Não informado'}
            </span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Garagem</span>
            <span className="text-lg font-bold text-slate-100">{imovel.estrutura?.vagas_garagem || 0} Vaga(s)</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Status Enchente 2024</span>
            <span className="text-sm font-bold block mt-1">
              {imovel.analise_geo?.em_zona_enchente_2024 ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" /> Alagou
                </span>
              ) : (
                <span className="text-emerald-400">Livre de Enchente</span>
              )}
            </span>
          </div>
        </div>

        {/* Badges Rápidas */}
        <div className="flex flex-wrap gap-2 pt-1">
          {imovel.estrutura?.facil_telar_gatos && (
            <Tag color="purple" icon={Cat}>
              Fácil de Telar pros Gatos
            </Tag>
          )}
          {imovel.estrutura?.quintal_fundos && (
            <Tag color="green" icon={TreePine}>
              Quintal nos Fundos
            </Tag>
          )}
        </div>
      </div>

      {/* Grid de Resumo Financeiro, Distâncias e Score */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Card Financeiro */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Financeiro (Imobiliária)</span>
          <p className="text-2xl font-bold text-emerald-400">
            R$ {(imovel.calculos?.custoImobiliaria || imovel.calculos?.precoTotal || 0).toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-slate-500">
            Aluguel: R$ {imovel.financeiro?.aluguel || 0} | Cond: R$ {imovel.financeiro?.condominio || 0} | IPTU: R${' '}
            {imovel.financeiro?.iptu || 0}
          </p>
        </div>

        {/* Card Distâncias Fixas */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-1.5">
          <span className="text-xs text-slate-400 font-medium">Distâncias Fixas & Tempo</span>

          <p className="text-xs text-slate-200">
            <strong>Divina Comédia:</strong>{' '}
            {imovel.analise_geo?.divina_comedia?.km ?? imovel.analise_geo?.distancia_divina_comedia_km ?? 0} km
            {imovel.analise_geo?.divina_comedia?.tempo_min && ` (~${imovel.analise_geo.divina_comedia.tempo_min} min)`}
          </p>

          <p className="text-xs text-slate-200">
            <strong>Mandy Studio:</strong> {imovel.analise_geo?.mandy_studio?.km ?? 'N/A'} km
            {imovel.analise_geo?.mandy_studio?.tempo_min && ` (~${imovel.analise_geo.mandy_studio.tempo_min} min)`}
          </p>

          <p className="text-xs text-slate-200">
            <strong>Andressa & Lucas:</strong> {imovel.analise_geo?.andressa_lucas?.km ?? 'N/A'} km
            {imovel.analise_geo?.andressa_lucas?.tempo_min && ` (~${imovel.analise_geo.andressa_lucas.tempo_min} min)`}
          </p>

          <p className="text-xs text-slate-200">
            <strong>Aeroporto:</strong>{' '}
            {imovel.analise_geo?.aeroporto?.km ?? imovel.analise_geo?.distancia_aeroporto_km ?? 0} km
            {imovel.analise_geo?.aeroporto?.tempo_min && ` (~${imovel.analise_geo.aeroporto.tempo_min} min)`}
          </p>
        </div>

        {/* Card Pontuação */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Score Final</span>
          <p className="text-3xl font-black text-indigo-400">{imovel.calculos?.scoreFinal || 0}</p>
          <p className="text-xs text-slate-500">Base: {imovel.calculos?.scoreBase || 0} pts</p>
        </div>
      </div>

      {/* Breakdown da Pontuação */}
      <div className="bg-slate-800/30 border border-slate-700/50 p-5 rounded-xl space-y-3">
        <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
          <Calculator className="w-4 h-4 text-indigo-400" /> Como a Pontuação foi Calculada:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">Score Base</span>
            <span className="font-bold text-slate-200">{imovel.calculos?.scoreBase} pts</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">Score Orçamento</span>
            <span className={`font-bold ${imovel.calculos?.dentroDoOrcamento ? 'text-emerald-400' : 'text-rose-400'}`}>
              {imovel.calculos?.dentroDoOrcamento ? '+' : ''}
              {imovel.calculos?.bonusOuPenalidadeOrcamento} pts
            </span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">Bônus Estrutura</span>
            <span className="font-bold text-emerald-400">+{imovel.calculos?.bonusEstrutural} pts</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">Penalidade Enchente</span>
            <span className="font-bold text-rose-400">-{imovel.calculos?.penalidadeGeo} pts</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">Bônus do Casal</span>
            <span className="font-bold text-indigo-300">
              {Number(imovel.avaliacoes_pessoais?.caroline?.bonus_manual || 0) +
                Number(imovel.avaliacoes_pessoais?.neno?.bonus_manual || 0)}{' '}
              pts
            </span>
          </div>
        </div>
      </div>

      {/* Espaço de Anotações do Casal */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-slate-200">Avaliações Individuais & Bônus Personalizados</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ObservacaoBox
            autor="Caroline"
            observacoes={imovel.avaliacoes_pessoais?.caroline?.observacoes || ''}
            bonusManual={imovel.avaliacoes_pessoais?.caroline?.bonus_manual || 0}
            onChangeObs={text =>
              setImovel({
                ...imovel,
                avaliacoes_pessoais: {
                  ...imovel.avaliacoes_pessoais,
                  caroline: { ...imovel.avaliacoes_pessoais?.caroline, observacoes: text },
                },
              })
            }
            onChangeBonus={val =>
              setImovel({
                ...imovel,
                avaliacoes_pessoais: {
                  ...imovel.avaliacoes_pessoais,
                  caroline: { ...imovel.avaliacoes_pessoais?.caroline, bonus_manual: val },
                },
              })
            }
          />

          <ObservacaoBox
            autor="Neno"
            observacoes={imovel.avaliacoes_pessoais?.neno?.observacoes || ''}
            bonusManual={imovel.avaliacoes_pessoais?.neno?.bonus_manual || 0}
            onChangeObs={text =>
              setImovel({
                ...imovel,
                avaliacoes_pessoais: {
                  ...imovel.avaliacoes_pessoais,
                  neno: { ...imovel.avaliacoes_pessoais?.neno, observacoes: text },
                },
              })
            }
            onChangeBonus={val =>
              setImovel({
                ...imovel,
                avaliacoes_pessoais: {
                  ...imovel.avaliacoes_pessoais,
                  neno: { ...imovel.avaliacoes_pessoais?.neno, bonus_manual: val },
                },
              })
            }
          />
        </div>
      </div>

      {/* Mapa do Imóvel (OpenStreetMap Iframe incorporado) */}
      {temCoordenadas && (
        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Localização no Mapa
          </span>
          <div className="w-full h-34 rounded-xl overflow-hidden border border-slate-700/80">
            <iframe
              title="Mapa do Imóvel"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
            />
          </div>
        </div>
      )}

      {/* Painel do Orçamento & Sobra Líquida Real do Casal */}
      <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Simulação de Orçamento & Saldo Livre do Casal</h3>
            <p className="text-xs text-slate-400 mt-0.5">Cruzamento com a Planilha de Gastos e Rendas</p>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
              imovel.calculos?.dentroDoOrcamento ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
            }`}
          >
            {imovel.calculos?.dentroDoOrcamento ? 'Dentro do Limite (+20 pts)' : 'Acima do Limite'}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Renda Total Casal</span>
            <span className="text-lg font-bold text-emerald-400">
              R$ {(imovel.calculos?.rendaTotalCasal || 0).toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Gastos Fixos Pessoais</span>
            <span className="text-lg font-bold text-slate-200">
              R$ {(imovel.calculos?.gastosFixosContinuos || 0).toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Custo Imóvel (c/ Seguro)</span>
            <span className="text-lg font-bold text-rose-400">
              R$ {(imovel.calculos?.custoTotalReal || 0).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Destaque do Saldo Livre */}
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
              Sobra Líquida Estimada no Fim do Mês
            </span>
            <p className="text-2xl font-black text-slate-100 mt-0.5">
              R$ {(imovel.calculos?.sobraLiquidaComSeguro || 0).toLocaleString('pt-BR')}{' '}
              <span className="text-xs text-slate-400 font-normal">livres para poupança/lazer</span>
            </p>
          </div>

          <div className="text-xs text-slate-400 text-left md:text-right border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4">
            <span>Se conseguir fiador (Sem seguro):</span>
            <p className="font-bold text-emerald-300 text-sm">
              Sombra R$ {(imovel.calculos?.sobraLiquidaSemSeguro || 0).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
