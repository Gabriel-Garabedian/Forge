import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { getRoutines, saveRoutines } from '../utils/storage'

const DAYS_FULL  = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
const DAYS_SHORT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const AC  = 'var(--forge-accent)'
const AC10 = 'rgba(130,10,209,0.10)'
const AC20 = 'rgba(130,10,209,0.20)'
const AC30 = 'rgba(130,10,209,0.30)'

function genId() { return Math.random().toString(36).slice(2,9) }

export default function RoutineView() {
  const { user } = useApp()
  const [routines,          setRoutines]          = useState({})
  const [selectedDay,       setSelectedDay]       = useState(new Date().getDay())
  const [showAddExercise,   setShowAddExercise]   = useState(false)
  const [editingWorkoutName,setEditingWorkoutName]= useState(false)
  const [exForm,            setExForm]            = useState({ name:'', sets:'3', reps:'10', notes:'' })

  useEffect(() => { setRoutines(getRoutines(user.id)) }, [user.id])

  function persist(updated) { setRoutines(updated); saveRoutines(user.id, updated) }

  function setDayName(dayIndex, name) {
    const u = { ...routines }
    if (!u[dayIndex]) u[dayIndex] = { name:'', exercises:[] }
    u[dayIndex] = { ...u[dayIndex], name }
    persist(u)
  }

  function addExercise(dayIndex) {
    if (!exForm.name.trim()) return
    const u = { ...routines }
    if (!u[dayIndex]) u[dayIndex] = { name:'', exercises:[] }
    u[dayIndex] = { ...u[dayIndex], exercises: [...(u[dayIndex].exercises||[]),
      { id:genId(), name:exForm.name.trim(), sets:parseInt(exForm.sets)||3,
        reps:exForm.reps.trim()||'10', notes:exForm.notes.trim() }]}
    persist(u)
    setExForm({ name:'', sets:'3', reps:'10', notes:'' })
    setShowAddExercise(false)
  }

  function removeExercise(dayIndex, exId) {
    const u = { ...routines }
    u[dayIndex] = { ...u[dayIndex], exercises: u[dayIndex].exercises.filter(e => e.id !== exId) }
    if (!u[dayIndex].exercises.length && !u[dayIndex].name) delete u[dayIndex]
    persist(u)
  }

  function moveExercise(dayIndex, exId, dir) {
    const u = { ...routines }
    const exs = [...u[dayIndex].exercises]
    const idx = exs.findIndex(e => e.id === exId)
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= exs.length) return
    ;[exs[idx], exs[newIdx]] = [exs[newIdx], exs[idx]]
    u[dayIndex] = { ...u[dayIndex], exercises: exs }
    persist(u)
  }

  function clearDay(dayIndex) { const u = { ...routines }; delete u[dayIndex]; persist(u) }

  const day = routines[selectedDay]

  return (
    <div className="pb-4">
      {/* ── Header ── */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="font-display font-black text-3xl uppercase tracking-wide"
          style={{ color: 'var(--forge-text)' }}>Minha Rotina</h1>
        <p className="text-sm font-body mt-1" style={{ color: 'var(--forge-muted)' }}>
          Organize sua semana de treinos
        </p>
      </div>

      {/* ── Day Selector ── */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth:'none' }}>
          {DAYS_SHORT.map((d, i) => {
            const hasPlan = routines[i]?.name || routines[i]?.exercises?.length
            const isToday = i === new Date().getDay()
            const isSel   = i === selectedDay
            return (
              <button key={i}
                onClick={() => { setSelectedDay(i); setShowAddExercise(false); setEditingWorkoutName(false) }}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl transition-all relative"
                style={{
                  background: isSel ? AC : 'var(--forge-card)',
                  border: `1px solid ${isSel ? AC : 'var(--forge-border)'}`,
                  color: isSel ? '#fff' : 'var(--forge-text-dim)',
                  boxShadow: isSel ? '0 0 16px rgba(130,10,209,0.35)' : 'none',
                }}>
                {hasPlan && !isSel && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: AC }} />
                )}
                <span className="text-xs font-body font-600 uppercase tracking-wider"
                  style={{ color: isSel ? 'rgba(255,255,255,0.7)' : 'var(--forge-muted)' }}>{d}</span>
                <span className="text-xs font-body font-500"
                  style={{ color: isSel ? '#fff' : isToday ? AC : 'inherit' }}>
                  {isToday ? 'Hoje' : `${i+1}°`}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Day Editor ── */}
      <div className="px-4 space-y-3">

        {/* Workout name card */}
        <div className="forge-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: AC10, border: `1px solid ${AC30}` }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--forge-accent)" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <div className="flex-1">
              {editingWorkoutName ? (
                <input autoFocus className="forge-input py-1 text-sm"
                  placeholder="Nome do treino (ex: Peito & Tríceps)"
                  value={day?.name || ''}
                  onChange={e => setDayName(selectedDay, e.target.value)}
                  onBlur={() => setEditingWorkoutName(false)}
                  onKeyDown={e => e.key === 'Enter' && setEditingWorkoutName(false)}
                />
              ) : (
                <button className="text-left w-full" onClick={() => setEditingWorkoutName(true)}>
                  <p className="text-xs font-body uppercase tracking-widest mb-0.5"
                    style={{ color: 'var(--forge-muted)' }}>{DAYS_FULL[selectedDay]}</p>
                  <p className="font-body font-600 text-sm"
                    style={{ color: day?.name ? 'var(--forge-text)' : 'rgba(130,10,209,0.3)' }}>
                    {day?.name || 'Toque para nomear o treino...'}
                  </p>
                </button>
              )}
            </div>
            {(day?.name || day?.exercises?.length) ? (
              <button onClick={() => clearDay(selectedDay)}
                className="p-1 transition-colors"
                style={{ color: 'rgba(239,68,68,0.4)' }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
                </svg>
              </button>
            ) : null}
          </div>
        </div>

        {/* Exercises */}
        {day?.exercises?.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-body uppercase tracking-widest px-1"
              style={{ color: 'var(--forge-muted)' }}>
              {day.exercises.length} exercício{day.exercises.length !== 1 ? 's' : ''}
            </p>
            {day.exercises.map((ex, idx) => (
              <div key={ex.id} className="forge-card p-3 flex items-center gap-3 animate-slide-up">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--forge-surface)', border: '1px solid var(--forge-border)' }}>
                  <span className="font-display font-bold text-sm" style={{ color: AC }}>{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-600 text-sm truncate" style={{ color: 'var(--forge-text)' }}>{ex.name}</p>
                  <p className="text-xs font-body" style={{ color: 'var(--forge-muted)' }}>
                    {ex.sets} séries × {ex.reps} reps
                    {ex.notes && <span style={{ color: 'var(--forge-muted)', opacity: 0.6 }}> · {ex.notes}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button onClick={() => moveExercise(selectedDay, ex.id, -1)} disabled={idx === 0}
                    className="p-1.5 transition-colors disabled:opacity-20"
                    style={{ color: 'var(--forge-muted)' }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                  </button>
                  <button onClick={() => moveExercise(selectedDay, ex.id, 1)}
                    disabled={idx === day.exercises.length - 1}
                    className="p-1.5 transition-colors disabled:opacity-20"
                    style={{ color: 'var(--forge-muted)' }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  <button onClick={() => removeExercise(selectedDay, ex.id)}
                    className="p-1.5 transition-colors"
                    style={{ color: 'rgba(239,68,68,0.4)' }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add exercise form */}
        {showAddExercise ? (
          <div className="forge-card p-4 space-y-3 animate-slide-up"
            style={{ borderColor: AC30 }}>
            <p className="font-display font-bold text-base uppercase tracking-widest"
              style={{ color: AC }}>Novo Exercício</p>
            <input autoFocus className="forge-input"
              placeholder="Nome do exercício"
              value={exForm.name}
              onChange={e => setExForm(f => ({ ...f, name: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && addExercise(selectedDay)}
            />
            <div className="grid grid-cols-3 gap-3">
              {[
                { key:'sets',  label:'Séries', placeholder:'3',  type:'number' },
                { key:'reps',  label:'Reps',   placeholder:'10', type:'text'   },
                { key:'notes', label:'Obs',    placeholder:'—',  type:'text'   },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-body uppercase tracking-wider mb-1"
                    style={{ color: 'var(--forge-text-dim)' }}>{f.label}</label>
                  <input type={f.type} className="forge-input text-center py-2"
                    placeholder={f.placeholder}
                    value={exForm[f.key]}
                    onChange={e => setExForm(p => ({ ...p, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => addExercise(selectedDay)} className="forge-btn-accent py-2.5 text-sm flex-1">
                Adicionar
              </button>
              <button onClick={() => { setShowAddExercise(false); setExForm({ name:'', sets:'3', reps:'10', notes:'' }) }}
                className="forge-btn-ghost px-4">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddExercise(true)}
            className="w-full forge-card p-3 flex items-center justify-center gap-2 transition-all"
            style={{ borderStyle: 'dashed', color: 'var(--forge-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = AC30; e.currentTarget.style.color = AC }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--forge-border)'; e.currentTarget.style.color = 'var(--forge-muted)' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span className="font-body font-500 text-sm">Adicionar Exercício</span>
          </button>
        )}

        {!day?.exercises?.length && !showAddExercise && (
          <div className="text-center py-8" style={{ color: 'rgba(130,10,209,0.2)' }}>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"
              className="mx-auto mb-3 opacity-40">
              <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/>
            </svg>
            <p className="text-sm font-body" style={{ color: 'var(--forge-muted)' }}>
              Nenhum exercício para {DAYS_FULL[selectedDay]}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
