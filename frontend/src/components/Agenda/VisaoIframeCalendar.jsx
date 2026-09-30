// =============================================================================
// 3. MINI COMPONENTE: Visualização Estilo Calendário Mensal (Google Iframe)
// =============================================================================
export function VisaoIframeCalendar({ calendarId }) {
  const encodedId = encodeURIComponent(calendarId || 'primary')
  const iframeUrl = `https://calendar.google.com/calendar/embed?src=${encodedId}&ctz=America%2FSao_Paulo&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0`

  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-2 overflow-hidden shadow-xl">
      <iframe src={iframeUrl} className="w-full h-[650px] rounded-xl border-0" title="Google Calendar Monthly View" />
    </div>
  )
}
