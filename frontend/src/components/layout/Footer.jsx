import { useState } from "react"
import { Link } from "react-router-dom"
import "./Footer.css"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const currentYear = new Date().getFullYear()

  function handleSubmit(event) {
    event.preventDefault()

    const cleanedEmail = email.trim()

    if (
      !cleanedEmail ||
      !cleanedEmail.includes("@")
    ) {
      setMessage(
        "Enter a valid email address."
      )
      return
    }

    setMessage("You’re on the list ♡")
    setEmail("")
  }

  return (
    <footer className="site-footer">
      {/* Moving-style brand strip */}

      <div className="site-footer__strip">
        <div className="site-footer__strip-inner">
          <span>Brooklyn made</span>
          <i>✦</i>
          <span>Nueva York</span>
          <i>✦</i>
          <span>Details matter</span>
          <i>✦</i>
          <span>Built line by line</span>
          <i>✦</i>
          <span>Socks first, always</span>
        </div>
      </div>

      <div className="site-footer__main">
        {/* Brand statement */}

        <div className="site-footer__brand">
          <Link
            to="/"
            className="site-footer__logo"
            aria-label="Sockcs homepage"
          >
            SOCKCS
          </Link>

          <p className="site-footer__statement">
            A New York uniform built from the
            ground up. Heavyweight tees, city
            bottoms and the socks that started
            everything.
          </p>

          <div className="site-footer__signature">
            packaged by hand ♡
          </div>

          <div className="site-footer__location">
            <span>Brooklyn, New York</span>
            <span>Est. 2025</span>
          </div>
        </div>

        {/* Shop navigation */}

        <nav
          className="site-footer__column"
          aria-labelledby="footer-shop-title"
        >
          <h2 id="footer-shop-title">
            Shop
          </h2>

          <Link to="/shop">
            Shop all
          </Link>

          <Link to="/shop?category=kit">
            The kits
          </Link>

          <Link to="/shop?category=tee">
            Heavyweight tees
          </Link>

          <Link to="/shop?category=jorts">
            City jorts
          </Link>

          <Link to="/shop?category=socks">
            Signature socks
          </Link>
        </nav>

        {/* Information navigation */}

        <nav
          className="site-footer__column"
          aria-labelledby="footer-info-title"
        >
          <h2 id="footer-info-title">
            Information
          </h2>

          <Link to="/#story">
            Our story
          </Link>

          <Link to="/sizing">
            Sizing
          </Link>

          <Link to="/shipping">
            Shipping & returns
          </Link>

          <Link to="/care">
            Product care
          </Link>

          <a href="mailto:hello@sockcs.com">
            Contact
          </a>
        </nav>

        {/* Newsletter */}

        <div className="site-footer__newsletter">
          <p className="site-footer__eyebrow">
            City transmissions
          </p>

          <h2>
            Stay close
            <br />
            to the next drop.
          </h2>

          <p className="site-footer__newsletter-copy">
            Drops, restocks and Brooklyn
            pop-ups. Nothing unnecessary.
          </p>

          <form
            className="site-footer__form"
            onSubmit={handleSubmit}
            noValidate
          >
            <label
              htmlFor="footer-email"
              className="site-footer__label"
            >
              Email address
            </label>

            <div className="site-footer__input-row">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setMessage("")
                }}
                placeholder="you@email.com"
                autoComplete="email"
                aria-describedby="footer-message"
              />

              <button type="submit">
                Join
                <span aria-hidden="true">↗</span>
              </button>
            </div>

            <p
              id="footer-message"
              className="site-footer__message"
              aria-live="polite"
            >
              {message ||
                "No spam. Just the city system."}
            </p>
          </form>
        </div>
      </div>

      {/* Large footer wordmark */}

      <div className="site-footer__wordmark">
        SOCKCS
      </div>

      {/* Legal row */}

      <div className="site-footer__bottom">
        <span>
          © {currentYear} Sockcs.
          Brooklyn, New York.
        </span>

        <span className="site-footer__system">
          City System / 001
        </span>

        <div className="site-footer__legal">
          <Link to="/privacy">
            Privacy
          </Link>

          <Link to="/terms">
            Terms
          </Link>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            Instagram ↗
          </a>
        </div>
      </div>
    </footer>
  )
}