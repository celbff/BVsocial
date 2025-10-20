// src/lib/config.ts
export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME,
    url: import.meta.env.VITE_APP_URL,
    env: import.meta.env.VITE_APP_ENV,
    version: import.meta.env.VITE_APP_VERSION,
  },
  
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonkey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  
  storage: {
    bucket: import.meta.env.VITE_STORAGE_BUCKET || 'posts-media',
    url: import.meta.env.VITE_STORAGE_URL,
    maxFileSize: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880,
    maxAvatarSize: Number(import.meta.env.VITE_MAX_AVATAR_SIZE),
    maxPostImages: Number(import.meta.env.VITE_MAX_POST_IMAGES),
    allowedTypes: import.meta.env.VITE_ALLOWED_FILE_TYPES.split(','),
    compressionQuality: Number(import.meta.env.VITE_IMAGE_COMPRESSION_QUALITY),
  },

  pagination: {
    postsPerPage: Number(import.meta.env.VITE_POSTS_PER_PAGE),
    commentsPerPage: Number(import.meta.env.VITE_COMMENTS_PER_PAGE),
    notificationsPerPage: Number(import.meta.env.VITE_NOTIFICATIONS_PER_PAGE),
  },

  features: {
    stories: import.meta.env.VITE_ENABLE_STORIES === 'true',
    reduxDevTools: import.meta.env.VITE_ENABLE_REDUX_DEVTOOLS === 'true',
    apiLogging: import.meta.env.VITE_ENABLE_API_LOGGING === 'true',
    showErrorDetails: import.meta.env.VITE_SHOW_ERROR_DETAILS === 'true',
  }
}
