import React, { createContext, useContext, useState, useEffect } from 'react'
import { getSession, setSession, clearSession, getActiveWorkout } from '../utils/storage'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [route, setRoute]             = useState('login')
  const [tab, setTab]                 = useState('home')
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [theme, setTheme]             = useState(() => localStorage.getItem('forge_theme') || 'dark')

  // Apply theme class to root element
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') root.classList.add('theme-light')
    else root.classList.remove('theme-light')
    localStorage.setItem('forge_theme', theme)
  }, [theme])

  useEffect(() => {
    const session = getSession()
    if (session) {
      setUser(session)
      setRoute(session.role === 'admin' ? 'admin' : 'app')
    }
    const aw = getActiveWorkout()
    if (aw) setActiveWorkout(aw)
    setLoading(false)
  }, [])

  function login(u) {
    setSession(u)
    setUser(u)
    setRoute(u.role === 'admin' ? 'admin' : 'app')
  }

  function logout() {
    clearSession()
    setUser(null)
    setRoute('login')
    setTab('home')
  }

  function navigate(t) { setTab(t) }

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  return (
    <AppContext.Provider value={{
      user, route, tab, activeWorkout, loading, theme,
      login, logout, navigate, setTab,
      setActiveWorkout, setRoute, toggleTheme,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
