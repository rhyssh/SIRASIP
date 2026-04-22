/**
 * Auth Mode Configuration
 *
 * File ini untuk mengatur mode autentikasi (development atau production)
 * Edit nilai MODE untuk switch antara dummy login dan real database login
 */

export const AUTH_MODE = {
  // Ganti "DUMMY" menjadi "PRODUCTION" untuk menggunakan database real
  // Saat ini menggunakan DUMMY LOGIN tanpa database verification
  MODE: "DUMMY" as "DUMMY" | "PRODUCTION",

  isDevelopment: () => AUTH_MODE.MODE === "DUMMY",
  isProduction: () => AUTH_MODE.MODE === "PRODUCTION",
} as const;

// Development Mode Features
export const DEV_CONFIG = {
  // Jika true, skip semua autentikasi checks
  skipAuthCheck: true,

  // Master password untuk quick testing
  masterPassword: "dev",

  // Log semua auth attempts
  logAuthAttempts: true,

  // Auto-login dengan dummy user (set null untuk disable)
  autoLoginUser: null, // bisa di-set ke "admin" atau "staff"
} as const;
