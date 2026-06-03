import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { createUser, getUsers, saveUsers } from '../utils/storage'

const ADMIN_PIN = 'forge2024'

export default function AdminView() {
  const { logout } = useApp()
  const [unlocked,  setUnlocked]  = useState(false)
  const [pin,       setPin]       = useState('')
  const [pinError,  setPinError]  = useState('')
  const [form,      setForm]      = useState({ name: '', email: '', password: '' })
  const [feedback,  setFeedback]  = useState(null)
  const [users,     setUsers]     = useState([])
  const [showUsers, setShowUsers] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (unlocked) setUsers(getUsers().filter(u => u.role !== 'admin'))
  }, [unlocked])

  function checkPin(e) {
    e.preventDefault()
    if (pin === ADMIN_PIN) { setUnlocked(true); setPinError('') }
    else { setPinError('PIN incorreto.'); setPin('') }
  }

  function handleCreate(e) {
    e.preventDefault()
    setFeedback(null)
    const result = createUser(form)
    if (result.error) { setFeedback({ type: 'error', msg: result.error }); return }
    setFeedback({ type: 'success', msg: `Conta criada para ${result.user.name}!` })
    setForm({ name: '', email: '', password: '' })
    setUsers(getUsers().filter(u => u.role !== 'admin'))
  }

  function deleteUser(id) {
    const updated = getUsers().filter(u => u.id !== id)
    saveUsers(updated)
    setUsers(updated.filter(u => u.role !== 'admin'))
    setDeletingId(null)
  }

  function resetPassword(id, newPass) {
    const updated = getUsers().map(u => u.id === id ? { ...u, password: newPass } : u)
    saveUsers(updated)
    setUsers(updated.filter(u => u.role !== 'admin'))
  }

  // ── PIN Gate ─────────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-8 relative"
        style={{ background: 'var(--forge-bg)' }}>

        <div className="absolute top-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg,transparent,var(--forge-accent),transparent)', opacity: 0.5 }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(130,10,209,0.07) 0%,transparent 70%)' }} />

        <div className="w-full max-w-xs space-y-8 relative z-10 animate-slide-up">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(130,10,209,0.1)', border: '1.5px solid rgba(130,10,209,0.25)' }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="var(--forge-accent)" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <h1 className="font-display font-black text-3xl uppercase tracking-widest" style={{ color: 'var(--forge-text)' }}>
              Admin
            </h1>
            <p className="text-sm font-body mt-1" style={{ color: 'var(--forge-muted)' }}>Painel restrito · Forge</p>
          </div>

          <form onSubmit={checkPin} className="space-y-4">
            <div>
              <label className="block text-xs font-body font-600 uppercase tracking-widest mb-2"
                style={{ color: 'var(--forge-text-dim)' }}>PIN de Acesso</label>
              <input
                type="password"
                className="forge-input text-center"
                style={{ letterSpacing: '0.4em', fontSize: 18 }}
                placeholder="••••••••"
                value={pin}
                onChange={e => setPin(e.target.value)}
                autoFocus
              />
              {pinError && (
                <p className="text-xs font-body mt-2 text-center" style={{ color: 'rgb(239,68,68)' }}>{pinError}</p>
              )}
            </div>
            <button type="submit" className="forge-btn-accent">Acessar Painel</button>
          </form>

          <button onClick={logout}
            className="w-full text-center text-xs font-body transition-colors"
            style={{ color: 'rgba(130,10,209,0.3)' }}>
            ← Voltar ao login
          </button>
        </div>
      </div>
    )
  }

  // ── Admin Panel ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen px-4 pt-6 pb-10" style={{ background: 'var(--forge-bg)' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-3xl uppercase tracking-wide" style={{ color: 'var(--forge-text)' }}>
            Admin
          </h1>
          <p className="text-sm font-body mt-0.5" style={{ color: 'var(--forge-muted)' }}>
            Gerenciamento de usuários
          </p>
        </div>
        <button onClick={logout} className="forge-btn-ghost text-xs px-3 py-2">Sair</button>
      </div>

      {/* Create user */}
      <div className="forge-card p-5 mb-6" style={{ borderColor: 'rgba(130,10,209,0.25)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(130,10,209,0.1)', border: '1px solid rgba(130,10,209,0.2)' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--forge-accent)" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <h2 className="font-display font-bold text-lg uppercase tracking-widest" style={{ color: 'var(--forge-text)' }}>
            Criar Conta de Aluno
          </h2>
        </div>

        <form onSubmit={handleCreate} className="space-y-3">
          {[
            { key: 'name',     label: 'Nome Completo', placeholder: 'João da Silva',   type: 'text' },
            { key: 'email',    label: 'Email',          placeholder: 'aluno@email.com', type: 'email' },
            { key: 'password', label: 'Senha',          placeholder: 'Senha de acesso', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-body font-600 uppercase tracking-widest mb-1.5"
                style={{ color: 'var(--forge-text-dim)' }}>{f.label}</label>
              <input
                type={f.type}
                className="forge-input"
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: f.key === 'email' ? e.target.value.toLowerCase() : e.target.value }))}
                required
                minLength={f.key === 'password' ? 4 : 1}
              />
            </div>
          ))}

          {feedback && (
            <div className="rounded-xl px-4 py-3 text-sm font-body scale-in"
              style={feedback.type === 'success'
                ? { background: 'rgba(130,10,209,0.1)', border: '1px solid rgba(130,10,209,0.3)', color: 'var(--forge-accent)' }
                : { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'rgb(239,68,68)' }
              }>
              {feedback.msg}
            </div>
          )}

          <button type="submit" className="forge-btn-accent mt-2 flex items-center justify-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            Criar Conta
          </button>
        </form>
      </div>

      {/* Users list */}
      <button onClick={() => setShowUsers(!showUsers)}
        className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-body font-600 uppercase tracking-widest" style={{ color: 'var(--forge-text-dim)' }}>
            Alunos Cadastrados
          </p>
          <span className="text-xs font-body font-600 px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(130,10,209,0.1)', color: 'var(--forge-accent)', border: '1px solid rgba(130,10,209,0.2)' }}>
            {users.length}
          </span>
        </div>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--forge-muted)" strokeWidth="2"
          style={{ transform: showUsers ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {showUsers && (
        <div className="space-y-2 animate-slide-up">
          {users.length === 0 ? (
            <div className="forge-card p-6 text-center text-sm font-body" style={{ color: 'var(--forge-muted)' }}>
              Nenhum aluno cadastrado ainda.
            </div>
          ) : users.map(u => (
            <UserRow
              key={u.id} user={u}
              isDeleting={deletingId === u.id}
              onDelete={() => setDeletingId(u.id)}
              onCancelDelete={() => setDeletingId(null)}
              onConfirmDelete={() => deleteUser(u.id)}
              onResetPassword={resetPassword}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function UserRow({ user, isDeleting, onDelete, onCancelDelete, onConfirmDelete, onResetPassword }) {
  const [editingPass, setEditingPass] = useState(false)
  const [newPass,     setNewPass]     = useState('')
  const [showPass,    setShowPass]    = useState(false)

  return (
    <div className="forge-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--forge-surface)', border: '1px solid var(--forge-border)' }}>
          <span className="font-display font-bold text-lg" style={{ color: 'var(--forge-accent)' }}>
            {user.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body font-600 text-sm truncate" style={{ color: 'var(--forge-text)' }}>{user.name}</p>
          <p className="text-xs font-body truncate" style={{ color: 'var(--forge-muted)' }}>{user.email}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => { setEditingPass(!editingPass); setNewPass('') }}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--forge-muted)' }}
            title="Alterar senha">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </button>
          <button onClick={onDelete}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--forge-muted)' }}
            title="Remover aluno">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Senha atual */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs font-body uppercase tracking-wider" style={{ color: 'rgba(130,10,209,0.4)' }}>Senha:</span>
        <span className="text-xs font-body font-600 tracking-widest" style={{ color: 'var(--forge-muted)' }}>
          {showPass ? user.password : '•'.repeat(Math.min(user.password?.length || 6, 8))}
        </span>
        <button onClick={() => setShowPass(!showPass)}
          className="transition-colors" style={{ color: 'rgba(130,10,209,0.3)' }}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            {showPass
              ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></>
              : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
            }
          </svg>
        </button>
      </div>

      {editingPass && (
        <div className="flex items-center gap-2 pt-2 border-t scale-in"
          style={{ borderColor: 'var(--forge-border)' }}>
          <input autoFocus type="text" className="forge-input py-2 text-sm flex-1"
            placeholder="Nova senha (mín. 4 chars)"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && newPass.trim().length >= 4) {
                onResetPassword(user.id, newPass.trim()); setEditingPass(false)
              }
            }}
          />
          <button
            onClick={() => { if (newPass.trim().length >= 4) { onResetPassword(user.id, newPass.trim()); setEditingPass(false) } }}
            disabled={newPass.trim().length < 4}
            className="text-xs font-body font-600 px-2 hover:underline disabled:opacity-30"
            style={{ color: 'var(--forge-accent)' }}>
            Salvar
          </button>
          <button onClick={() => setEditingPass(false)}
            className="text-xs font-body" style={{ color: 'var(--forge-muted)' }}>✕</button>
        </div>
      )}

      {isDeleting && (
        <div className="flex items-center gap-3 pt-2 border-t scale-in"
          style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
          <p className="text-xs font-body flex-1" style={{ color: 'rgba(239,68,68,0.8)' }}>
            Remover {user.name}?
          </p>
          <button onClick={onConfirmDelete}
            className="text-xs font-body font-600 hover:underline" style={{ color: 'rgb(239,68,68)' }}>
            Confirmar
          </button>
          <button onClick={onCancelDelete}
            className="text-xs font-body hover:underline" style={{ color: 'var(--forge-muted)' }}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
