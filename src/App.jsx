import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const formattedDate = time.toLocaleDateString('es-ES', dateOptions)
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  const hours = String(time.getHours()).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')

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
            <span className="indicator blinking"></span>
            <span className="card-title">HORA LOCAL</span>
          </div>
          <div className="digital-clock">
            <span className="time-part">{hours}</span>
            <span className="time-separator">:</span>
            <span className="time-part">{minutes}</span>
            <span className="time-separator">:</span>
            <span className="time-part-sec">{seconds}</span>
          </div>
        </div>

        <div className="card glass-card date-card">
          <div className="card-header">
            <svg className="calendar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="card-title">FECHA ACTUAL</span>
          </div>
          <div className="calendar-display">
            <div className="calendar-month-year">
              {time.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
            </div>
            <div className="calendar-day-num">{time.getDate()}</div>
            <div className="calendar-day-name">{time.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase()}</div>
          </div>
          <p className="full-date-text">{capitalizedDate}</p>
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
