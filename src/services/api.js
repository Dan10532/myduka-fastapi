import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000'

const api = axios.create({ baseURL: BASE_URL })

// ✅ REQUEST INTERCEPTOR (attach token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log("TOKEN:", token)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    console.warn("NO TOKEN FOUND ❌")
  }

  return config
})


// 🔥 ADD THIS HERE 👇 (RESPONSE INTERCEPTOR)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("TOKEN EXPIRED → LOGGING OUT")

      localStorage.removeItem('token')

      // Redirect to login page
      window.location.href = "/login"
    }

    return Promise.reject(error)
  }
)


// Auth
export const loginUser = (data) => api.post('/login', data)
export const registerUser = (data) => api.post('/register', data)

// Products
export const getProducts = () => api.get('/products')
export const createProduct = (data) => api.post('/products', data)

// Purchases
export const getPurchases = () => api.get('/purchases')
export const createPurchase = (data) => api.post('/purchases', data)
export const updatePurchase = (id, data) => api.put(`/purchases/${id}`, data)
export const deletePurchase = (id) => api.delete(`/purchases/${id}`)

// Sales
export const getSales = () => api.get('/sales')
export const createSale = (data) => api.post('/sales', data)
export const updateSale = (id, data) => api.put(`/sales/${id}`, data)
export const deleteSale = (id) => api.delete(`/sales/${id}`)

// Dashboard
export const getDashboardData = () => api.get('/dashboard/spp')

export default api