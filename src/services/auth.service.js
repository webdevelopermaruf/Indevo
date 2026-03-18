// services/auth.service.js
import api from './api'

export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/registration', data)