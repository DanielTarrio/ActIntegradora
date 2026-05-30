import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [serverTimezone, setServerTimezone] = useState(null)
  const [timeSkew, setTimeSkew] = useState(0)
  const [time, setTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [serverError, setServerError] = useState(null)

  // Fetch server time on mount and set up periodic re-sync every 60s
  useEffect(() => {
    let isMounted = true

    const fetchServerTime = async () => {
      try {
        const response = await fetch('/api/time')
        if (!response.ok) {
          throw new Error('Sincronización fallida')
        }
        const data = await response.json()
        if (isMounted) {
          const serverNow = new Date(data.time)
          const clientNow = new Date()
          const skew = serverNow.getTime() - clientNow.getTime()
          setTimeSkew(skew)
          setServerTimezone(data.timezone)
          setIsLoading(false)
          setServerError(null)
        }
      } catch (err) {
        console.error("Error fetching server time:", err)
        if (isMounted) {
          setServerError("Error al sincronizar con el servidor")
          setIsLoading(false)
        }
      }
    }

    fetchServerTime()
    const syncInterval = setInterval(fetchServerTime, 60000)

    return () => {
      isMounted = false
      clearInterval(syncInterval)
    }
  }, [])

  // Ticks the client clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Resolve timezone to use: server timezone if loaded, otherwise fallback to local browser TZ
  const tz = serverTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone

  // Compute display time by adjusting client time with the server skew
  const displayTime = new Date(time.getTime() + timeSkew)

  // Format date in the selected timezone
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: tz }
  const formattedDate = displayTime.toLocaleDateString('es-ES', dateOptions)
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  // Extract hours, minutes, and seconds in the server timezone
  let hours = '00'
  let minutes = '00'
  let seconds = '00'

  try {
    const parts = new Intl.DateTimeFormat('es-ES', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(displayTime)
    
    hours = parts.find(p => p.type === 'hour')?.value || '00'
    minutes = parts.find(p => p.type === 'minute')?.value || '00'
    seconds = parts.find(p => p.type === 'second')?.value || '00'
  } catch (e) {
    hours = String(displayTime.getHours()).padStart(2, '0')
    minutes = String(displayTime.getMinutes()).padStart(2, '0')
    seconds = String(displayTime.getSeconds()).padStart(2, '0')
  }

  // Format calendar fields
  let monthName = '---'
  let dayNum = '--'
  let dayName = '---'

  try {
    monthName = displayTime.toLocaleDateString('es-ES', { month: 'short', timeZone: tz }).toUpperCase()
    dayNum = displayTime.toLocaleDateString('es-ES', { day: 'numeric', timeZone: tz })
    dayName = displayTime.toLocaleDateString('es-ES', { weekday: 'long', timeZone: tz }).toUpperCase()
  } catch (e) {
    monthName = displayTime.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()
    dayNum = String(displayTime.getDate())
    dayName = displayTime.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase()
  }

  // Format timezone offset (e.g. GMT-3 or GMT+1)
  let offsetString = ''
  try {
    const parts = new Intl.DateTimeFormat('es-ES', {
      timeZone: tz,
      timeZoneName: 'shortOffset'
    }).formatToParts(displayTime)
    offsetString = parts.find(p => p.type === 'timeZoneName')?.value || ''
  } catch (e) {
    // fallback empty
  }

  return (
    <div className="app-container">
      <div className="glow-effect"></div>
      <header className="app-header">
        <span className="badge">Proyecto Docker + React</span>
        <h1 className="title-grad">Actividad Integradora</h1>
        <p className="subtitle">Visualización en tiempo real desde el contenedor</p>
      </header>

      <main className="dashboard-content">
        <div className="card glass-card clock-card">
          <div className="card-header">
            <span className={`indicator ${isLoading ? 'fetching blinking' : serverError ? 'error' : 'blinking'}`}></span>
            <span className="card-title">HORA DEL SERVIDOR</span>
            <div style={{ marginLeft: 'auto' }}>
              {isLoading ? (
                <span className="sync-status-badge syncing">Sincronizando...</span>
              ) : serverError ? (
                <span className="sync-status-badge error">Error de Red</span>
              ) : (
                <span className="sync-status-badge connected">Conectado</span>
              )}
            </div>
          </div>
          
          {isLoading && !serverTimezone ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Obteniendo hora del contenedor...</span>
            </div>
          ) : (
            <>
              <div className="digital-clock">
                <span className="time-part">{hours}</span>
                <span className="time-separator">:</span>
                <span className="time-part">{minutes}</span>
                <span className="time-separator">:</span>
                <span className="time-part-sec">{seconds}</span>
              </div>
              
              {serverTimezone && (
                <div className="timezone-badge">
                  <span className="timezone-icon">🌐</span>
                  <span className="timezone-text">
                    TZ: {serverTimezone} {offsetString && `(${offsetString})`}
                  </span>
                </div>
              )}
            </>
          )}

          {serverError && (
            <div className="error-badge" style={{ marginTop: '1rem' }}>
              {serverError}. Usando hora local.
            </div>
          )}
        </div>

        <div className="card glass-card date-card">
          <div className="card-header">
            <svg className="calendar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="card-title">FECHA DEL SERVIDOR</span>
          </div>

          {isLoading && !serverTimezone ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <div className="calendar-display">
                <div className="calendar-month-year">
                  {monthName}
                </div>
                <div className="calendar-day-num">{dayNum}</div>
                <div className="calendar-day-name">{dayName}</div>
              </div>
              <p className="full-date-text">{capitalizedDate}</p>
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="tech-info">
          <span className="tech-badge node">Node.js v24</span>
          <span className="tech-badge vite">Vite</span>
          <span className="tech-badge react">React 19</span>
          <span className="tech-badge docker">Docker</span>
        </div>
        <p className="footer-credits">Desarrollado para la Actividad Integradora de Docker</p>
      </footer>
    </div>
  )
}

export default App

