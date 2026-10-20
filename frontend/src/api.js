import axios from "axios"

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000"

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
})

export function fetchProducts(params = {}) {
  return api
    .get("/products/", { params })
    .then((response) => response.data)
}

export function fetchProductBySlug(slug) {
  return api
    .get(`/products/${slug}/`)
    .then((response) => response.data)
}

export function fetchSiteImages(location = "hero") {
  return api
    .get("/site-images/", {
      params: { location },
    })
    .then((response) => response.data)
}

export default api