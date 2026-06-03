import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { getRoutines, saveActiveWorkout, clearActiveWorkout, saveLog } from '../utils/storage'

const DAYS_FULL   = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
const REST_SECS   = 60
const AC          = 'var(--forge-accent)'
const AC10        = 'rgba(130,10,209,0.10)'
const AC20        = 'rgba(130,10,209,0.20)'

function genId() { return Math.random().toString(36).slice(2,9) }

// ─── Rest Timer Overlay ───────────────────────────────────────────────────────
function RestTimerOverlay({ seconds, onSkip }) {
  const [remaining, setRemaining] = useState(seconds)
  const r    = 44
  const circ = 2 * Math.PI * r
  const prog = (remaining / seconds) * circ
  const warn = remaining <= 10

  useEffect(() => {
    if (remaining <= 0) { onSkip(); return }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining, onSkip])

  useEffect(() => {
    if (remaining === 0 && navigator.vibrate) navigator.vibrate([200,100,200])
  }, [remaining])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center slide-in-bottom"
      style={{ background: 'rgba(10,10,10,0.96)', backdropFilter: 'blur(16px)' }}>
      <div className="text-center space-y-6">
        <p className="font-display font-bold text-lg uppercase tracking-[0.2em]"
          style={{ color: 'var(--forge-muted)' }}>Descanso</p>

        <div className="relative w-44 h-44" style={{ animation: warn ? 'pulseGlow 0.8s ease-in-out infinite' : 'none' }}>
          <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--forge-card)" strokeWidth="6"/>
            <circle cx="50" cy="50" r={r} fill="none"
              stroke={warn ? '#ef4444' : AC}
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ - prog}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-black text-5xl"
              style={{ color: warn ? '#ef4444' : AC }}>
              {remaining}
            </span>
            <span className="text-xs font-body uppercase tracking-widest"
              style={{ color: 'var(--forge-muted)' }}>seg</span>
          </div>
        </div>

        <button onClick={onSkip} className="forge-btn-accent" style={{ maxWidth: 220, margin: '0 auto' }}>
          Pular Descanso
        </button>
        <p className="text-xs font-body" style={{ color: 'rgba(130,10,209,0.35)' }}>
          Próxima série em {remaining}s...
        </p>
      </div>
    </div>
  )
}

