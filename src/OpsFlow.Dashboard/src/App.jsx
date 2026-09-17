import { useCallback, useEffect, useMemo, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5188'
const priorities = ['Low', 'Medium', 'High', 'Critical']
const statuses = ['Open', 'InProgress', 'Resolved', 'Closed']

const statusLabels = {
  Open: 'Abierto',
  InProgress: 'En progreso',
  Resolved: 'Resuelto',
  Closed: 'Cerrado',
}

const priorityLabels = {
  Low: 'Baja',
  Medium: 'Media',
  High: 'Alta',
  Critical: 'Crítica',
}

function App() {
  const [tickets, setTickets] = useState([])
  const [assets, setAssets] = useState([])
  const [apiOnline, setApiOnline] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', assetId: '', assignee: '' })

  const loadTickets = useCallback(async () => {
    setLoading(true)
    try {
      const [ticketsResponse, assetsResponse] = await Promise.all([
        fetch(`${API_URL}/api/tickets`),
        fetch(`${API_URL}/api/assets`),
      ])
      if (!ticketsResponse.ok || !assetsResponse.ok) throw new Error('No se pudo consultar la API')
      setTickets(await ticketsResponse.json())
      setAssets(await assetsResponse.json())
      setApiOnline(true)
      setError('')
    } catch {
      setApiOnline(false)
      setError('La API está apagada. Inicia OpsFlow.Api para trabajar con datos reales.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((ticket) => ticket.status === 'Open').length,
    progress: tickets.filter((ticket) => ticket.status === 'InProgress').length,
    closed: tickets.filter((ticket) => ['Resolved', 'Closed'].includes(ticket.status)).length,
  }), [tickets])

  const assetMap = useMemo(() => new Map(assets.map((asset) => [asset.id, asset])), [assets])

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function createTicket(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error('No se pudo crear el ticket')
      setForm({ title: '', description: '', priority: 'Medium', assetId: '', assignee: '' })
      await loadTickets()
    } catch {
      setError('No se pudo guardar el ticket. Verifica que la API esté activa.')
    } finally {
      setSaving(false)
    }
  }

  async function changeStatus(id, status) {
    try {
      const response = await fetch(`${API_URL}/api/tickets/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error('No se pudo actualizar')
      await loadTickets()
    } catch {
      setError('No se pudo actualizar el estado del ticket.')
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">O</span><span>OpsFlow</span></div>
        <p className="workspace-label">ESPACIO DE TRABAJO</p>
        <nav>
          <a className="nav-item active" href="#resumen">▦ <span>Resumen</span></a>
          <a className="nav-item" href="#tickets">◫ <span>Tickets</span><b>{stats.total}</b></a>
          <a className="nav-item" href="#activos">▣ <span>Activos</span><b>{assets.length}</b></a>
          <a className="nav-item" href="#reportes">◒ <span>Reportes</span></a>
        </nav>
        <div className="sidebar-footer"><span className={apiOnline ? 'dot online' : 'dot'} /> {apiOnline ? 'API conectada' : 'API desconectada'}</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div><p className="eyebrow">OPERACIONES / SOPORTE</p><h1>Resumen</h1><div className="product-badge"><span className="pulse-dot" /> Web + Flutter · SQLite activa</div></div>
          <div className="user-chip"><span className="avatar">JR</span><span>José Ruiz</span><span className="chevron">⌄</span></div>
        </header>

        {error && <div className="notice">{error}<button onClick={loadTickets}>Reintentar</button></div>}

        <section id="resumen" className="stats-grid">
          <article className="stat-card accent"><div className="stat-icon">◫</div><div><span>Total de tickets</span><strong>{stats.total}</strong><small>En este espacio</small></div></article>
          <article className="stat-card"><div className="stat-icon amber">!</div><div><span>Abiertos</span><strong>{stats.open}</strong><small>Requieren atención</small></div></article>
          <article className="stat-card"><div className="stat-icon blue">↗</div><div><span>En progreso</span><strong>{stats.progress}</strong><small>En trabajo</small></div></article>
          <article className="stat-card"><div className="stat-icon green">✓</div><div><span>Resueltos</span><strong>{stats.closed}</strong><small>Completados</small></div></article>
          <article className="stat-card"><div className="stat-icon violet">▣</div><div><span>Activos</span><strong>{assets.length}</strong><small>Equipos registrados</small></div></article>
        </section>

        <section className="content-grid">
          <article id="tickets" className="panel tickets-panel">
            <div className="panel-heading"><div><p className="eyebrow">SEGUIMIENTO</p><h2>Tickets recientes</h2></div><button className="ghost-button" onClick={loadTickets}>Actualizar</button></div>
            {loading ? <div className="empty-state">Cargando tickets...</div> : tickets.length === 0 ? <div className="empty-state"><div className="empty-icon">◫</div><h3>No hay tickets todavía</h3><p>Crea el primero desde el formulario para ver cómo funciona el flujo.</p></div> : <div className="ticket-list">{tickets.map((ticket) => <div className="ticket-row" key={ticket.id}><div className="ticket-main"><span className={`priority priority-${ticket.priority.toLowerCase()}`} /> <div><strong>{ticket.title}</strong><p>{ticket.description}</p><small>{ticket.assignee ? `Asignado a ${ticket.assignee}` : 'Sin técnico asignado'}{ticket.assetId && assetMap.get(ticket.assetId) ? ` · ${assetMap.get(ticket.assetId).name}` : ''}</small></div></div><div className="ticket-meta"><span className={`status status-${ticket.status.toLowerCase()}`}>{statusLabels[ticket.status]}</span><select value={ticket.status} onChange={(event) => changeStatus(ticket.id, event.target.value)} aria-label={`Estado de ${ticket.title}`}>{statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></div></div>)}</div>}
          </article>

          <article className="panel create-panel">
            <div className="panel-heading"><div><p className="eyebrow">NUEVO REGISTRO</p><h2>Crear ticket</h2></div><span className="plus">+</span></div>
            <form onSubmit={createTicket}>
              <label>Título<input name="title" value={form.title} onChange={updateField} placeholder="Ej. Laptop no enciende" required /></label>
              <label>Descripción<textarea name="description" value={form.description} onChange={updateField} placeholder="Describe brevemente el problema" rows="4" required /></label>
              <label>Prioridad<select name="priority" value={form.priority} onChange={updateField}>{priorities.map((priority) => <option key={priority} value={priority}>{priorityLabels[priority]}</option>)}</select></label>
              <label>Asignar a (opcional)<input name="assignee" value={form.assignee} onChange={updateField} placeholder="Ej. Ana Torres" /></label>
              <label>Activo afectado<select name="assetId" value={form.assetId} onChange={updateField}><option value="">Sin activo asociado</option>{assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.name} · {asset.serialNumber}</option>)}</select></label>
              <button className="primary-button" type="submit" disabled={saving || !apiOnline}>{saving ? 'Guardando...' : 'Crear ticket'} <span>→</span></button>
            </form>
          </article>
        </section>

        <section id="activos" className="panel assets-panel">
          <div className="panel-heading"><div><p className="eyebrow">INVENTARIO OPERATIVO</p><h2>Activos registrados</h2></div><span className="asset-count">{assets.length} activos</span></div>
          <div className="asset-grid">{assets.map((asset) => <div className="asset-card" key={asset.id}><div className="asset-icon">▣</div><div><strong>{asset.name}</strong><p>{asset.serialNumber} · {asset.location}</p></div><span className={`asset-status ${asset.status.toLowerCase()}`}>{asset.status === 'Available' ? 'Disponible' : 'Mantenimiento'}</span></div>)}</div>
        </section>

        <footer>OpsFlow Platform · Operations workspace · React + Flutter + ASP.NET Core + SQLite</footer>
      </main>
    </div>
  )
}

export default App
