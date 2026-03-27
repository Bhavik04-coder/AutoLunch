// Centralised API endpoint definitions
// All paths are relative — prefix with backendUrl via apiUrl() from LayoutContext

export const ENDPOINTS = {
  // Auth
  auth: {
    login:    '/auth/login',
    register: '/auth/register',
    me:       '/auth/me',
    logout:   '/auth/logout',
    refresh:  '/auth/refresh',
  },

  // Posts
  posts: {
    list:     '/posts',
    create:   '/posts',
    byId:     (id: string) => `/posts/${id}`,
    update:   (id: string) => `/posts/${id}`,
    delete:   (id: string) => `/posts/${id}`,
    schedule: (id: string) => `/posts/${id}/schedule`,
    publish:  (id: string) => `/posts/${id}/publish`,
  },

  // Integrations / connected accounts
  integrations: {
    list:       '/integrations',
    connect:    (provider: string) => `/integrations/${provider}/connect`,
    disconnect: (provider: string) => `/integrations/${provider}/disconnect`,
    status:     (provider: string) => `/integrations/${provider}/status`,
  },

  // Media
  media: {
    list:   '/media',
    upload: '/media/upload',
    delete: (id: string) => `/media/${id}`,
  },

  // Analytics
  analytics: {
    overview: '/analytics/overview',
    posts:    '/analytics/posts',
    audience: '/analytics/audience',
  },

  // User / org
  user: {
    update:             '/user/profile',
    switchOrganization: '/user/switch-organization',
  },
} as const;
