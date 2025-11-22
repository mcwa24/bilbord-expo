'use client'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'bilbord2024!'
const ADMIN_SESSION_KEY = 'bilbord_expo_admin_session'

export function isAdmin(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true'
}

export function setAdminSession(value: boolean) {
  if (typeof window === 'undefined') return
  if (value) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true')
  } else {
    localStorage.removeItem(ADMIN_SESSION_KEY)
  }
}

export function loginAdmin(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    setAdminSession(true)
    return true
  }
  return false
}

export function logoutAdmin() {
  setAdminSession(false)
}

