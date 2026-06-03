import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { getTrainedDates, getRoutines } from '../utils/storage'

const MONTHS   = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DAYS_ABBR = ['D','S','T','Q','Q','S','S']
const DAYS_FULL = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const AC = 'var(--forge-accent)'
const AC10 = 'rgba(130,10,209,0.10)'
const AC20 = 'rgba(130,10,209,0.20)'
const AC40 = 'rgba(130,10,209,0.40)'
const AC05 = 'rgba(130,10,209,0.05)'

export default function HomeView() {
  const { user, navigate } = useApp()
  const today = new Date()
  const [calYear,  setCalYear]  = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())

  const trainedDates = useMemo(() => getTrainedDates(user.id), [user.id])
  const routines     = useMemo(() => getRoutines(user.id),     [user.id])

  const firstDay     = new Date(calYear, calMonth, 1).getDay()
  const daysInMonth  = new Date(calYear, calMonth + 1, 0).getDate()
  const todayKey     = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
  const monthTrained = trainedDates.filter(d => d.startsWith(`${calYear}-${String(calMonth+1).padStart(2,'0')}`))

  const streak = useMemo(() => {
    let s = 0; const d = new Date()
    for (let i = 0; i < 365; i++) {
      const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      if (trainedDates.includes(k)) { s++; d.setDate(d.getDate()-1) }
      else if (i > 0) break
      else d.setDate(d.getDate()-1)
    }
    return s
  }, [trainedDates])

  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i)
    const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    return { date: d, dayIndex: i, key: k, plan: routines[i],
             isToday: k === todayKey, trained: trainedDates.includes(k) }
  })
  const todayPlan = routines[today.getDay()]

  function changeMonth(dir) {
    let m = calMonth + dir, y = calYear
    if (m < 0)  { m = 11; y-- }
    if (m > 11) { m = 0;  y++ }
    setCalMonth(m); setCalYear(y)
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between animate-slide-up">
        <div>
          <p className="text-sm font-body" style={{ color: 'var(--forge-muted)' }}>{getGreeting()},</p>
          <h1 className="font-display font-black text-3xl uppercase tracking-wide leading-tight"
            style={{ color: 'var(--forge-text)' }}>
            {user.name.split(' ')[0]}
          </h1>
          <p className="text-sm font-body mt-0.5" style={{ color: 'var(--forge-text-dim)' }}>
            {todayPlan?.name
              ? <>Hoje: <span style={{ color: AC, fontWeight: 600 }}>{todayPlan.name}</span></>
              : 'Pronto para forjar seu corpo hoje?'
            }
          </p>
        </div>
        <div className="forge-card px-4 py-2 text-center">
          <div className="font-display font-black text-2xl" style={{ color: AC }}>{streak}</div>
          <div className="text-xs font-body uppercase tracking-wider" style={{ color: 'var(--forge-muted)' }}>sequência</div>
        </div>
      </div>

      {/* ── CTA ── */}
      <button onClick={() => navigate('workout')} className="forge-btn-accent flex items-center justify-center gap-3 animate-slide-up">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        Iniciar Treino de Hoje
      </button>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Este mês', value: monthTrained.length },
          { label: 'Total',    value: trainedDates.length },
          { label: 'Dias ok',  value: streak },
        ].map(s => (
          <div key={s.label} className="forge-card p-3 text-center">
            <div className="font-display font-black text-2xl" style={{ color: AC }}>{s.value}</div>
            <div className="text-xs font-body mt-0.5" style={{ color: 'var(--forge-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Calendar ── */}
      <div className="forge-card p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className="p-1 transition-colors"
            style={{ color: 'var(--forge-muted)' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <span className="font-display font-bold text-lg uppercase tracking-widest"
            style={{ color: 'var(--forge-text)' }}>
            {MONTHS[calMonth]} {calYear}
          </span>
          <button onClick={() => changeMonth(1)} className="p-1 transition-colors"
            style={{ color: 'var(--forge-muted)' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {DAYS_ABBR.map((d, i) => (
            <div key={i} className="text-center text-xs font-body font-600 uppercase tracking-wider py-1"
              style={{ color: 'rgba(130,10,209,0.5)' }}>{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
            const k       = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
            const trained = trainedDates.includes(k)
            const isToday = k === todayKey
            return (
              <div key={d}
                className="aspect-square flex items-center justify-center rounded-lg text-sm font-body font-500 relative transition-all duration-150"
                style={{
                  background: trained ? AC : isToday ? AC10 : 'transparent',
                  color: trained ? '#fff' : isToday ? AC : 'var(--forge-text-dim)',
                  fontWeight: trained || isToday ? 700 : 400,
                  border: isToday && !trained ? `1.5px solid ${AC}` : '1.5px solid transparent',
                  boxShadow: trained ? '0 0 10px rgba(130,10,209,0.3)' : 'none',
                }}>
                {d}
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: '1px solid var(--forge-border)' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: AC }} />
            <span className="text-xs font-body" style={{ color: 'var(--forge-muted)' }}>Treinou</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border" style={{ borderColor: AC }} />
            <span className="text-xs font-body" style={{ color: 'var(--forge-muted)' }}>Hoje</span>
          </div>
          <div className="ml-auto text-xs font-body" style={{ color: 'var(--forge-muted)' }}>
            <span style={{ color: AC, fontWeight: 700 }}>{monthTrained.length}</span> treinos este mês
          </div>
        </div>
      </div>

      {/* ── Weekly overview ── */}
      <div>
        <p className="font-display font-bold text-base uppercase tracking-widest mb-3"
          style={{ color: 'var(--forge-text-dim)' }}>Semana Atual</p>
        <div className="space-y-2">
          {weekDays.map(({ date, dayIndex, plan, isToday, trained }) => (
            <div key={dayIndex} className="forge-card px-4 py-3 flex items-center gap-3 transition-all"
              style={isToday ? { borderColor: AC40, background: AC05 } : {}}>
              <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                style={{
                  background: trained ? AC : isToday ? AC20 : 'var(--forge-surface)',
                  border: isToday && !trained ? `1.5px solid ${AC40}` : '1px solid var(--forge-border)',
                  boxShadow: trained ? '0 0 12px rgba(130,10,209,0.3)' : 'none',
                }}>
                <span className="text-xs font-body font-600 uppercase"
                  style={{ color: trained ? '#fff' : isToday ? AC : 'var(--forge-muted)' }}>
                  {DAYS_ABBR[dayIndex]}
                </span>
                <span className="text-sm font-display font-black"
                  style={{ color: trained ? '#fff' : isToday ? AC : 'var(--forge-text)' }}>
                  {date.getDate()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                {plan?.name ? (
                  <>
                    <p className="font-body font-600 text-sm truncate"
                      style={{ color: isToday ? AC : 'var(--forge-text)' }}>
                      {plan.name}
                    </p>
                    <p className="text-xs font-body" style={{ color: 'var(--forge-muted)' }}>
                      {plan.exercises?.length || 0} exercícios
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-body" style={{ color: 'rgba(130,10,209,0.25)' }}>Descanso</p>
                )}
              </div>
              {trained && (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
                  stroke="var(--forge-accent)" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
              {isToday && !trained && plan?.name && (
                <button onClick={() => navigate('workout')}
                  className="text-xs font-body font-600 px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: AC, color: '#fff' }}>
                  Iniciar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
