import { Calendar as CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BarraFerramentasAgenda } from '../components/Agenda/BarraFerramentasAgenda'
import { HeaderAgenda } from '../components/Agenda/HeaderAgenda'
import { VisaoIframeCalendar } from '../components/Agenda/VisaoIframeCalendar'
import {
  createEventoAgenda,
  deleteEventoAgenda,
  getAuthUrlGoogle,
  getCalendariosAgenda,
  getEventosAgenda,
  updateEventoAgenda,
} from '../services/agendaService'

import { FormCriarEvento } from '../components/Agenda/FormCriarEvento'
import { ListaEventos } from '../components/Agenda/ListaEventos'
import { ModalEdicaoEvento } from '../components/Agenda/ModalEdicaoEvento'

// =============================================================================
// COMPONENTE PRINCIPAL (ORQUESTRADOR)
// =============================================================================
export function Agenda() {
  const [eventos, setEventos] = useState([])
  const [calendarios, setCalendarios] = useState([])
  const [selectedCalendarId, setSelectedCalendarId] = useState('primary')
  const [modoVisao, setModoVisao] = useState('iframe') // 'iframe' ou 'lista'
  const [loading, setLoading] = useState(true)
  const [conectado, setConectado] = useState(false)
  const [eventoParaEditar, setEventoParaEditar] = useState(null)

  // 1. Inicialização: Busca as agendas e seleciona a do Leonardo/Neno se existir
  useEffect(() => {
    inicializar()
  }, [])

  // 2. Quando a agenda selecionada muda, recarrega a lista de eventos
  useEffect(() => {
    if (conectado && selectedCalendarId) {
      carregarEventos(selectedCalendarId)
    }
  }, [selectedCalendarId, conectado])

  const inicializar = async () => {
    setLoading(true)
    try {
      const list = await getCalendariosAgenda()
      setCalendarios(list || [])
      setConectado(true)

      // Identifica a agenda do Leonardo/Neno
      const calNeno = list.find(c => /leonardo/i.test(c.summary) || /melo/i.test(c.summary))
      if (calNeno) {
        setSelectedCalendarId(calNeno.id)
      } else {
        setSelectedCalendarId('primary')
      }
    } catch (err) {
      setConectado(false)
      alert(`Erro ao carregar calendários: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const carregarEventos = async calId => {
    try {
      const data = await getEventosAgenda(calId)
      setEventos(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleConectarGoogle = async () => {
    const { url } = await getAuthUrlGoogle()
    window.location.href = url
  }

  const handleCriarEvento = async novoEvento => {
    try {
      await createEventoAgenda(novoEvento)
      carregarEventos(selectedCalendarId)
    } catch (err) {
      alert(`Erro ao criar evento: ${err.message}`)
    }
  }

  const handleSalvarEdicao = async (id, dadosAtualizados) => {
    try {
      await updateEventoAgenda(id, dadosAtualizados)
      setEventoParaEditar(null)
      carregarEventos(selectedCalendarId)
    } catch (err) {
      alert(`Erro ao atualizar evento: ${err.message}`)
    }
  }

  const handleDeleteEvento = async id => {
    if (confirm('Deletar este evento da agenda do Google?')) {
      try {
        await deleteEventoAgenda(id, selectedCalendarId)
        carregarEventos(selectedCalendarId)
      } catch (err) {
        alert(`Erro ao deletar evento: ${err.message}`)
      }
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-400">Carregando Google Agenda...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* 1. Header */}
      <HeaderAgenda conectado={conectado} onConectar={handleConectarGoogle} />

      {conectado ? (
        <>
          {/* 2. Barra de Ferramentas (Seletor & Modos de Visão) */}
          <BarraFerramentasAgenda
            calendarios={calendarios}
            selectedCalendarId={selectedCalendarId}
            onChangeCalendar={setSelectedCalendarId}
            modoVisao={modoVisao}
            setModoVisao={setModoVisao}
          />

          {/* 3. Form para Novo Evento */}
          <FormCriarEvento onCriar={handleCriarEvento} calendarId={selectedCalendarId} />

          {/* 4. Conteúdo: Visão em Mês (Google Iframe) OU Lista de Eventos */}
          {modoVisao === 'iframe' ? (
            <VisaoIframeCalendar calendarId={selectedCalendarId} />
          ) : (
            <ListaEventos eventos={eventos} onEdit={setEventoParaEditar} onDelete={handleDeleteEvento} />
          )}

          {/* 5. Modal de Edição (Só abre ao clicar em editar em algum card) */}
          {eventoParaEditar && (
            <ModalEdicaoEvento
              evento={eventoParaEditar}
              onClose={() => setEventoParaEditar(null)}
              onSalvar={handleSalvarEdicao}
              calendarId={selectedCalendarId}
            />
          )}
        </>
      ) : (
        <div className="bg-slate-800/20 border border-slate-800 border-dashed rounded-3xl p-12 text-center space-y-3">
          <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">Google Agenda Não Conectado</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Clique no botão acima para conectar com a conta do Google e sincronizar os compromissos.
          </p>
        </div>
      )}
    </div>
  )
}
