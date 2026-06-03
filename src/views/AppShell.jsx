import React from 'react'
import { useApp } from '../context/AppContext'
import HomeView from './HomeView'
import RoutineView from './RoutineView'
import ActiveWorkoutView from './ActiveWorkoutView'
import PersonalView from './PersonalView'
import ProfileView from './ProfileView'

const NAV_ITEMS = [
  {
    id: 'home', label: 'Home',
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    id: 'routine', label: 'Rotina',
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="8" y1="14" x2="16" y2="14"/>
        <line x1="8" y1="18" x2="12" y2="18"/>
      </svg>
    )
  },
  {
    id: 'workout', label: 'Treinar',
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
        <path d="M18 8h1a4 4 0 010 8h-1"/>
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    )
  },
  {
    id: 'personal', label: 'Personal',
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    )
  },
  {
    id: 'profile', label: 'Perfil',
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  },
]

export default function AppShell() {
  const { tab, navigate, activeWorkout } = useApp()

  const renderView = () => {
    if (tab === 'workout') return <ActiveWorkoutView />
    if (tab === 'routine')  return <RoutineView />
    if (tab === 'personal') return <PersonalView />
    if (tab === 'profile')  return <ProfileView />
    return <HomeView />
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--forge-bg)' }}>
      {/* Main content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="animate-fade-in" key={tab}>
          {renderView()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav style={{
        background: 'var(--forge-surface)',
        borderTop: '1px solid var(--forge-border)',
        flexShrink: 0,
      }}>
        <div className="flex items-center justify-around px-1 pt-2 pb-3">
          {NAV_ITEMS.map(item => {
            const isActive = tab === item.id
            const hasActiveWorkout = item.id === 'workout' && activeWorkout
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="bottom-nav-item relative"
                style={{ color: isActive ? 'var(--forge-accent)' : 'var(--forge-muted)' }}
              >
                {/* Top active bar */}
                {isActive && (
                  <span
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                    style={{ background: 'var(--forge-accent)', boxShadow: '0 0 8px rgba(var(--forge-neon-rgb),0.6)' }}
                  />
                )}
                {/* Live workout dot */}
                {hasActiveWorkout && !isActive && (
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse"
                    style={{ background: 'var(--forge-accent)' }}
                  />
                )}
                <div style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.15s' }}>
                  {item.icon(isActive)}
                </div>
                <span style={{
                  fontSize: 10, fontFamily: 'Barlow, sans-serif', fontWeight: 500,
                  letterSpacing: '0.03em',
                  color: isActive ? 'var(--forge-accent)' : 'var(--forge-muted)',
                }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
