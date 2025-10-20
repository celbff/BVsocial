const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_APP_NAME',
  'VITE_APP_URL',
  'VITE_STORAGE_BUCKET'
  ] as const

export function validateEnv() {
  const missing = requiredEnvVars.filter(key => !import.meta.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables> ${missing.join(',')} `)
  }
}
