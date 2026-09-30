import { Calendar, CheckSquare, DollarSign, Square, Trash2, TrendingUp, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  createGasto,
  createRenda,
  deleteGasto,
  deleteRenda,
  getGastosERendas,
  getHistoricoGastosMes,
  toggleMarcarPago,
} from '../services/gastosService'

// =============================================================================
// 1. MINI COMPONENTE: Cabeçalho & Seletor de Mês
// =============================================================================
function HeaderMes({ mesAnoAtual, setMesAnoAtual, mesesDisponiveis }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/60">
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-emerald-400" /> Controle de Pagamentos Mensais
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Marque os pagamentos conforme efetuados. O histórico permanece preservado mês a mês.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 p-2 rounded-xl">
        <Calendar className="w-4 h-4 text-indigo-400 ml-1" />
        <select
          value={mesAnoAtual}
          onChange={e => setMesAnoAtual(e.target.value)}
          className="bg-transparent text-sm font-bold text-slate-100 focus:outline-none cursor-pointer"
        >
          {mesesDisponiveis?.map(m => (
            <option key={m} value={m} className="bg-slate-900 text-slate-100">
              Mês: {m}
            </option>
          ))}
          <option value="2026-11" className="bg-slate-900 text-slate-100">
            + Iniciar 2026-11
          </option>
        </select>
      </div>
    </div>
  )
}

