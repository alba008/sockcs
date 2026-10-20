import { useEffect, useMemo, useState } from "react"
import { fetchProducts } from "../api"
import ProductCard from "./ProductCard"
import "./ProductGrid.css"

export default function ProductGrid({
  filter = {},
  excludeCategory = "",
  limit,
  mobileSlider = true,
}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const filterKey = JSON.stringify(filter)

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      try {
        setLoading(true)
        setError("")

        const data = await fetchProducts(filter)

        if (cancelled) return

        const results = Array.isArray(data)
          ? data
          : data?.results || []

        setProducts(results)
      } catch (requestError) {
        if (cancelled) return

        console.error(
          "Unable to load products:",
          requestError
        )

        setError(
          "The products could not be loaded right now."
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      cancelled = true
    }
  }, [filterKey])

  const displayedProducts = useMemo(() => {
    let results = [...products]

    if (excludeCategory) {
      results = results.filter(
        (product) =>
          product.category !== excludeCategory
      )
    }

    if (limit) {
      results = results.slice(0, limit)
    }

    return results
  }, [products, excludeCategory, limit])

  if (loading) {
    return (
      <div className="product-grid product-grid--loading">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="product-grid__skeleton"
          >
            <div className="product-grid__skeleton-image" />
            <div className="product-grid__skeleton-line" />
            <div className="product-grid__skeleton-line product-grid__skeleton-line--short" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="product-grid__message">
        <strong>City system unavailable</strong>
        <p>{error}</p>
      </div>
    )
  }

  if (!displayedProducts.length) {
    return (
      <div className="product-grid__message">
        <strong>More pieces are coming</strong>
        <p>
          The next individual pieces are being prepared.
        </p>
      </div>
    )
  }

  return (
    <>
      <div
        className={`product-grid ${
          mobileSlider
            ? "product-grid--mobile-slider"
            : ""
        }`}
      >
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {mobileSlider &&
        displayedProducts.length > 1 && (
          <div className="product-grid__swipe-hint">
            <span>Swipe through the pieces</span>
            <span aria-hidden="true">→</span>
          </div>
        )}
    </>
  )
}