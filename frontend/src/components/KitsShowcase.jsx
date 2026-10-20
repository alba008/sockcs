import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./KitsShowcase.css"

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000"

function normalizeResults(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.results)) {
    return data.results
  }

  return []
}

function getMediaUrl(value) {
  if (!value) {
    return ""
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value
  }

  return `${API}${value.startsWith("/") ? "" : "/"}${value}`
}

function getProductImage(product) {
  return getMediaUrl(
    product.image_url ||
    product.image ||
    product.thumbnail ||
    product.primary_image
  )
}

function getHoverImage(product) {
  return getMediaUrl(
    product.image_hover_url ||
    product.image_hover ||
    product.gallery?.[0]?.image_url ||
    product.gallery?.[0]?.image
  )
}

function formatPrice(price) {
  const number = Number(price)

  if (Number.isNaN(number)) {
    return "$0"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits:
      Number.isInteger(number) ? 0 : 2,
  }).format(number)
}

function getProductBadge(product, index) {
  if (product.is_bestseller) {
    return "Bestseller"
  }

  if (product.is_new) {
    return "New"
  }

  if (product.is_featured) {
    return "Featured"
  }

  return index === 0 ? "City Favorite" : "The Uniform"
}

export default function KitsShowcase() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [addedId, setAddedId] = useState(null)

  const sliderRef = useRef(null)
  const addedTimerRef = useRef(null)

  const { addToCart } = useCart()

  useEffect(() => {
    const controller = new AbortController()

    async function loadKits() {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `${API}/api/products/?category=kit`,
          {
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error(
            `Kits request failed: ${response.status}`
          )
        }

        const data = await response.json()
        const results = normalizeResults(data)

        setProducts(results)
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          console.error(
            "Unable to load kits:",
            requestError
          )

          setError(
            "The kits could not be loaded right now."
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadKits()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) {
        window.clearTimeout(addedTimerRef.current)
      }
    }
  }, [])

  function scrollSlider(direction) {
    const slider = sliderRef.current

    if (!slider) {
      return
    }

    const firstCard = slider.querySelector(
      ".kits-showcase__card"
    )

    const distance = firstCard
      ? firstCard.getBoundingClientRect().width + 16
      : slider.clientWidth * 0.85

    slider.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    })
  }

  function handleAddToCart(product) {
    if (!product || product.stock === 0) {
      return
    }

    addToCart(product)
    setAddedId(product.id)

    if (addedTimerRef.current) {
      window.clearTimeout(addedTimerRef.current)
    }

    addedTimerRef.current = window.setTimeout(() => {
      setAddedId(null)
    }, 1400)
  }

  return (
    <section
      id="kits"
      className="kits-showcase"
      aria-labelledby="kits-showcase-title"
    >
      <div className="kits-showcase__inner">
        <header className="kits-showcase__header">
          <div>
            <p className="kits-showcase__eyebrow">
              Drop 01 · The Uniform
            </p>

            <h2 id="kits-showcase-title">
              The Kits
            </h2>

            <p className="kits-showcase__intro">
              One tee, one bottom, one pair. No styling
              needed. A complete city uniform, built to
              move together.
            </p>
          </div>

          <div className="kits-showcase__header-actions">
            <div
              className="kits-showcase__arrows"
              aria-label="Kit slider controls"
            >
              <button
                type="button"
                onClick={() => scrollSlider(-1)}
                aria-label="Show previous kit"
              >
                ←
              </button>

              <button
                type="button"
                onClick={() => scrollSlider(1)}
                aria-label="Show next kit"
              >
                →
              </button>
            </div>

            <Link
              to="/shop?category=kit"
              className="kits-showcase__view-all"
            >
              Shop all
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </header>

        {loading && (
          <div
            className="kits-showcase__track"
            aria-label="Loading featured kits"
          >
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="kits-showcase__card kits-showcase__card--loading"
              >
                <div className="kits-showcase__skeleton-image" />

                <div className="kits-showcase__skeleton-line" />

                <div className="kits-showcase__skeleton-line kits-showcase__skeleton-line--short" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div
            className="kits-showcase__message"
            role="status"
          >
            <span>Drop temporarily unavailable</span>

            <p>{error}</p>

            <Link to="/shop">
              Visit the complete shop
            </Link>
          </div>
        )}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div
              className="kits-showcase__message"
              role="status"
            >
              <span>Drop coming soon</span>

              <p>
                The next Nueva York uniform is being
                prepared.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          products.length > 0 && (
            <div
              ref={sliderRef}
              className="kits-showcase__track"
            >
              {products.map((product, index) => {
                const imageUrl =
                  getProductImage(product)

                const hoverImageUrl =
                  getHoverImage(product)

                const wasAdded =
                  addedId === product.id

                const soldOut =
                  Number(product.stock) <= 0

                return (
                  <article
                    key={product.id}
                    className="kits-showcase__card"
                  >
                    <Link
                      to="/shop"
                      className="kits-showcase__media"
                      aria-label={`View ${product.name}`}
                    >
                      {imageUrl ? (
                        <>
                          <img
                            className="kits-showcase__primary-image"
                            src={imageUrl}
                            alt={product.name}
                            loading="lazy"
                          />

                          {hoverImageUrl &&
                            hoverImageUrl !== imageUrl && (
                              <img
                                className="kits-showcase__hover-image"
                                src={hoverImageUrl}
                                alt=""
                                loading="lazy"
                                aria-hidden="true"
                              />
                            )}
                        </>
                      ) : (
                        <div className="kits-showcase__no-image">
                          <span>SOCKCS</span>

                          <small>
                            Image coming soon
                          </small>
                        </div>
                      )}

                      <span className="kits-showcase__badge">
                        {soldOut
                          ? "Sold out"
                          : getProductBadge(
                              product,
                              index
                            )}
                      </span>

                      <span className="kits-showcase__look-number">
                        Look{" "}
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span className="kits-showcase__quick-view">
                        View fit ↗
                      </span>
                    </Link>

                    <div className="kits-showcase__product-info">
                      <div className="kits-showcase__product-copy">
                        <h3>{product.name}</h3>

                        <p>
                          {product.description ||
                            product.materials ||
                            product.category_display ||
                            "Tee · Jorts · Signature socks"}
                        </p>
                      </div>

                      <div className="kits-showcase__buy">
                        <span className="kits-showcase__price">
                          {formatPrice(product.price)}
                        </span>

                        <button
                          type="button"
                          className={`kits-showcase__add ${
                            wasAdded
                              ? "kits-showcase__add--confirmed"
                              : ""
                          }`}
                          onClick={() =>
                            handleAddToCart(product)
                          }
                          disabled={wasAdded || soldOut}
                          aria-label={
                            soldOut
                              ? `${product.name} is sold out`
                              : `Add ${product.name} to cart`
                          }
                        >
                          {soldOut
                            ? "Sold out"
                            : wasAdded
                              ? "Added ✓"
                              : "Add +"}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

        {products.length > 1 && (
          <div className="kits-showcase__mobile-hint">
            <span>Swipe to explore</span>
            <span aria-hidden="true">→</span>
          </div>
        )}
      </div>
    </section>
  )
}