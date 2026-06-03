import React, { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { getPersonalData, savePersonalData, addMessage, addAssessment } from '../utils/storage'

// ─── Sub-tabs ─────────────────────────────────────────────────────────────────
const SUBTABS = [
  { id: 'overview',    label: 'Perfil' },
  { id: 'chat',        label: 'Chat' },
  { id: 'assessments', label: 'Avaliações' },
  { id: 'programs',    label: 'Programas' },
]

// ─── Setup screen (no trainer yet) ───────────────────────────────────────────
function NoTrainer({ onSetup }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center space-y-6">
      <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto"
        style={{ background: 'rgba(130,10,209,0.12)', border: '1.5px solid rgba(130,10,209,0.25)' }}>
        <svg width="44" height="44" fill="none" viewBox="0 0 24 24" stroke="var(--forge-accent)" strokeWidth="1.4">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      </div>
      <div>
        <h2 className="font-display font-black text-2xl uppercase tracking-wide mb-2"
          style={{ color: 'var(--forge-text)' }}>
          Sem Personal Trainer
        </h2>
        <p className="text-sm font-body" style={{ color: 'var(--forge-text-dim)' }}>
          Você ainda não tem um personal trainer vinculado. Configure agora para acompanhar seus programas, avaliações e trocar mensagens.
        </p>
      </div>
      <button onClick={onSetup} className="forge-btn-accent" style={{ maxWidth: 280 }}>
        Vincular Personal Trainer
      </button>
    </div>
  )
}