// =============================================================================
// 2. MINI COMPONENTE: Progresso Financeiro do Mês
// =============================================================================
function CardProgresso({ resumo }) {
  const percentual = resumo?.percentualConcluido || 0

  return (
    <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
        <span>
          Progresso de Pagamentos ({resumo?.qtdPagas || 0} de {resumo?.qtdTotal || 0} contas pagas)
        </span>
        <span className="text-emerald-400">{percentual}% Concluído</span>
      </div>

      <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${percentual}%` }} />
      </div>

      <div className="grid md:grid-cols-3 gap-4 pt-2 border-t border-slate-700/40 text-xs">
        <div>
          <span className="text-slate-400 block">Total Previsto:</span>
          <span className="text-base font-bold text-slate-200">
            R$ {(resumo?.totalPrevisto || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Já Pago:</span>
          <span className="text-base font-bold text-emerald-400">
            R$ {(resumo?.totalEfetivamentePago || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Restante a Pagar:</span>
          <span className="text-base font-bold text-rose-400">
            R$ {(resumo?.totalPendente || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// 3. MINI COMPONENTE: Quadro de Rendas (Carol & Neno)
// =============================================================================
function SecaoRendas({ renda, resumo, onAddRendaNeno, onDeleteRenda }) {
  const [formRendaNeno, setFormRendaNeno] = useState({
    descricao: '',
    valor: '',
    data: '',
    tipo: 'Flexível / Freela',
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (!formRendaNeno.descricao || !formRendaNeno.valor) return
    onAddRendaNeno(formRendaNeno)
    setFormRendaNeno({ descricao: '', valor: '', data: '', tipo: 'Flexível / Freela' })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
        <TrendingUp className="w-5 h-5 text-emerald-400" /> Entradas / Salários do Casal
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Carol */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <h3 className="font-bold text-slate-100 text-sm">Carol (Ambev)</h3>
            <span className="text-xs font-bold text-emerald-400">
              R$ {(resumo?.rendaCarol || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="space-y-2">
            {renda?.carol?.entradas?.map(e => (
              <div
                key={e.id || e.descricao}
                className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200 block">{e.descricao}</span>
                  <span className="text-[10px] text-slate-400">Todo dia {e.dia}</span>
                </div>
                <span className="font-bold text-emerald-300">
                  R$ {Number(e.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Neno */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <h3 className="font-bold text-slate-100 text-sm">Neno (Músico / Shows)</h3>
            <span className="text-xs font-bold text-emerald-400">
              R$ {(resumo?.rendaNeno || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="space-y-2">
            {renda?.neno?.entradas_variaveis?.map(e => (
              <div key={e.id} className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl text-xs">
                <div>
                  <span className="font-semibold text-slate-200 block">{e.descricao}</span>
                  <span className="text-[10px] text-slate-400">{e.data ? `Previsto: ${e.data}` : 'Intermitente'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-300">
                    R$ {Number(e.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <button onClick={() => onDeleteRenda('neno', e.id)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-700/40 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block">+ Adicionar Show / Freela</span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Descrição"
                required
                value={formRendaNeno.descricao}
                onChange={e => setFormRendaNeno({ ...formRendaNeno, descricao: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor R$"
                required
                value={formRendaNeno.valor}
                onChange={e => setFormRendaNeno({ ...formRendaNeno, valor: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg p-2 transition"
              >
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// 4. MINI COMPONENTE: Formulário de Novo Gasto
// =============================================================================
function FormNovoGasto({ onAddGasto }) {
  const [form, setForm] = useState({
    descricao: '',
    categoria: 'Geral',
    valor: '',
    tipo: 'Fixo Pessoal',
    substituidoNaMudanca: false,
    prioridade: 2,
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.descricao || !form.valor) return
    onAddGasto(form)
    setForm({
      descricao: '',
      categoria: 'Geral',
      valor: '',
      tipo: 'Fixo Pessoal',
      substituidoNaMudanca: false,
      prioridade: 2,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-2xl space-y-3">
      <span className="text-xs font-bold text-slate-300 block">+ Adicionar Novo Gasto Mestre</span>
      <div className="grid md:grid-cols-6 gap-3">
        <input
          type="text"
          placeholder="Descrição (Ex: Farmácia)"
          required
          value={form.descricao}
          onChange={e => setForm({ ...form, descricao: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 md:col-span-2"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Valor R$"
          required
          value={form.valor}
          onChange={e => setForm({ ...form, valor: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
        />
        <select
          value={form.substituidoNaMudanca}
          onChange={e => setForm({ ...form, substituidoNaMudanca: e.target.value === 'true' })}
          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
        >
          <option value="false">Fixo Pessoal (Continua)</option>
          <option value="true">Substituído na Mudança</option>
        </select>
        <select
          value={form.prioridade}
          onChange={e => setForm({ ...form, prioridade: Number(e.target.value) })}
          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
        >
          <option value={1}>1 - Cartões & Dívidas</option>
          <option value={2}>2 - Habitação & Essenciais</option>
          <option value={3}>3 - Flexíveis / Outros</option>
        </select>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg p-2 transition"
        >
          Salvar Gasto
        </button>
      </div>
    </form>
  )
}

// =============================================================================
// 5. MINI COMPONENTE: Tabela Unificada de Pagamentos do Mês
// =============================================================================
function TabelaPagamentos({ contas, onTogglePago, onDeleteGasto }) {
  const renderGrupo = (prioridadeNumero, titulo, corTexto, corBorda) => {
    const contasFiltradas = contas?.filter(g => Number(g.prioridade || 2) === prioridadeNumero) || []

    return (
      <>
        <tr
          className={`bg-slate-900/90 font-bold ${corTexto} border-t border-b ${corBorda} text-[11px] uppercase tracking-wider`}
        >
          <td colSpan="6" className="px-4 py-2">
            {titulo}
          </td>
        </tr>
        {contasFiltradas.map(gasto => (
          <tr
            key={gasto.gasto_id || gasto.id}
            className={`transition ${gasto.pago ? 'bg-emerald-950/20 hover:bg-emerald-950/30' : 'hover:bg-slate-700/20'}`}
          >
            <td className="p-3.5 text-center cursor-pointer" onClick={() => onTogglePago(gasto)}>
              {gasto.pago ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 mx-auto" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 hover:text-slate-300 mx-auto" />
              )}
            </td>
            <td className={`p-3.5 font-medium ${gasto.pago ? 'line-through text-slate-500' : 'text-slate-100'}`}>
              {gasto.descricao}
            </td>
            <td className="p-3.5 text-slate-400">{gasto.categoria}</td>
            <td className="p-3.5">
              {gasto.substituidoNaMudanca ? (
                <span className="bg-amber-950/60 text-amber-300 border border-amber-700/40 px-2 py-0.5 rounded font-semibold text-[10px]">
                  Substituído
                </span>
              ) : (
                <span className="bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded font-semibold text-[10px]">
                  Fixo
                </span>
              )}
            </td>
            <td className="p-3.5 font-bold text-slate-100">
              R${' '}
              {Number(gasto.valor_previsto ?? gasto.valor ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </td>
            <td className="p-3.5 text-right">
              <button
                onClick={() => onDeleteGasto(gasto.gasto_id || gasto.id)}
                className="p-1 text-rose-400 hover:bg-rose-950/40 rounded transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </td>
          </tr>
        ))}
      </>
    )
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-700/60 bg-slate-900/60 text-slate-400 text-xs uppercase font-semibold">
            <th className="p-3.5 text-center w-12">Pago</th>
            <th className="p-3.5">Descrição</th>
            <th className="p-3.5">Categoria</th>
            <th className="p-3.5">Status na Mudança</th>
            <th className="p-3.5">Valor Previsto</th>
            <th className="p-3.5 text-right">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/40 text-xs text-slate-200">
          {renderGrupo(1, '💳 1. Cartões de Crédito & Dívidas Imediatas', 'text-amber-400', 'border-amber-500/30')}
          {renderGrupo(
            2,
            '🏠 2. Contas Essenciais da Casa, Habitação & Fixos',
            'text-indigo-400',
            'border-indigo-500/30'
          )}
          {renderGrupo(3, '🛒 3. Outros Gastos & Despesas Flexíveis', 'text-slate-400', 'border-slate-700/50')}
        </tbody>
      </table>
    </div>
  )
}

// =============================================================================
// COMPONENTE PRINCIPAL (ORQUESTRADOR)
// =============================================================================
export function GastosMensais() {
  const [data, setData] = useState({
    renda: {},
    resumoRenda: {},
    historicoContas: [],
    resumoHistorico: {},
    mesesDisponiveis: [],
  })
  const [loading, setLoading] = useState(true)
  const [mesAnoAtual, setMesAnoAtual] = useState('2026-10')

  useEffect(() => {
    carregar(mesAnoAtual)
  }, [mesAnoAtual])

  const carregar = async mes => {
    setLoading(true)
    try {
      const [resHistorico, resData] = await Promise.all([getHistoricoGastosMes(mes), getGastosERendas()])

      setData({
        renda: resData.renda,
        resumoRenda: resData.resumo,
        historicoContas: resHistorico.contas || [],
        resumoHistorico: resHistorico.resumo || {},
        mesesDisponiveis: resHistorico.mesesDisponiveis || ['2026-10'],
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePago = async conta => {
    try {
      await toggleMarcarPago({
        mesAno: mesAnoAtual,
        gasto_id: conta.gasto_id || conta.id,
        pago: !conta.pago,
        valor_pago: conta.valor_previsto || conta.valor,
        pago_por: 'Carol',
      })
      carregar(mesAnoAtual)
    } catch (err) {
      alert(`Erro ao atualizar status: ${err.message}`)
    }
  }

  const handleAddGasto = async formGasto => {
    try {
      await createGasto({ ...formGasto, valor: Number(formGasto.valor) })
      carregar(mesAnoAtual)
    } catch (err) {
      alert(`Erro ao salvar gasto: ${err.message}`)
    }
  }

  const handleDeleteGasto = async id => {
    if (confirm('Remover esta despesa?')) {
      await deleteGasto(id)
      carregar(mesAnoAtual)
    }
  }

  const handleAddRendaNeno = async formRenda => {
    try {
      await createRenda('neno', { ...formRenda, valor: Number(formRenda.valor) })
      carregar(mesAnoAtual)
    } catch (err) {
      alert(`Erro ao adicionar renda: ${err.message}`)
    }
  }

  const handleDeleteRenda = async (pessoa, id) => {
    if (confirm('Remover esta entrada de renda?')) {
      await deleteRenda(pessoa, id)
      carregar(mesAnoAtual)
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-400">Carregando painel financeiro...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Topo & Seletor */}
      <HeaderMes mesAnoAtual={mesAnoAtual} setMesAnoAtual={setMesAnoAtual} mesesDisponiveis={data.mesesDisponiveis} />

      {/* 2. Barra de Progresso do Mês */}
      <CardProgresso resumo={data.resumoHistorico} />

      {/* 3. Seção de Rendas */}
      <SecaoRendas
        renda={data.renda}
        resumo={data.resumoRenda}
        onAddRendaNeno={handleAddRendaNeno}
        onDeleteRenda={handleDeleteRenda}
      />

      {/* 4. Planilha de Gastos Mensais */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
          <DollarSign className="w-5 h-5 text-rose-400" /> Planilha de Contas do Mês ({mesAnoAtual})
        </h2>

        <FormNovoGasto onAddGasto={handleAddGasto} />

        <TabelaPagamentos
          contas={data.historicoContas}
          onTogglePago={handleTogglePago}
          onDeleteGasto={handleDeleteGasto}
        />
      </div>
    </div>
  )
}
