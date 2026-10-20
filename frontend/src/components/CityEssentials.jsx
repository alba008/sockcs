import { Link } from "react-router-dom"
import ProductGrid from "./ProductGrid"
import "./CityEssentials.css"

const ACTIVE_PRODUCT_FILTER = {
  is_active: true,
}

export default function CityEssentials() {
  return (
    <section
      className="city-essentials"
      aria-labelledby="city-essentials-title"
    >
      <div className="city-essentials__heading">
        <div>
          <p className="city-essentials__eyebrow">
            Build your own · Piece by piece
          </p>

          <h2 id="city-essentials-title">
            City
            <br />
            Essentials
          </h2>
        </div>

        <div className="city-essentials__heading-copy">
          <p>
            Start with the full uniform or choose the
            pieces that speak to you. Heavyweight tees,
            city jorts and signature socks.
          </p>

          <Link to="/shop">
            Explore everything
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <ProductGrid
        filter={ACTIVE_PRODUCT_FILTER}
        excludeCategory="kit"
        limit={4}
        mobileSlider
      />
    </section>
  )
}