// src/lib/config.ts
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonkey: import.metal.env.VITE_SUPABASE_ANON_KEY,
  },
  storage: {
    bucket: import.meta.env.VITE_STORAGE_BUCKET || 'posts-media',
    maxFileSize: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880,
  },
  app: {
    url: import.meta.env.VITE_APP_URL || window.location.origin,
    name: import.meta.env.VITE_APP_NAME || 'Bella Vitta Social',
  }
}