// ─── Setup Form ───────────────────────────────────────────────────────────────
function SetupForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '', bio: '', phone: '', instagram: '', email: '',
    specialties: [], photo: '',
  })
  const [spec, setSpec] = useState('')

  const SPEC_OPTIONS = ['Hipertrofia','Emagrecimento','Resistência','Funcional','Powerlifting','CrossFit','Reabilitação','Nutrição']

  function toggleSpec(s) {
    setForm(f => ({
      ...f,
      specialties: f.specialties.includes(s)
        ? f.specialties.filter(x => x !== s)
        : [...f.specialties, s]
    }))
  }

  function handleSave() {
    if (!form.name.trim()) return
    onSave({ ...form, messages: [], assessments: [], programs: [] })
  }

  return (
    <div className="px-4 pt-6 pb-8 space-y-5 animate-slide-up">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onCancel} style={{ color: 'var(--forge-text-dim)' }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="font-display font-black text-2xl uppercase tracking-wide" style={{ color: 'var(--forge-text)' }}>
          Dados do Personal
        </h1>
      </div>

      {/* Avatar placeholder */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(130,10,209,0.12)', border: '1.5px dashed rgba(130,10,209,0.35)' }}>
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="var(--forge-accent)" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>

      {[
        { key: 'name',      label: 'Nome do Personal *', placeholder: 'Dr. João Ferreira' },
        { key: 'email',     label: 'E-mail',             placeholder: 'personal@email.com' },
        { key: 'phone',     label: 'WhatsApp / Telefone',placeholder: '(81) 99999-0000' },
        { key: 'instagram', label: 'Instagram',          placeholder: '@personal_joao' },
      ].map(f => (
        <div key={f.key}>
          <label className="block text-xs font-body font-600 uppercase tracking-widest mb-1.5"
            style={{ color: 'var(--forge-text-dim)' }}>{f.label}</label>
          <input
            className="forge-input"
            placeholder={f.placeholder}
            value={form[f.key]}
            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
          />
        </div>
      ))}

      <div>
        <label className="block text-xs font-body font-600 uppercase tracking-widest mb-1.5"
          style={{ color: 'var(--forge-text-dim)' }}>Biografia / Apresentação</label>
        <textarea
          className="forge-input resize-none"
          rows={3}
          placeholder="Ex: Personal com 8 anos de experiência, especializado em hipertrofia..."
          value={form.bio}
          onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-xs font-body font-600 uppercase tracking-widest mb-2"
          style={{ color: 'var(--forge-text-dim)' }}>Especialidades</label>
        <div className="flex flex-wrap gap-2">
          {SPEC_OPTIONS.map(s => {
            const sel = form.specialties.includes(s)
            return (
              <button key={s} onClick={() => toggleSpec(s)}
                className="px-3 py-1.5 rounded-full text-xs font-body font-600 transition-all"
                style={{
                  background: sel ? 'var(--forge-accent)' : 'var(--forge-surface)',
                  color: sel ? '#fff' : 'var(--forge-text-dim)',
                  border: `1px solid ${sel ? 'var(--forge-accent)' : 'var(--forge-border)'}`,
                }}>
                {s}
              </button>
            )
          })}
        </div>
      </div>

      <button onClick={handleSave} className="forge-btn-accent" disabled={!form.name.trim()}>
        Salvar Personal
      </button>
    </div>
  )
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function Overview({ data, onEdit, onRemove }) {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Trainer card */}
      <div className="forge-card p-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(130,10,209,0.15)', border: '1.5px solid rgba(130,10,209,0.3)' }}>
            <span className="font-display font-black text-2xl" style={{ color: 'var(--forge-accent)' }}>
              {data.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-black text-xl uppercase tracking-wide" style={{ color: 'var(--forge-text)' }}>
              {data.name}
            </p>
            {data.bio && (
              <p className="text-xs font-body mt-1 leading-relaxed" style={{ color: 'var(--forge-text-dim)' }}>
                {data.bio}
              </p>
            )}
          </div>
        </div>

        {data.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {data.specialties.map(s => (
              <span key={s} className="text-xs font-body font-600 px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(130,10,209,0.12)', color: 'var(--forge-accent)', border: '1px solid rgba(130,10,209,0.25)' }}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Contact */}
      <div className="forge-card p-4 space-y-3">
        <p className="text-xs font-body font-600 uppercase tracking-widest" style={{ color: 'var(--forge-text-dim)' }}>
          Contato
        </p>
        {[
          { icon: '📱', label: 'WhatsApp', value: data.phone, href: data.phone ? `https://wa.me/${data.phone.replace(/\D/g,'')}` : null },
          { icon: '📷', label: 'Instagram', value: data.instagram, href: data.instagram ? `https://instagram.com/${data.instagram.replace('@','')}` : null },
          { icon: '✉️', label: 'Email', value: data.email, href: data.email ? `mailto:${data.email}` : null },
        ].filter(c => c.value).map(c => (
          <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl transition-all"
            style={{ background: 'var(--forge-surface)', border: '1px solid var(--forge-border)' }}>
            <span className="text-xl">{c.icon}</span>
            <div>
              <p className="text-xs font-body" style={{ color: 'var(--forge-muted)' }}>{c.label}</p>
              <p className="text-sm font-body font-600" style={{ color: 'var(--forge-accent)' }}>{c.value}</p>
            </div>
            <svg className="ml-auto" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--forge-muted)" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
          </a>
        ))}
        {!data.phone && !data.instagram && !data.email && (
          <p className="text-xs text-center py-2" style={{ color: 'var(--forge-muted)' }}>Nenhum contato cadastrado</p>
        )}
      </div>

      {/* Quick programs summary */}
      {data.programs?.length > 0 && (
        <div className="forge-card p-4">
          <p className="text-xs font-body font-600 uppercase tracking-widest mb-3" style={{ color: 'var(--forge-text-dim)' }}>
            Programas Ativos
          </p>
          {data.programs.slice(0, 2).map(prog => (
            <div key={prog.id} className="flex items-center gap-3 py-2 border-b last:border-0"
              style={{ borderColor: 'var(--forge-border)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(130,10,209,0.1)' }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--forge-accent)" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
              </div>
              <div>
                <p className="font-body font-600 text-sm" style={{ color: 'var(--forge-text)' }}>{prog.name}</p>
                {prog.startDate && (
                  <p className="text-xs font-body" style={{ color: 'var(--forge-muted)' }}>
                    Início: {prog.startDate}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={onEdit} className="forge-btn-ghost flex-1 flex items-center justify-center gap-2">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Editar
        </button>
        <button onClick={onRemove}
          className="forge-btn-ghost px-4"
          style={{ color: 'rgba(239,68,68,0.7)', borderColor: 'rgba(239,68,68,0.2)' }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
function Chat({ data, userId, onChange }) {
  const [msg, setMsg] = useState('')
  const bottomRef = useRef(null)
  const messages = data.messages || []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function send() {
    const text = msg.trim()
    if (!text) return
    const newMsg = addMessage(userId, { from: 'user', text })
    onChange()
    setMsg('')
  }

  function simulateReply() {
    const replies = [
      'Ótimo treino hoje! Continue assim 💪',
      'Lembre-se de descansar bem esta noite.',
      'Aumentaremos a carga na próxima semana.',
      'Sua evolução tem sido impressionante!',
      'Beba bastante água após o treino.',
    ]
    addMessage(userId, { from: 'trainer', text: replies[Math.floor(Math.random() * replies.length)] })
    onChange()
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-1 py-2 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-sm font-body" style={{ color: 'var(--forge-text-dim)' }}>
              Nenhuma mensagem ainda. Diga olá para {data.name.split(' ')[0]}!
            </p>
          </div>
        )}
        {messages.map(m => {
          const isUser = m.from === 'user'
          return (
            <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1"
                  style={{ background: 'rgba(130,10,209,0.2)' }}>
                  <span className="text-xs font-display font-bold" style={{ color: 'var(--forge-accent)' }}>
                    {data.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="max-w-[75%]">
                <div className="px-4 py-2.5 rounded-2xl text-sm font-body leading-relaxed"
                  style={{
                    background: isUser ? 'var(--forge-accent)' : 'var(--forge-card)',
                    color: isUser ? '#fff' : 'var(--forge-text)',
                    border: isUser ? 'none' : '1px solid var(--forge-border)',
                    borderBottomRightRadius: isUser ? 4 : 14,
                    borderBottomLeftRadius: !isUser ? 4 : 14,
                  }}>
                  {m.text}
                </div>
                <p className="text-xs mt-1 px-1" style={{ color: 'var(--forge-muted)', textAlign: isUser ? 'right' : 'left' }}>
                  {new Date(m.ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Simulate reply button (demo) */}
      <div className="text-center py-1">
        <button onClick={simulateReply}
          className="text-xs font-body px-3 py-1 rounded-full transition-all"
          style={{ color: 'var(--forge-muted)', border: '1px dashed var(--forge-border)' }}>
          Simular resposta do personal (demo)
        </button>
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'var(--forge-border)' }}>
        <input
          className="forge-input flex-1"
          style={{ padding: '10px 14px' }}
          placeholder="Mensagem..."
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
        />
        <button onClick={send} disabled={!msg.trim()}
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: msg.trim() ? 'var(--forge-accent)' : 'var(--forge-surface)',
            border: '1px solid var(--forge-border)',
          }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={msg.trim() ? '#fff' : 'var(--forge-muted)'} strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Assessments ──────────────────────────────────────────────────────────────
function Assessments({ data, userId, onChange }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), weight: '', bodyFat: '', notes: '' })
  const assessments = (data.assessments || []).slice().reverse()

  function save() {
    if (!form.weight && !form.notes) return
    addAssessment(userId, { date: form.date, weight: form.weight, bodyFat: form.bodyFat, notes: form.notes })
    onChange()
    setShowForm(false)
    setForm({ date: new Date().toISOString().slice(0,10), weight: '', bodyFat: '', notes: '' })
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-xs font-body font-600 uppercase tracking-widest" style={{ color: 'var(--forge-text-dim)' }}>
          {assessments.length} avaliações registradas
        </p>
        <button onClick={() => setShowForm(!showForm)}
          className="text-xs font-body font-600 px-3 py-1.5 rounded-lg transition-all"
          style={{ background: 'rgba(130,10,209,0.12)', color: 'var(--forge-accent)', border: '1px solid rgba(130,10,209,0.2)' }}>
          + Nova avaliação
        </button>
      </div>

      {showForm && (
        <div className="forge-card p-4 space-y-3 scale-in" style={{ borderColor: 'rgba(130,10,209,0.3)' }}>
          <p className="font-display font-bold text-base uppercase tracking-widest" style={{ color: 'var(--forge-accent)' }}>
            Nova Avaliação
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-body uppercase tracking-wider mb-1" style={{ color: 'var(--forge-text-dim)' }}>Data</label>
              <input type="date" className="forge-input text-sm py-2" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-body uppercase tracking-wider mb-1" style={{ color: 'var(--forge-text-dim)' }}>Peso (kg)</label>
              <input type="number" className="forge-input text-sm py-2 text-center" placeholder="75"
                value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-body uppercase tracking-wider mb-1" style={{ color: 'var(--forge-text-dim)' }}>% Gordura</label>
              <input type="number" className="forge-input text-sm py-2 text-center" placeholder="18"
                value={form.bodyFat} onChange={e => setForm(f => ({ ...f, bodyFat: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-body uppercase tracking-wider mb-1" style={{ color: 'var(--forge-text-dim)' }}>Observações do personal</label>
            <textarea className="forge-input resize-none text-sm" rows={2}
              placeholder="Evolução percebida, metas, pontos de melhoria..."
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="forge-btn-accent py-2.5 text-sm">Salvar</button>
            <button onClick={() => setShowForm(false)} className="forge-btn-ghost px-4">Cancelar</button>
          </div>
        </div>
      )}

      {assessments.length === 0 && !showForm && (
        <div className="forge-card p-8 text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-sm font-body" style={{ color: 'var(--forge-text-dim)' }}>
            Nenhuma avaliação registrada ainda.
          </p>
        </div>
      )}

      {assessments.map(a => (
        <div key={a.id} className="forge-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-display font-bold text-base uppercase tracking-wide" style={{ color: 'var(--forge-text)' }}>
              {new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-4 mb-3">
            {a.weight && (
              <div className="forge-card px-4 py-2 text-center flex-1" style={{ background: 'var(--forge-surface)' }}>
                <p className="font-display font-black text-xl" style={{ color: 'var(--forge-accent)' }}>{a.weight} kg</p>
                <p className="text-xs font-body" style={{ color: 'var(--forge-muted)' }}>Peso</p>
              </div>
            )}
            {a.bodyFat && (
              <div className="forge-card px-4 py-2 text-center flex-1" style={{ background: 'var(--forge-surface)' }}>
                <p className="font-display font-black text-xl" style={{ color: 'var(--forge-accent)' }}>{a.bodyFat}%</p>
                <p className="text-xs font-body" style={{ color: 'var(--forge-muted)' }}>Gordura</p>
              </div>
            )}
          </div>
          {a.notes && (
            <p className="text-sm font-body leading-relaxed" style={{ color: 'var(--forge-text-dim)' }}>
              "{a.notes}"
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Programs ────────────────────────────────────────────────────────────────
function Programs({ data, userId, onChange }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', description: '' })
  const programs = data.programs || []

  function save() {
    if (!form.name.trim()) return
    const updated = { ...data, programs: [...programs, { id: Date.now().toString(), ...form }] }
    savePersonalData(userId, updated)
    onChange()
    setShowForm(false)
    setForm({ name: '', startDate: '', endDate: '', description: '' })
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-xs font-body font-600 uppercase tracking-widest" style={{ color: 'var(--forge-text-dim)' }}>
          {programs.length} programa{programs.length !== 1 ? 's' : ''}
        </p>
        <button onClick={() => setShowForm(!showForm)}
          className="text-xs font-body font-600 px-3 py-1.5 rounded-lg transition-all"
          style={{ background: 'rgba(130,10,209,0.12)', color: 'var(--forge-accent)', border: '1px solid rgba(130,10,209,0.2)' }}>
          + Novo programa
        </button>
      </div>

      {showForm && (
        <div className="forge-card p-4 space-y-3 scale-in" style={{ borderColor: 'rgba(130,10,209,0.3)' }}>
          <p className="font-display font-bold text-base uppercase tracking-widest" style={{ color: 'var(--forge-accent)' }}>Novo Programa</p>
          <input className="forge-input" placeholder="Nome do programa" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-body uppercase tracking-wider mb-1" style={{ color: 'var(--forge-text-dim)' }}>Início</label>
              <input type="date" className="forge-input py-2 text-sm" value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-body uppercase tracking-wider mb-1" style={{ color: 'var(--forge-text-dim)' }}>Término</label>
              <input type="date" className="forge-input py-2 text-sm" value={form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <textarea className="forge-input resize-none text-sm" rows={2}
            placeholder="Descrição, objetivos, observações..."
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={save} className="forge-btn-accent py-2.5 text-sm">Salvar</button>
            <button onClick={() => setShowForm(false)} className="forge-btn-ghost px-4">Cancelar</button>
          </div>
        </div>
      )}

      {programs.length === 0 && !showForm && (
        <div className="forge-card p-8 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm font-body" style={{ color: 'var(--forge-text-dim)' }}>
            Nenhum programa cadastrado ainda.
          </p>
        </div>
      )}

      {programs.map(prog => (
        <div key={prog.id} className="forge-card p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'rgba(130,10,209,0.12)', border: '1px solid rgba(130,10,209,0.25)' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--forge-accent)" strokeWidth="1.8">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-lg uppercase tracking-wide" style={{ color: 'var(--forge-text)' }}>
                {prog.name}
              </p>
              {(prog.startDate || prog.endDate) && (
                <p className="text-xs font-body mt-0.5" style={{ color: 'var(--forge-muted)' }}>
                  {prog.startDate && `Início: ${new Date(prog.startDate+'T12:00').toLocaleDateString('pt-BR')}`}
                  {prog.startDate && prog.endDate && ' · '}
                  {prog.endDate && `Término: ${new Date(prog.endDate+'T12:00').toLocaleDateString('pt-BR')}`}
                </p>
              )}
              {prog.description && (
                <p className="text-sm font-body mt-2 leading-relaxed" style={{ color: 'var(--forge-text-dim)' }}>
                  {prog.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main View ────────────────────────────────────────────────────────────────
export default function PersonalView() {
  const { user } = useApp()
  const [data, setData] = useState(() => getPersonalData(user.id))
  const [subtab, setSubtab] = useState('overview')
  const [editing, setEditing] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)

  function refresh() { setData(getPersonalData(user.id)) }

  function handleSaveTrainer(formData) {
    savePersonalData(user.id, formData)
    setData(getPersonalData(user.id))
    setEditing(false)
  }

  function handleRemove() {
    savePersonalData(user.id, null)
    setData(null)
    setConfirmRemove(false)
  }

  if (!data || editing) {
    return editing
      ? <SetupForm onSave={handleSaveTrainer} onCancel={() => setEditing(false)} />
      : <div className="px-4 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="font-display font-black text-3xl uppercase tracking-wide" style={{ color: 'var(--forge-text)' }}>
              Personal
            </h1>
          </div>
          <NoTrainer onSetup={() => setEditing(true)} />
        </div>
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <h1 className="font-display font-black text-3xl uppercase tracking-wide" style={{ color: 'var(--forge-text)' }}>
          Personal
        </h1>
        <p className="text-sm font-body mt-0.5" style={{ color: 'var(--forge-text-dim)' }}>
          Seu acompanhamento com <span style={{ color: 'var(--forge-accent)', fontWeight: 600 }}>{data.name.split(' ')[0]}</span>
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--forge-surface)', border: '1px solid var(--forge-border)' }}>
          {SUBTABS.map(st => (
            <button key={st.id} onClick={() => setSubtab(st.id)}
              className="flex-1 py-2 rounded-lg text-xs font-body font-600 transition-all"
              style={{
                background: subtab === st.id ? 'var(--forge-card)' : 'transparent',
                color: subtab === st.id ? 'var(--forge-accent)' : 'var(--forge-muted)',
                border: subtab === st.id ? '1px solid var(--forge-border)' : '1px solid transparent',
              }}>
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {subtab === 'overview' && (
          <>
            {confirmRemove ? (
              <div className="forge-card p-4 scale-in mb-4" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
                <p className="font-body font-600 text-sm text-center mb-3" style={{ color: 'var(--forge-text)' }}>
                  Remover {data.name}? Todos os dados serão perdidos.
                </p>
                <div className="flex gap-2">
                  <button onClick={handleRemove}
                    className="flex-1 py-2.5 rounded-xl text-sm font-body font-600"
                    style={{ background: 'rgba(239,68,68,0.15)', color: 'rgb(239,68,68)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    Confirmar remoção
                  </button>
                  <button onClick={() => setConfirmRemove(false)} className="forge-btn-ghost px-4">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : null}
            <Overview
              data={data}
              onEdit={() => setEditing(true)}
              onRemove={() => setConfirmRemove(true)}
            />
          </>
        )}
        {subtab === 'chat' && <Chat data={data} userId={user.id} onChange={refresh} />}
        {subtab === 'assessments' && <Assessments data={data} userId={user.id} onChange={refresh} />}
        {subtab === 'programs' && <Programs data={data} userId={user.id} onChange={refresh} />}
      </div>
    </div>
  )
}
