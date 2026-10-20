import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./Cart.css"

function formatPrice(value) {
  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return "$0.00"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export default function Cart() {
  const {
    cart,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQty,
    total,
  } = useCart()

  const shipping = cart.length > 0 ? 8 : 0
  const finalTotal = Number(total) + shipping

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = "hidden"

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      window.removeEventListener(
        "keydown",
        handleKeyDown
      )
    }
  }, [isOpen, setIsOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="cart-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <button
        type="button"
        className="cart-overlay__backdrop"
        onClick={() => setIsOpen(false)}
        aria-label="Close shopping cart"
      />

      <aside className="cart-drawer">
        <header className="cart-drawer__header">
          <div>
            <span className="cart-drawer__eyebrow">
              Your city system
            </span>

            <h2 id="cart-title">
              Cart
              <span>({cart.length})</span>
            </h2>
          </div>

          <button
            type="button"
            className="cart-drawer__close"
            onClick={() => setIsOpen(false)}
            aria-label="Close shopping cart"
          >
            <span>Close</span>
            <strong aria-hidden="true">×</strong>
          </button>
        </header>

        <div className="cart-drawer__body">
          {cart.length === 0 ? (
            <div className="cart-drawer__empty">
              <span className="cart-drawer__empty-mark">
                00
              </span>

              <h3>Your city system is empty.</h3>

              <p>
                Start with the socks. Build the rest
                around them.
              </p>

              <Link
                to="/shop"
                onClick={() => setIsOpen(false)}
              >
                Explore the shop
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          ) : (
            <div className="cart-drawer__items">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="cart-item"
                >
                  <Link
                    to={`/products/${item.slug}`}
                    className="cart-item__image"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </Link>

                  <div className="cart-item__content">
                    <div className="cart-item__top">
                      <div>
                        <span className="cart-item__category">
                          {item.category_display ||
                            item.category}
                        </span>

                        <Link
                          to={`/products/${item.slug}`}
                          onClick={() =>
                            setIsOpen(false)
                          }
                        >
                          {item.name}
                        </Link>
                      </div>

                      <strong>
                        {formatPrice(
                          Number(item.price) *
                            Number(item.qty)
                        )}
                      </strong>
                    </div>

                    <div className="cart-item__bottom">
                      <div
                        className="cart-item__quantity"
                        aria-label={`Quantity for ${item.name}`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(
                              item.id,
                              item.qty - 1
                            )
                          }
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          −
                        </button>

                        <span>{item.qty}</span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQty(
                              item.id,
                              item.qty + 1
                            )
                          }
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <footer className="cart-drawer__footer">
            <div className="cart-drawer__totals">
              <div>
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div>
                <span>Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>

              <div className="cart-drawer__grand-total">
                <strong>Total</strong>
                <strong>
                  {formatPrice(finalTotal)}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className="cart-drawer__checkout"
              onClick={() =>
                alert(
                  "Checkout v2 — Stripe next step!"
                )
              }
            >
              <span>Checkout</span>
              <span>
                {formatPrice(finalTotal)} ↗
              </span>
            </button>

            <p className="cart-drawer__footer-note">
              Built line by line in Brooklyn, NY
            </p>
          </footer>
        )}
      </aside>
    </div>
  )
}