// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // App
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
  readonly VITE_APP_VERSION: string

  // Supabase
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string

  // Storage
  readonly VITE_STORAGE_BUCKET: string
  readonly VITE_STORAGE_URL: string
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_ALLOWED_FILE_TYPES: string
  readonly VITE_MAX_AVATAR_SIZE: string
  readonly VITE_MAX_POST_IMAGES: string
  readonly VITE_IMAGE_COMPRESSION_QUALITY: string

  // Maps
  readonly VITE_DEFAULT_LATITUDE: string
  readonly VITE_DEFAULT_LONGITUDE: string
  readonly VITE_DEFAULT_CITY: string
  readonly VITE_DEFAULT_STATE: string

  // Pagination
  readonly VITE_POSTS_PER_PAGE: string
  readonly VITE_COMMENTS_PER_PAGE: string
  readonly VITE_NOTIFICATIONS_PER_PAGE: string

  // Cache
  readonly VITE_CACHE_TIME_POSTS: string
  readonly VITE_CACHE_TIME_USER: string
  readonly VITE_CACHE_TIME_NOTIFICATIONS: string

  // Features
  readonly VITE_ENABLE_STORIES: string
  readonly VITE_ENABLE_MESSAGES: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_ENABLE_MAPS: string
  readonly VITE_ENABLE_DARK_MODE: string

  // Security
  readonly VITE_SESSION_TIMEOUT: string
  readonly VITE_MAX_LOGIN_ATTEMPTS: string
  readonly VITE_PASSWORD_MIN_LENGHT: string

  // Analytics
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_HOTJAR_ID?: string

  // Debug
  readonly VITE_DEBUG_MODE: string
  readonly VITE_ENABLE_REDUX_DEVTOOLS: string
  readonly VITE_ENABLE_API_LOGGING: string
  readonly VITE_SHOW_ERROR_DETAILS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
