import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import LoginView from './views/LoginView'
import AppShell from './views/AppShell'
import AdminView from './views/AdminView'

function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center" style={{ background: 'var(--forge-bg)' }}>
      <div className="flex flex-col items-center gap-5 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--forge-accent)', boxShadow: '0 0 32px rgba(130,10,209,0.5)' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M6 4L10 12H14L18 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 12H20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M8 12L10 20H14L16 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="w-8 h-0.5 rounded-full animate-pulse-neon"
          style={{ background: 'var(--forge-accent)' }} />
      </div>
    </div>
  )
}

function Router() {
  const { route, loading } = useApp()
  if (loading)          return <LoadingScreen />
  if (route === 'login') return <LoginView />
  if (route === 'admin') return <AdminView />
  return <AppShell />
}

export default function App() {
  return (
    <AppProvider>
      <div className="noise-bg" style={{ height: '100%' }}>
        <Router />
      </div>
    </AppProvider>
  )
}
