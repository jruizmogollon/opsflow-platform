import { useCallback, useEffect, useMemo, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5188'

const sections = {
  '#resumen': 'Resumen',
  '#tickets': 'Tickets',
  '#activos': 'Activos',
  '#reportes': 'Reportes',
}

const statuses = ['Open', 'InProgress', 'Resolved', 'Closed']
const statusLabels = {
  Open: 'Abierto',
  InProgress: 'En curso',
  Resolved: 'Resuelto',
  Closed: 'Cerrado',
}
const priorityLabels = {
  Low: 'Baja',
  Medium: 'Media',
  High: 'Alta',
  Critical: 'Crítica',
}

function currentSection() {
  return sections[window.location.hash] ? window.location.hash : '#resumen'
}

function formatDate(value) {
  if (!value) return 'Sin fecha'
  return new Date(value).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
}

function TicketList({ tickets, assetMap, onChangeStatus, compact = false }) {
  if (!tickets.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✓</div>
        <h3>No hay tickets todavía</h3>
        <p>Crea el primero para comenzar a probar el flujo.</p>
      </div>
    )
  }

  const visibleTickets = compact ? tickets.slice(0, 3) : tickets

  return (
    <div>
      {visibleTickets.map((ticket) => {
        const asset = ticket.assetId ? assetMap.get(ticket.assetId) : null
        const statusClass = ticket.status.toLowerCase().replace('inprogress', 'inprogress')
        const priorityClass = ticket.priority.toLowerCase()

        return (
          <div className="ticket-row" key={ticket.id}>
            <div className="ticket-main">
              <i className={`priority priority-${priorityClass}`} />
              <div>
                <strong>{ticket.title}</strong>
                <p>{ticket.description || 'Sin descripción'}</p>
                <small>
                  {ticket.assignee || 'Sin asignar'} · {asset?.name || 'Sin activo'} · {formatDate(ticket.createdAt)}
                </small>
              </div>
            </div>
            <div className="ticket-meta">
              <span className={`status status-${statusClass}`}>{statusLabels[ticket.status] || ticket.status}</span>
              {!compact && (
                <select value={ticket.status} onChange={(event) => onChangeStatus(ticket.id, event.target.value)}>
                  {statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                </select>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function PanelHeading({ eyebrow, title, action }) {
  return (
    <div className="panel-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  )
}

function SummaryView({ stats, tickets, assetMap }) {
  return (
    <>
      <div className="page-intro">
        <p>Una vista rápida del trabajo pendiente y del estado general de la operación.</p>
      </div>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className={`stat-icon ${stat.color || ''}`}>{stat.icon}</div>
            <div><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.note}</small></div>
          </div>
        ))}
      </div>
      <div className="panel summary-panel">
        <PanelHeading
          eyebrow="SEGUIMIENTO"
          title="Tickets recientes"
          action={<a className="ghost-button view-link" href="#tickets">Ver todos</a>}
        />
        <TicketList tickets={tickets} assetMap={assetMap} onChangeStatus={() => {}} compact />
      </div>
    </>
  )
}

function TicketsView({ tickets, assets, assetMap, form, setForm, onCreate, onChangeStatus, saving }) {
  return (
    <>
      <div className="page-intro">
        <p>Registra solicitudes, asigna responsables y actualiza su avance desde un solo lugar.</p>
      </div>
      <div className="content-grid">
        <section className="panel">
          <PanelHeading eyebrow="OPERACIÓN" title="Tickets recientes" action={<span className="plus">+</span>} />
          <TicketList tickets={tickets} assetMap={assetMap} onChangeStatus={onChangeStatus} />
        </section>
        <section className="panel create-panel">
          <PanelHeading eyebrow="NUEVO REGISTRO" title="Crear ticket" />
          <form onSubmit={onCreate}>
            <label>Título<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ej. Revisar laptop" /></label>
            <label>Descripción<textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="¿Qué está ocurriendo?" /></label>
            <label>Prioridad<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>{Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>Responsable<input value={form.assignee} onChange={(event) => setForm({ ...form, assignee: event.target.value })} placeholder="Nombre del responsable" /></label>
            <label>Activo relacionado<select value={form.assetId} onChange={(event) => setForm({ ...form, assetId: event.target.value })}><option value="">Sin activo</option>{assets.map((asset) => <option value={asset.id} key={asset.id}>{asset.name}</option>)}</select></label>
            <button className="primary-button" disabled={saving}>{saving ? 'Guardando...' : 'Crear ticket'} <span>→</span></button>
          </form>
        </section>
      </div>
    </>
  )
}

function AssetsView({ assets }) {
  return (
    <>
      <div className="page-intro">
        <p>Consulta los equipos registrados y relaciónalos con los tickets de soporte.</p>
      </div>
      <section className="panel assets-panel">
        <PanelHeading eyebrow="INVENTARIO" title="Activos registrados" action={<span className="asset-count">{assets.length} activos</span>} />
        {assets.length ? (
          <div className="asset-grid">
            {assets.map((asset) => (
              <div className="asset-card" key={asset.id}>
                <div className="asset-icon">▣</div>
                <div><strong>{asset.name}</strong><p>{asset.type} · {asset.location || 'Sin ubicación'}</p></div>
                <span className={`asset-status ${asset.status !== 'Active' ? 'maintenance' : ''}`}>{asset.status === 'Active' ? 'Activo' : asset.status}</span>
              </div>
            ))}
          </div>
        ) : <div className="empty-state"><h3>No hay activos</h3><p>Los activos aparecerán cuando la API los registre.</p></div>}
      </section>
    </>
  )
}

function ReportsView({ tickets, assets }) {
  const resolved = tickets.filter((ticket) => ['Resolved', 'Closed'].includes(ticket.status)).length
  const open = tickets.filter((ticket) => ['Open', 'InProgress'].includes(ticket.status)).length
  const completion = tickets.length ? Math.round((resolved / tickets.length) * 100) : 0

  return (
    <>
      <div className="page-intro">
        <p>Indicadores sencillos para entender cómo va la atención de solicitudes.</p>
      </div>
      <section className="panel reports-panel">
        <PanelHeading eyebrow="INDICADORES" title="Estado de la operación" />
        <div className="report-grid">
          <div><strong>{tickets.length}</strong><span>Tickets registrados</span></div>
          <div><strong>{open}</strong><span>Tickets pendientes</span></div>
          <div><strong>{resolved}</strong><span>Tickets resueltos</span></div>
          <div><strong>{completion}%</strong><span>Avance de cierre</span></div>
        </div>
      </section>
      <section className="panel reports-notes">
        <PanelHeading eyebrow="LECTURA RÁPIDA" title="Resumen del equipo" />
        <div className="report-notes-list">
          <p><b>{assets.length}</b> activos están disponibles para asociarse a tickets.</p>
          <p><b>{open}</b> solicitudes necesitan seguimiento en este momento.</p>
          <p>Los datos se cargan desde la API local y se guardan en SQLite.</p>
        </div>
      </section>
    </>
  )
}

export default function App() {
  const [activeSection, setActiveSection] = useState(currentSection)
  const [tickets, setTickets] = useState([])
  const [assets, setAssets] = useState([])
  const [apiOnline, setApiOnline] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', assetId: '', assignee: '' })

  const loadData = useCallback(async () => {
    try {
      const [ticketsResponse, assetsResponse] = await Promise.all([fetch(`${API_URL}/api/tickets`), fetch(`${API_URL}/api/assets`)] )
      if (!ticketsResponse.ok || !assetsResponse.ok) throw new Error('API unavailable')
      setTickets(await ticketsResponse.json())
      setAssets(await assetsResponse.json())
      setApiOnline(true)
    } catch {
      setApiOnline(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    const handleHashChange = () => setActiveSection(currentSection())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (!sections[window.location.hash]) window.history.replaceState(null, '', '#resumen')
  }, [])

  const assetMap = useMemo(() => new Map(assets.map((asset) => [asset.id, asset])), [assets])
  const stats = [
    { label: 'Tickets abiertos', value: tickets.filter((ticket) => ticket.status === 'Open').length, note: 'Requieren atención', icon: '◷', color: 'amber' },
    { label: 'En progreso', value: tickets.filter((ticket) => ticket.status === 'InProgress').length, note: 'En manos del equipo', icon: '↗', color: 'blue' },
    { label: 'Resueltos', value: tickets.filter((ticket) => ['Resolved', 'Closed'].includes(ticket.status)).length, note: 'Trabajo completado', icon: '✓', color: 'green' },
    { label: 'Activos', value: assets.length, note: 'Equipos registrados', icon: '▣', color: 'violet' },
  ]

  function navigate(event, section) {
    event.preventDefault()
    if (window.location.hash === section) setActiveSection(section)
    else window.location.hash = section
  }

  async function createTicket(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await fetch(`${API_URL}/api/tickets`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, assetId: form.assetId || null, assignee: form.assignee.trim() || null }) })
      if (!response.ok) throw new Error('No se pudo crear el ticket')
      setForm({ title: '', description: '', priority: 'Medium', assetId: '', assignee: '' })
      await loadData()
    } catch (error) {
      window.alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function changeStatus(id, status) {
    try {
      const response = await fetch(`${API_URL}/api/tickets/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
      if (!response.ok) throw new Error('No se pudo actualizar')
      await loadData()
    } catch (error) {
      window.alert(error.message)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">⌘</span><span>OpsFlow</span></div>
        <p className="workspace-label">ESPACIO DE TRABAJO</p>
        <nav>
          {[['#resumen', '⌂', 'Resumen'], ['#tickets', '□', 'Tickets', tickets.filter((ticket) => ticket.status === 'Open').length], ['#activos', '▣', 'Activos', assets.length], ['#reportes', '▥', 'Reportes']].map(([href, icon, label, count]) => (
            <a className={`nav-item ${activeSection === href ? 'active' : ''}`} href={href} onClick={(event) => navigate(event, href)} key={href}>
              <span>{icon}</span><span>{label}</span>{count !== undefined && <b>{count}</b>}
            </a>
          ))}
        </nav>
        <div className="sidebar-footer"><i className={`dot ${apiOnline ? 'online' : ''}`} />{apiOnline ? 'API conectada' : 'Conectando API...'}</div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div><p className="eyebrow">OPERACIONES / {sections[activeSection].toUpperCase()}</p><h1>{sections[activeSection]}</h1><div className="product-badge"><i className="pulse-dot" /> Web + Flutter · SQLite activa</div></div>
          <div className="user-chip"><span className="avatar">JR</span><span>Administrador</span><span className="chevron">⌄</span></div>
        </header>
        {!apiOnline && <div className="notice">La API todavía no responde. Comprueba que el servidor esté iniciado.<button onClick={loadData}>Reintentar</button></div>}
        {activeSection === '#resumen' && <SummaryView stats={stats} tickets={tickets} assetMap={assetMap} />}
        {activeSection === '#tickets' && <TicketsView tickets={tickets} assets={assets} assetMap={assetMap} form={form} setForm={setForm} onCreate={createTicket} onChangeStatus={changeStatus} saving={saving} />}
        {activeSection === '#activos' && <AssetsView assets={assets} />}
        {activeSection === '#reportes' && <ReportsView tickets={tickets} assets={assets} />}
        <footer>OpsFlow Platform · Sistema de gestión · React + Flutter + ASP.NET Core + SQLite</footer>
      </main>
    </div>
  )
}
