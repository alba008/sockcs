import { useEffect, useState } from "react"
import {
  Link,
  useLocation,
} from "react-router-dom"
import { useCart } from "../../context/CartContext"
import "./Header.css"

export default function Header() {
  const [menuOpen, setMenuOpen] =
    useState(false)

  const location = useLocation()
  const { count, setIsOpen } = useCart()

  // Close the mobile menu after navigation.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])

  // Close the menu with Escape.
  useEffect(() => {
    if (!menuOpen) return undefined

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false)
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    )

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      )
    }
  }, [menuOpen])

  function openCart() {
    setMenuOpen(false)
    setIsOpen(true)
  }

  return (
    <header
      className={`site-header ${
        menuOpen
          ? "site-header--menu-open"
          : ""
      }`}
    >
      <div className="site-header__inner">
        <div className="site-header__brand">
          <Link
            to="/"
            className="site-header__logo"
            aria-label="Sockcs homepage"
          >
            SOCKCS
          </Link>

          <span className="site-header__edition">
            NYC · 2025
          </span>
        </div>

        <nav
          className="site-header__nav"
          aria-label="Main navigation"
        >
          <Link to="/shop">Shop all</Link>
          <Link to="/shop?category=kit">
            Kits
          </Link>
          <Link to="/shop?category=socks">
            Socks
          </Link>
          <Link to="/#story">
            Our story
          </Link>
        </nav>

        <div className="site-header__actions">
          <span className="site-header__location">
            Brooklyn · Nueva York
          </span>

          <button
            type="button"
            className="site-header__menu-button"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span />
            <span />
          </button>

          <button
            type="button"
            className="site-header__cart"
            onClick={openCart}
            aria-label={`Open shopping cart with ${count} items`}
          >
            <span className="site-header__cart-label">
              Cart
            </span>

            <span className="site-header__cart-count">
              {count}
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={
          menuOpen
            ? "mobile-navigation mobile-navigation--open"
            : "mobile-navigation"
        }
        aria-hidden={!menuOpen}
      >
        <div className="mobile-navigation__inner">
          <nav aria-label="Mobile navigation">
            <Link to="/shop">
              <span>01</span>
              Shop all
              <strong>↗</strong>
            </Link>

            <Link to="/shop?category=kit">
              <span>02</span>
              The kits
              <strong>↗</strong>
            </Link>

            <Link to="/shop?category=socks">
              <span>03</span>
              Signature socks
              <strong>↗</strong>
            </Link>

            <Link to="/#story">
              <span>04</span>
              Our story
              <strong>↓</strong>
            </Link>
          </nav>

          <div className="mobile-navigation__footer">
            <span>Brooklyn made</span>
            <span>Nueva York · Est. 2025</span>
          </div>
        </div>
      </div>
    </header>
  )
}