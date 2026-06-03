import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { getPRs, savePRs, getLogs, getTrainedDates } from '../utils/storage'

const PR_MOVEMENTS = [
  { key: 'Supino Reto',        icon: '🏋️', label: 'Supino Reto' },
  { key: 'Agachamento',        icon: '🦵', label: 'Agachamento' },
  { key: 'Levantamento Terra', icon: '⚡', label: 'Levantamento Terra' },
  { key: 'Desenvolvimento',    icon: '💪', label: 'Desenvolvimento' },
  { key: 'Remada Curvada',     icon: '🔗', label: 'Remada Curvada' },
]

function formatDuration(s) {
  if (!s) return '—'
  const m = Math.floor(s / 60)
  if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}min`
  return `${m}min`
}

// ─── Theme Toggle Component ───────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, toggleTheme } = useApp()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center justify-between p-4 rounded-xl transition-all"
      style={{
        background: 'var(--forge-card)',
        border: '1px solid var(--forge-border)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(130,10,209,0.1)', border: '1px solid rgba(130,10,209,0.2)' }}>
          {isDark ? (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--forge-accent)" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--forge-accent)" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </div>
        <div className="text-left">
          <p className="font-body font-600 text-sm" style={{ color: 'var(--forge-text)' }}>
            {isDark ? 'Modo Escuro' : 'Modo Claro'}
          </p>
          <p className="text-xs font-body" style={{ color: 'var(--forge-text-dim)' }}>
            Toque para alternar o tema
          </p>
        </div>
      </div>

      {/* Toggle switch */}
      <div className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
        style={{ background: isDark ? 'var(--forge-accent)' : 'var(--forge-border)' }}>
        <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300"
          style={{ left: isDark ? '26px' : '2px' }} />
      </div>
    </button>
  )
}

export default function ProfileView() {
  const { user, logout } = useApp()
  const [prs, setPRs]             = useState({})
  const [editingPR, setEditingPR] = useState(null)
  const [prInput, setPrInput]     = useState('')
  const [logs, setLogs]           = useState([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    setPRs(getPRs())
    setLogs(getLogs(user.id).slice().reverse())
  }, [user.id])

  function savePR(key) {
    const val = parseFloat(prInput)
    if (isNaN(val) || val <= 0) { setEditingPR(null); return }
    const updated = { ...prs, [key]: val }
    savePRs(updated)
    setPRs(updated)
    setEditingPR(null)
    setPrInput('')
  }

  const trainedDates = getTrainedDates(user.id)
  const totalWorkouts = trainedDates.length
  const avgDuration = logs.length
    ? Math.round(logs.reduce((acc, l) => acc + (l.duration || 0), 0) / logs.length)
    : 0

  let streak = 0
  const d = new Date()
  for (let i = 0; i < 365; i++) {
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    if (trainedDates.includes(key)) { streak++; d.setDate(d.getDate() - 1) }
    else if (i > 0) break
    else d.setDate(d.getDate() - 1)
  }

  return (
    <div className="px-4 pt-6 pb-8 space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl uppercase tracking-wide" style={{ color: 'var(--forge-text)' }}>
            Perfil
          </h1>
          <p className="text-sm font-body mt-0.5" style={{ color: 'var(--forge-muted)' }}>{user.email}</p>
        </div>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(130,10,209,0.1)', border: '1.5px solid rgba(130,10,209,0.3)' }}>
          <span className="font-display font-black text-2xl" style={{ color: 'var(--forge-accent)' }}>
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── User card ── */}
      <div className="forge-card p-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,rgba(130,10,209,0.2),rgba(130,10,209,0.05))', border: '1.5px solid rgba(130,10,209,0.2)' }}>
          <span className="font-display font-black text-3xl" style={{ color: 'var(--forge-accent)' }}>
            {user.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-xl uppercase tracking-wide" style={{ color: 'var(--forge-text)' }}>
            {user.name}
          </p>
          <p className="text-xs font-body" style={{ color: 'var(--forge-muted)' }}>{user.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs px-2 py-0.5 rounded-full font-body font-600 uppercase tracking-wider"
              style={{ background: 'rgba(130,10,209,0.1)', color: 'var(--forge-accent)', border: '1px solid rgba(130,10,209,0.2)' }}>
              Atleta
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Treinos',   value: totalWorkouts },
          { label: 'Sequência', value: streak },
          { label: 'Avg. Duração', value: formatDuration(avgDuration) },
        ].map(s => (
          <div key={s.label} className="forge-card p-3 text-center">
            <div className="font-display font-black text-2xl" style={{ color: 'var(--forge-accent)' }}>{s.value}</div>
            <div className="text-xs font-body mt-0.5" style={{ color: 'var(--forge-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Theme toggle ── */}
      <div>
        <p className="text-xs font-body font-600 uppercase tracking-widest mb-2" style={{ color: 'var(--forge-text-dim)' }}>
          Aparência
        </p>
        <ThemeToggle />
      </div>

      {/* ── PRs ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-body font-600 uppercase tracking-widest" style={{ color: 'var(--forge-text-dim)' }}>
            Recordes Pessoais
          </p>
          <span className="text-xs font-body" style={{ color: 'var(--forge-muted)' }}>em kg</span>
        </div>
        <div className="space-y-2">
          {PR_MOVEMENTS.map(mv => (
            <div key={mv.key} className="forge-card p-4 flex items-center gap-4">
              <div className="text-2xl flex-shrink-0">{mv.icon}</div>
              <div className="flex-1">
                <p className="font-body font-600 text-sm" style={{ color: 'var(--forge-text)' }}>{mv.label}</p>
                {editingPR === mv.key ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      autoFocus
                      type="number"
                      inputMode="decimal"
                      className="forge-input py-1 text-sm"
                      style={{ maxWidth: 110 }}
                      placeholder="kg"
                      value={prInput}
                      onChange={e => setPrInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') savePR(mv.key)
                        if (e.key === 'Escape') setEditingPR(null)
                      }}
                    />
                    <button onClick={() => savePR(mv.key)}
                      className="text-sm font-body font-600 hover:underline"
                      style={{ color: 'var(--forge-accent)' }}>
                      Salvar
                    </button>
                    <button onClick={() => setEditingPR(null)}
                      className="text-sm font-body"
                      style={{ color: 'var(--forge-muted)' }}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <p className="text-xs font-body mt-0.5">
                    {prs[mv.key]
                      ? <span className="font-display font-black text-base" style={{ color: 'var(--forge-accent)' }}>{prs[mv.key]} kg</span>
                      : <span style={{ color: 'rgba(130,10,209,0.3)' }}>Não registrado</span>
                    }
                  </p>
                )}
              </div>
              {editingPR !== mv.key && (
                <button
                  onClick={() => { setEditingPR(mv.key); setPrInput(prs[mv.key] || '') }}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--forge-muted)' }}
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Workout History ── */}
      <div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-between w-full mb-3"
        >
          <p className="text-xs font-body font-600 uppercase tracking-widest" style={{ color: 'var(--forge-text-dim)' }}>
            Histórico de Treinos
          </p>
          <svg
            width="18" height="18" fill="none" viewBox="0 0 24 24"
            stroke="var(--forge-muted)" strokeWidth="2"
            style={{ transform: showHistory ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {showHistory && (
          <div className="space-y-2 animate-slide-up">
            {logs.length === 0 ? (
              <div className="forge-card p-6 text-center text-sm font-body" style={{ color: 'var(--forge-muted)' }}>
                Nenhum treino realizado ainda.
              </div>
            ) : logs.slice(0, 15).map((log, i) => (
              <div key={log.id || i} className="forge-card px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--forge-surface)' }}>
                  <span className="font-display font-bold text-sm" style={{ color: 'var(--forge-accent)' }}>
                    {log.date?.split('-')[2]}
                  </span>
                  <span className="text-xs font-body uppercase" style={{ color: 'var(--forge-muted)' }}>
                    {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][parseInt(log.date?.split('-')[1]) - 1]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-600 text-sm truncate" style={{ color: 'var(--forge-text)' }}>{log.name}</p>
                  <p className="text-xs font-body" style={{ color: 'var(--forge-muted)' }}>
                    {log.exercises?.length} exercícios · {formatDuration(log.duration)}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(130,10,209,0.1)' }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--forge-accent)" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
            ))}
            {logs.length > 15 && (
              <p className="text-center text-xs py-2 font-body" style={{ color: 'var(--forge-muted)' }}>
                + {logs.length - 15} treinos anteriores
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Logout ── */}
      <button
        onClick={logout}
        className="w-full forge-card p-4 flex items-center justify-center gap-3 transition-all"
        style={{ color: 'rgba(239,68,68,0.75)' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--forge-border)'}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
        </svg>
        <span className="font-body font-600 text-sm">Sair da conta</span>
      </button>

      <p className="text-center text-xs font-body tracking-widest" style={{ color: 'rgba(130,10,209,0.2)' }}>
        FORGE v1.0 · Premium Gym Tracker
      </p>
    </div>
  )
}
