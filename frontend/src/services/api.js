import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
})

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

// ─── Resume ─────────────────────────────────────────────────────────────────
export const resumeAPI = {
  upload: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/resume/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ─── Analysis ───────────────────────────────────────────────────────────────
export const analysisAPI = {
  analyze: (data) => api.post('/analysis/analyze', data),
  history: () => api.get('/analysis/history'),
  get: (id) => api.get(`/analysis/${id}`),
  delete: (id) => api.delete(`/analysis/${id}`),
  rewrite: (data) => api.post('/analysis/rewrite', data),
  skillsGap: (data) => api.post('/analysis/skills-gap', data),
  report: (id) => api.post(`/analysis/${id}/report`, {}, { responseType: 'blob' }),
}

// ─── User ────────────────────────────────────────────────────────────────────
export const userAPI = {
  profile: () => api.get('/user/profile'),
}

export default api
