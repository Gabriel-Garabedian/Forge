import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { authenticate } from '../utils/storage'

export default function LoginView() {
  const { login } = useApp()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const user = authenticate(email.trim().toLowerCase(), password)
      if (user) {
        login(user)
      } else {
        setError('Credenciais inválidas. Contate o administrador.')
        setLoading(false)
      }
    }, 700)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden relative"
      style={{ background: 'var(--forge-bg)' }}>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--forge-accent), transparent)', opacity: 0.7 }} />

      {/* Glow orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(130,10,209,0.08) 0%, transparent 70%)', transform: 'translateX(-50%)' }} />

      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10 animate-fade-in">

        {/* Logo */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-13 h-13 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--forge-accent)', boxShadow: '0 0 28px rgba(130,10,209,0.45)', width: 52, height: 52 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M6 4L10 12H14L18 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 12H20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M8 12L10 20H14L16 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-black text-5xl uppercase tracking-[0.08em]"
              style={{ color: 'var(--forge-text)' }}>
              FORGE
            </span>
          </div>
          <p className="text-xs font-body tracking-[0.3em] uppercase"
            style={{ color: 'var(--forge-muted)' }}>
            Premium Gym Tracker
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 animate-slide-up">
          <div className="space-y-1.5">
            <label className="block text-xs font-body font-600 uppercase tracking-widest"
              style={{ color: 'var(--forge-text-dim)' }}>Email</label>
            <input
              type="email"
              className="forge-input"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-body font-600 uppercase tracking-widest"
              style={{ color: 'var(--forge-text-dim)' }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                className="forge-input"
                style={{ paddingRight: 48 }}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: 14, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--forge-muted)',
                }}
              >
                {showPass ? (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="scale-in rounded-xl px-4 py-3 text-sm font-body"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'rgb(239,68,68)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="forge-btn-accent mt-4 flex items-center justify-center gap-3"
            style={{ opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Entrando...
              </>
            ) : (
              <>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                </svg>
                Entrar no Forge
              </>
            )}
          </button>
        </form>
      </div>

      <div className="pb-8 text-center relative z-10">
        <p className="text-xs font-body tracking-widest uppercase" style={{ color: 'rgba(130,10,209,0.25)' }}>
          Acesso exclusivo · Credenciais fornecidas pelo admin
        </p>
      </div>
    </div>
  )
}
