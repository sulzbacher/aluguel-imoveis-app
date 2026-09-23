import { ArrowLeft, Calculator, MapPin, Save, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DistanceBadge } from '../components/DistanceBadge'
import { ObservacaoBox } from '../components/ObservacaoBox'
import { deleteImovel, getImovel, updateImovel } from '../services/api'

export function DetalhesImovel() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [imovel, setImovel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Voltar */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Voltar para o Ranking
      </Link>

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">{imovel.titulo}</h1>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-slate-500" /> {imovel.endereco}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-800/40 hover:bg-rose-900/40 transition"
            title="Excluir Imóvel"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>

      {/* Grid de Resumo Automático */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Card Financeiro */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Financeiro Total</span>
          <p className="text-2xl font-bold text-emerald-400">
            R$ {imovel.calculos?.precoTotal?.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-slate-500">
            Aluguel: R$ {imovel.financeiro?.aluguel} | Cond: R$ {imovel.financeiro?.condominio}
          </p>
        </div>

        {/* Card Distâncias */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Distâncias Fixas</span>
          <p className="text-sm text-slate-200">
            <strong>Divina Comédia:</strong> {imovel.analise_geo?.distancia_divina_comedia_km} km
          </p>
          <p className="text-sm text-slate-200">
            <strong>Aeroporto:</strong> {imovel.analise_geo?.distancia_aeroporto_km} km
          </p>
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
        </div>

        {/* Card Pontuação */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Score Final</span>
          <p className="text-3xl font-black text-indigo-400">{imovel.calculos?.scoreFinal}</p>
          <p className="text-xs text-slate-500">Base: {imovel.calculos?.scoreBase} pts</p>
        </div>
      </div>

      {/* Breakdown da Pontuação */}
      <div className="bg-slate-800/30 border border-slate-700/50 p-5 rounded-xl space-y-3">
        <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
          <Calculator className="w-4 h-4 text-indigo-400" /> Como a Pontuação foi Calculada:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">Score Base</span>
            <span className="font-bold text-slate-200">{imovel.calculos?.scoreBase} pts</span>
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

      {/* Card de Orçamento Real e Bônus */}
      <div
        className={`p-4 rounded-xl border ${
          imovel.calculos?.dentroDoOrcamento
            ? 'bg-emerald-950/20 border-emerald-800/60'
            : 'bg-rose-950/20 border-rose-800/60'
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Orçamento Total Estimado</span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              imovel.calculos?.dentroDoOrcamento ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
            }`}
          >
            {imovel.calculos?.dentroDoOrcamento ? 'Dentro do Limite (+20 pts)' : 'Acima do Limite'}
          </span>
        </div>

        <p className="text-2xl font-black text-slate-100">
          R$ {imovel.calculos?.custoTotalReal?.toLocaleString('pt-BR')}{' '}
          <span className="text-xs text-slate-400 font-normal">/ mês</span>
        </p>

        <p className="text-xs text-slate-400 mt-2">
          Imobiliária: R$ {imovel.calculos?.custoImobiliaria} | Contas (Luz/Net/Água/Gás/Tel): R${' '}
          {imovel.calculos?.totalDespesasPessoais}
        </p>
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
    </div>
  )
}
