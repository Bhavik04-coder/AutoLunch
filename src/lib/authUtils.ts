// Frontend-only auth utilities — no backend logic

const TOKEN_KEY = 'auth-token';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export const tokenStorage = {
  get(): string | null {
    if (typeof document === 'undefined') return null;
    return (
      document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${TOKEN_KEY}=`))
        ?.split('=')[1] ?? null
    );
  },

  set(token: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  },

  clear(): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  },

  isPresent(): boolean {
    return !!tokenStorage.get();
  },
};

/** Decode a base64 JWT-like token (mock only — not for production JWTs) */
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

/** Check if the user is authenticated (cookie present) */
export function isAuthenticated(): boolean {
  return tokenStorage.isPresent();
}

/** Redirect path after login */
export const POST_LOGIN_REDIRECT = '/launches';
export const LOGIN_PATH = '/auth/login';
