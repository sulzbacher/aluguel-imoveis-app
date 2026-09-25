import { ArrowLeft, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createImovel } from '../services/api'

export function NovoImovel() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    titulo: '',
    endereco: '',
    link: '',
    financeiro: { aluguel: '', condominio: '', iptu: '' },
    estrutura: { quartos: 2, vagas_garagem: 1, facil_telar_gatos: false, quintal_fundos: false },
  })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await createImovel(form)
      navigate('/')
    } catch (err) {
      alert(`Erro ao cadastrar imóvel: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Voltar para o Ranking
      </Link>

      <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-slate-100 mb-6">Cadastrar Novo Imóvel</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label htmlFor="input-titulo" className="block text-xs font-semibold text-slate-300 mb-1">
              Título / Apelido do Imóvel
            </label>
            <input
              id="input-titulo"
              type="text"
              required
              placeholder="Ex: Casa com pátio no Menino Deus"
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Endereço */}
          <div>
            <label htmlFor="input-endereco" className="block text-xs font-semibold text-slate-300 mb-1">
              Endereço Completo (para verificação de enchente e distância)
            </label>
            <input
              id="input-endereco"
              type="text"
              required
              placeholder="Ex: Rua Exemplo, 123, Menino Deus, Porto Alegre"
              value={form.endereco}
              onChange={e => setForm({ ...form, endereco: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Link */}
          <div>
            <label htmlFor="input-link" className="block text-xs font-semibold text-slate-300 mb-1">
              Link do Anúncio (Opcional)
            </label>
            <input
              id="input-link"
              type="url"
              placeholder="https://www.quintoandar.com.br/imovel/..."
              value={form.link}
              onChange={e => setForm({ ...form, link: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Valores Financeiros */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div>
              <label htmlFor="input-aluguel" className="block text-xs font-semibold text-slate-300 mb-1">
                Aluguel (R$)
              </label>
              <input
                id="input-aluguel"
                type="number"
                required
                value={form.financeiro.aluguel}
                onChange={e => setForm({ ...form, financeiro: { ...form.financeiro, aluguel: e.target.value } })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100"
              />
            </div>
            <div>
              <label htmlFor="input-condominio" className="block text-xs font-semibold text-slate-300 mb-1">
                Condomínio (R$)
              </label>
              <input
                id="input-condominio"
                type="number"
                value={form.financeiro.condominio}
                onChange={e => setForm({ ...form, financeiro: { ...form.financeiro, condominio: e.target.value } })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100"
              />
            </div>
            <div>
              <label htmlFor="input-iptu" className="block text-xs font-semibold text-slate-300 mb-1">
                IPTU (R$)
              </label>
              <input
                id="input-iptu"
                type="number"
                value={form.financeiro.iptu}
                onChange={e => setForm({ ...form, financeiro: { ...form.financeiro, iptu: e.target.value } })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100"
              />
            </div>
          </div>

          {/* Estrutura: Quartos, Vagas e Metragem */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-700/60">
            <div>
              <label htmlFor="input-quartos" className="block text-xs font-semibold text-slate-300 mb-1">
                Quartos
              </label>
              <input
                id="input-quartos"
                type="number"
                min="1"
                required
                value={form.estrutura.quartos}
                onChange={e =>
                  setForm({
                    ...form,
                    estrutura: { ...form.estrutura, quartos: Number(e.target.value) },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100"
              />
            </div>

            <div>
              <label htmlFor="input-vagas" className="block text-xs font-semibold text-slate-300 mb-1">
                Vagas de Garagem
              </label>
              <input
                id="input-vagas"
                type="number"
                min="0"
                value={form.estrutura.vagas_garagem}
                onChange={e =>
                  setForm({
                    ...form,
                    estrutura: { ...form.estrutura, vagas_garagem: Number(e.target.value) },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100"
              />
            </div>

            <div>
              <label htmlFor="input-seguro" className="block text-xs font-semibold text-slate-300 mb-1">
                Seguro Fiança (%)
              </label>
              <input
                id="input-seguro"
                type="number"
                min="0"
                max="50"
                value={form.financeiro.taxa_seguro_fianca ?? 30}
                onChange={e =>
                  setForm({
                    ...form,
                    financeiro: { ...form.financeiro, taxa_seguro_fianca: Number(e.target.value) },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Padrão: 30% sobre o aluguel</span>
            </div>

            <div>
              <label htmlFor="input-metragem" className="block text-xs font-semibold text-slate-300 mb-1">
                Área Útil (m²)
              </label>
              <input
                id="input-metragem"
                type="number"
                min="10"
                placeholder="Ex: 90"
                value={form.estrutura.metro_quadrado || ''}
                onChange={e =>
                  setForm({
                    ...form,
                    estrutura: { ...form.estrutura, metro_quadrado: Number(e.target.value) },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100"
              />
            </div>
          </div>

          {/* Atributos Booleanos */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-700/60">
            <div className="flex items-center gap-2">
              <input
                id="chk-facil-telar"
                type="checkbox"
                checked={form.estrutura.facil_telar_gatos}
                onChange={e =>
                  setForm({ ...form, estrutura: { ...form.estrutura, facil_telar_gatos: e.target.checked } })
                }
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="chk-facil-telar" className="text-sm text-slate-300 cursor-pointer">
                Fácil de telar para os gatos
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="chk-quintal-fundos"
                type="checkbox"
                checked={form.estrutura.quintal_fundos}
                onChange={e => setForm({ ...form, estrutura: { ...form.estrutura, quintal_fundos: e.target.checked } })}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="chk-quintal-fundos" className="text-sm text-slate-300 cursor-pointer">
                Tem quintal nos fundos
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> {loading ? 'Analisando e Salvando...' : 'Cadastrar e Calcular Score'}
          </button>
        </form>
      </div>
    </div>
  )
}
