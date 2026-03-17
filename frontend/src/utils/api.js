import axios from 'axios'

const rawBaseUrl = import.meta.env.VITE_API_URL

function normalizeApiBaseUrl(value) {
  if (!value) return '/api'
  const trimmed = value.replace(/\/+$/, '')
  if (trimmed.endsWith('/api')) return trimmed
  return `${trimmed}/api`
}

const API_BASE_URL = normalizeApiBaseUrl(rawBaseUrl)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api

