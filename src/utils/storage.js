// ─── Storage Keys ───────────────────────────────────────────────────────────
const KEYS = {
  USERS: 'forge_users',
  SESSION: 'forge_session',
  ROUTINES: 'forge_routines',
  WORKOUT_LOGS: 'forge_logs',
  ACTIVE_WORKOUT: 'forge_active',
  PRS: 'forge_prs',
}

// ─── Seed default admin + demo user ─────────────────────────────────────────
const DEFAULT_USERS = [
  { id: 'admin', name: 'Admin', email: 'admin@forge.app', password: 'forge2024', role: 'admin' },
  { id: 'u1', name: 'Alex Silva', email: 'alex@forge.app', password: '123456', role: 'user' },
]

function seed() {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS))
  }
  if (!localStorage.getItem(KEYS.PRS)) {
    localStorage.setItem(KEYS.PRS, JSON.stringify({
      'Supino Reto': '',
      'Agachamento': '',
      'Levantamento Terra': '',
      'Desenvolvimento': '',
      'Remada Curvada': '',
    }))
  }
}

// ─── Users ───────────────────────────────────────────────────────────────────
export function getUsers() { seed(); return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]') }
export function saveUsers(users) { localStorage.setItem(KEYS.USERS, JSON.stringify(users)) }
export function createUser({ name, email, password }) {
  const users = getUsers()
  if (users.find(u => u.email === email)) return { error: 'Email já cadastrado.' }
  const user = { id: Date.now().toString(), name, email, password, role: 'user' }
  users.push(user)
  saveUsers(users)
  return { user }
}
export function authenticate(email, password) {
  const users = getUsers()
  return users.find(u => u.email === email && u.password === password) || null
}

// ─── Session ─────────────────────────────────────────────────────────────────
export function getSession() { return JSON.parse(localStorage.getItem(KEYS.SESSION) || 'null') }
export function setSession(user) { localStorage.setItem(KEYS.SESSION, JSON.stringify(user)) }
export function clearSession() { localStorage.removeItem(KEYS.SESSION) }

// ─── Routines ────────────────────────────────────────────────────────────────
// Structure: { [userId]: { [dayIndex 0-6]: { name: '', exercises: [{id,name,sets,reps,notes}] } } }
export function getRoutines(userId) {
  const all = JSON.parse(localStorage.getItem(KEYS.ROUTINES) || '{}')
  return all[userId] || {}
}
export function saveRoutines(userId, routines) {
  const all = JSON.parse(localStorage.getItem(KEYS.ROUTINES) || '{}')
  all[userId] = routines
  localStorage.setItem(KEYS.ROUTINES, JSON.stringify(all))
}

// ─── Workout Logs ─────────────────────────────────────────────────────────────
// Structure: { [userId]: [ { date: 'YYYY-MM-DD', dayIndex, name, duration, exercises:[{name,sets:[{reps,weight,done}]}] } ] }
export function getLogs(userId) {
  const all = JSON.parse(localStorage.getItem(KEYS.WORKOUT_LOGS) || '{}')
  return all[userId] || []
}
export function saveLog(userId, log) {
  const all = JSON.parse(localStorage.getItem(KEYS.WORKOUT_LOGS) || '{}')
  if (!all[userId]) all[userId] = []
  all[userId].push(log)
  localStorage.setItem(KEYS.WORKOUT_LOGS, JSON.stringify(all))
}
export function getTrainedDates(userId) {
  return getLogs(userId).map(l => l.date)
}

// ─── Active Workout ───────────────────────────────────────────────────────────
export function getActiveWorkout() { return JSON.parse(localStorage.getItem(KEYS.ACTIVE_WORKOUT) || 'null') }
export function saveActiveWorkout(w) { localStorage.setItem(KEYS.ACTIVE_WORKOUT, JSON.stringify(w)) }
export function clearActiveWorkout() { localStorage.removeItem(KEYS.ACTIVE_WORKOUT) }

// ─── PRs ─────────────────────────────────────────────────────────────────────
export function getPRs() { seed(); return JSON.parse(localStorage.getItem(KEYS.PRS) || '{}') }
export function savePRs(prs) { localStorage.setItem(KEYS.PRS, JSON.stringify(prs)) }

// ─── Personal Trainer ─────────────────────────────────────────────────────────
// Structure per user: { name, bio, phone, instagram, email, photo, specialties:[],
//   messages:[{id,from,text,ts}], assessments:[{id,date,weight,bodyFat,notes}],
//   programs:[{id,name,startDate,endDate,description}] }
const PT_KEY = 'forge_personal'

export function getPersonalData(userId) {
  const all = JSON.parse(localStorage.getItem(PT_KEY) || '{}')
  return all[userId] || null
}

export function savePersonalData(userId, data) {
  const all = JSON.parse(localStorage.getItem(PT_KEY) || '{}')
  all[userId] = data
  localStorage.setItem(PT_KEY, JSON.stringify(all))
}

export function addMessage(userId, { from, text }) {
  const all = JSON.parse(localStorage.getItem(PT_KEY) || '{}')
  if (!all[userId]) return
  const msg = { id: Date.now().toString(), from, text, ts: new Date().toISOString() }
  all[userId].messages = [...(all[userId].messages || []), msg]
  localStorage.setItem(PT_KEY, JSON.stringify(all))
  return msg
}

export function addAssessment(userId, assessment) {
  const all = JSON.parse(localStorage.getItem(PT_KEY) || '{}')
  if (!all[userId]) return
  const entry = { id: Date.now().toString(), ...assessment }
  all[userId].assessments = [...(all[userId].assessments || []), entry]
  localStorage.setItem(PT_KEY, JSON.stringify(all))
  return entry
}
