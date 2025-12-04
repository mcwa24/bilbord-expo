// Simple admin authentication using localStorage
// In production, you should use proper authentication (e.g., Supabase Auth)

const ADMIN_KEY = 'bilbord_admin_authenticated';

export function isAdmin(): boolean {
  if (typeof window === 'undefined') {
    return false; // Server-side: always false
  }
  return localStorage.getItem(ADMIN_KEY) === 'true';
}

export function loginAdmin(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(ADMIN_KEY, 'true');
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(ADMIN_KEY);
}