// ─── No Workout / selector ────────────────────────────────────────────────────
function NoWorkout({ user, onStart }) {
  const routines    = getRoutines(user.id)
  const today       = new Date().getDay()
  const todayPlan   = routines[today]
  const availDays   = Object.entries(routines)
    .filter(([,v]) => v?.exercises?.length > 0)
    .map(([k,v]) => ({ dayIndex: parseInt(k), ...v }))

  return (
    <div className="px-4 pt-6 pb-4 space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-3xl uppercase tracking-wide"
          style={{ color: 'var(--forge-text)' }}>Em Treino</h1>
        <p className="text-sm font-body mt-1" style={{ color: 'var(--forge-muted)' }}>
          Selecione um treino para iniciar
        </p>
      </div>

      {todayPlan?.exercises?.length > 0 && (
        <div>
          <p className="text-xs font-body uppercase tracking-widest mb-2"
            style={{ color: 'var(--forge-muted)' }}>Treino de hoje</p>
          <button onClick={() => onStart(today)}
            className="w-full forge-card p-4 text-left flex items-center gap-4 transition-all"
            style={{ borderColor: 'rgba(130,10,209,0.4)', background: AC10 }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: AC, boxShadow: '0 0 20px rgba(130,10,209,0.4)' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <div>
              <p className="font-display font-bold text-lg uppercase tracking-wide" style={{ color: AC }}>
                {todayPlan.name || DAYS_FULL[today]}
              </p>
              <p className="text-sm font-body" style={{ color: 'var(--forge-muted)' }}>
                {todayPlan.exercises.length} exercícios · {DAYS_FULL[today]}
              </p>
            </div>
          </button>
        </div>
      )}

      {availDays.filter(d => d.dayIndex !== today).length > 0 && (
        <div>
          <p className="text-xs font-body uppercase tracking-widest mb-2"
            style={{ color: 'var(--forge-muted)' }}>Outros treinos</p>
          <div className="space-y-2">
            {availDays.filter(d => d.dayIndex !== today).map(plan => (
              <button key={plan.dayIndex} onClick={() => onStart(plan.dayIndex)}
                className="w-full forge-card p-4 text-left flex items-center gap-4 transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--forge-surface)', border: '1px solid var(--forge-border)' }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"
                    stroke="var(--forge-muted)" strokeWidth="1.8">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
                <div>
                  <p className="font-display font-bold text-base uppercase tracking-wide"
                    style={{ color: 'var(--forge-text)' }}>
                    {plan.name || DAYS_FULL[plan.dayIndex]}
                  </p>
                  <p className="text-sm font-body" style={{ color: 'var(--forge-muted)' }}>
                    {plan.exercises.length} exercícios · {DAYS_FULL[plan.dayIndex]}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {availDays.length === 0 && (
        <div className="forge-card p-8 text-center space-y-3">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="var(--forge-muted)"
            strokeWidth="1" className="mx-auto opacity-30">
            <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/>
          </svg>
          <p className="text-sm font-body" style={{ color: 'var(--forge-muted)' }}>
            Nenhum treino planejado.
          </p>
          <p className="text-xs font-body" style={{ color: 'rgba(130,10,209,0.3)' }}>
            Vá em "Rotina" para criar seus treinos.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Main View ────────────────────────────────────────────────────────────────
export default function ActiveWorkoutView() {
  const { user, activeWorkout, setActiveWorkout, navigate } = useApp()
  const [showRest,      setShowRest]      = useState(false)
  const [elapsed,       setElapsed]       = useState(0)
  const [confirmFinish, setConfirmFinish] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (activeWorkout?.startTime)
      setElapsed(Math.floor((Date.now() - activeWorkout.startTime) / 1000))
  }, [activeWorkout?.startTime])

  useEffect(() => {
    if (!activeWorkout) return
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - activeWorkout.startTime) / 1000))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [activeWorkout?.startTime])

  function startWorkout(dayIndex) {
    const plan = getRoutines(user.id)[dayIndex]
    if (!plan) return
    const workout = {
      id: genId(), dayIndex, name: plan.name || DAYS_FULL[dayIndex],
      startTime: Date.now(),
      exercises: plan.exercises.map(ex => ({
        ...ex,
        sets: Array.from({ length: ex.sets }, () => ({ id:genId(), reps:'', weight:'', done:false }))
      }))
    }
    saveActiveWorkout(workout)
    setActiveWorkout(workout)
  }

  function updateSet(exIdx, setIdx, field, value) {
    if (!activeWorkout) return
    const updated = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((ex, ei) =>
        ei !== exIdx ? ex : {
          ...ex,
          sets: ex.sets.map((s, si) => si !== setIdx ? s : { ...s, [field]: value })
        }
      )
    }
    saveActiveWorkout(updated); setActiveWorkout(updated)
  }

  function toggleSetDone(exIdx, setIdx) {
    if (!activeWorkout) return
    const wasDone = activeWorkout.exercises[exIdx].sets[setIdx].done
    const updated = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((ex, ei) =>
        ei !== exIdx ? ex : {
          ...ex,
          sets: ex.sets.map((s, si) => si !== setIdx ? s : { ...s, done: !s.done })
        }
      )
    }
    saveActiveWorkout(updated); setActiveWorkout(updated)
    if (!wasDone) setShowRest(true)
  }

  function addSet(exIdx) {
    if (!activeWorkout) return
    const updated = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((ex, ei) =>
        ei !== exIdx ? ex : { ...ex, sets: [...ex.sets, { id:genId(), reps:'', weight:'', done:false }] }
      )
    }
    saveActiveWorkout(updated); setActiveWorkout(updated)
  }

  const skipRest = useCallback(() => setShowRest(false), [])

  function finishWorkout() {
    if (!activeWorkout) return
    const duration = Math.floor((Date.now() - activeWorkout.startTime) / 1000)
    const now = new Date()
    const dateKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
    saveLog(user.id, { id:activeWorkout.id, date:dateKey, dayIndex:activeWorkout.dayIndex,
      name:activeWorkout.name, duration, exercises:activeWorkout.exercises })
    clearActiveWorkout(); setActiveWorkout(null)
    clearInterval(timerRef.current)
    navigate('home')
  }

  function cancelWorkout() {
    clearActiveWorkout(); setActiveWorkout(null)
    clearInterval(timerRef.current); setConfirmFinish(false)
  }

  const fmt = s => {
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  if (!activeWorkout) return <NoWorkout user={user} onStart={startWorkout} />

  const totalSets = activeWorkout.exercises.reduce((a,ex) => a + ex.sets.length, 0)
  const doneSets  = activeWorkout.exercises.reduce((a,ex) => a + ex.sets.filter(s=>s.done).length, 0)
  const progress  = totalSets > 0 ? doneSets / totalSets : 0

  return (
    <div className="pb-4">
      {showRest && <RestTimerOverlay seconds={REST_SECS} onSkip={skipRest} />}

      {/* ── Header ── */}
      <div className="px-4 pt-6 pb-4" style={{ borderBottom: '1px solid var(--forge-border)', background: 'var(--forge-surface)' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-body uppercase tracking-widest" style={{ color: 'var(--forge-muted)' }}>Em Treino</p>
            <h2 className="font-display font-black text-2xl uppercase tracking-wide leading-tight"
              style={{ color: 'var(--forge-text)' }}>
              {activeWorkout.name}
            </h2>
          </div>
          <div className="text-right">
            <div className="font-display font-black text-3xl" style={{ color: AC }}>{fmt(elapsed)}</div>
            <p className="text-xs font-body uppercase tracking-wider" style={{ color: 'var(--forge-muted)' }}>duração</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ background: 'var(--forge-border)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%`, background: AC,
                boxShadow: progress > 0 ? '0 0 8px rgba(130,10,209,0.5)' : 'none' }} />
          </div>
          <span className="text-xs font-body whitespace-nowrap" style={{ color: 'var(--forge-muted)' }}>
            {doneSets}/{totalSets} séries
          </span>
        </div>
      </div>

      {/* ── Exercises ── */}
      <div className="px-4 pt-4 space-y-4">
        {activeWorkout.exercises.map((ex, exIdx) => {
          const exDone = ex.sets.every(s => s.done)
          const doneCount = ex.sets.filter(s => s.done).length
          return (
            <div key={ex.id} className="forge-card overflow-hidden"
              style={exDone ? { borderColor: 'rgba(130,10,209,0.4)' } : {}}>

              {/* Ex header */}
              <div className="px-4 py-3 flex items-center gap-3"
                style={{
                  background: exDone ? AC10 : 'var(--forge-surface)',
                  borderBottom: '1px solid var(--forge-border)'
                }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: exDone ? AC : 'var(--forge-card)',
                    border: `1px solid ${exDone ? AC : 'var(--forge-border)'}`,
                  }}>
                  {exDone
                    ? <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : <span className="font-display font-bold text-xs" style={{ color: AC }}>{exIdx+1}</span>
                  }
                </div>
                <p className="font-body font-600 text-sm flex-1"
                  style={{ color: exDone ? AC : 'var(--forge-text)' }}>{ex.name}</p>
                <span className="text-xs font-body font-600"
                  style={{ color: exDone ? AC : 'var(--forge-muted)' }}>
                  {exDone ? 'Concluído ✓' : `${doneCount}/${ex.sets.length}`}
                </span>
              </div>

              {/* Sets table */}
              <div className="px-4 pt-2 pb-3">
                <div className="grid grid-cols-[28px_1fr_1fr_36px] gap-2 mb-2">
                  {['S','Reps','kg','✓'].map((h, i) => (
                    <div key={i} className="text-xs font-body uppercase tracking-wider text-center"
                      style={{ color: 'var(--forge-muted)' }}>{h}</div>
                  ))}
                </div>
                <div className="space-y-2">
                  {ex.sets.map((set, setIdx) => (
                    <div key={set.id}
                      className="grid grid-cols-[28px_1fr_1fr_36px] gap-2 items-center"
                      style={{ opacity: set.done ? 0.55 : 1 }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto text-xs font-display font-bold"
                        style={{
                          background: set.done ? AC20 : 'var(--forge-surface)',
                          border: '1px solid var(--forge-border)',
                          color: set.done ? AC : 'var(--forge-muted)',
                        }}>
                        {setIdx+1}
                      </div>
                      <input type="text" inputMode="numeric" className="forge-input py-2 text-center text-sm"
                        placeholder="—" value={set.reps} disabled={set.done}
                        onChange={e => updateSet(exIdx, setIdx, 'reps', e.target.value)} />
                      <input type="text" inputMode="decimal" className="forge-input py-2 text-center text-sm"
                        placeholder="—" value={set.weight} disabled={set.done}
                        onChange={e => updateSet(exIdx, setIdx, 'weight', e.target.value)} />
                      <button onClick={() => toggleSetDone(exIdx, setIdx)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-all"
                        style={{
                          background: set.done ? AC : 'transparent',
                          border: `2px solid ${set.done ? AC : 'var(--forge-border)'}`,
                          boxShadow: set.done ? '0 0 10px rgba(130,10,209,0.35)' : 'none',
                        }}>
                        {set.done && (
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addSet(exIdx)}
                  className="w-full mt-3 py-2 rounded-lg text-xs font-body flex items-center justify-center gap-1 transition-all"
                  style={{ border: '1px dashed var(--forge-border)', color: 'rgba(130,10,209,0.35)' }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  adicionar série
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Finish bar ── */}
      <div className="px-4 mt-6 space-y-2">
        {confirmFinish ? (
          <div className="forge-card p-4 space-y-3 scale-in"
            style={{ borderColor: 'rgba(130,10,209,0.35)' }}>
            <p className="font-body font-600 text-sm text-center" style={{ color: 'var(--forge-text)' }}>
              Finalizar treino agora?
            </p>
            <p className="text-xs text-center font-body" style={{ color: 'var(--forge-muted)' }}>
              {doneSets} de {totalSets} séries · {fmt(elapsed)}
            </p>
            <div className="flex gap-2">
              <button onClick={finishWorkout} className="forge-btn-accent flex-1 py-3 text-sm">
                Finalizar ✓
              </button>
              <button onClick={() => setConfirmFinish(false)} className="forge-btn-ghost px-5">
                Voltar
              </button>
            </div>
            <button onClick={cancelWorkout}
              className="w-full text-center text-xs font-body transition-colors"
              style={{ color: 'rgba(239,68,68,0.4)' }}>
              Cancelar treino (sem salvar)
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmFinish(true)}
            className="forge-btn-accent flex items-center justify-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Finalizar Treino
          </button>
        )}
      </div>
    </div>
  )
}
