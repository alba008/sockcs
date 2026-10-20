import {
    useEffect,
    useMemo,
    useState,
  } from "react"
  import { Link } from "react-router-dom"
  import {
    fetchProducts,
    fetchSiteImages,
  } from "../api"
  import { useCart } from "../context/CartContext"
  import fallbackImage from "../assets/jorty.png"
  import "./SockCulture.css"
  
  function normalizeResults(data) {
    if (Array.isArray(data)) {
      return data
    }
  
    return data?.results || []
  }
  
  function getImageUrl(value) {
    if (!value) {
      return fallbackImage
    }
  
    return value
  }
  
  function formatPrice(value) {
    const price = Number(value)
  
    if (Number.isNaN(price)) {
      return "$24"
    }
  
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits:
        Number.isInteger(price) ? 0 : 2,
    }).format(price)
  }
  
  export default function SockCulture() {
    const [sock, setSock] = useState(null)
    const [cultureImages, setCultureImages] =
      useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [added, setAdded] = useState(false)
    const [activeArtwork, setActiveArtwork] =
      useState(0)
    const [artPaused, setArtPaused] =
      useState(false)
  
    const { addToCart } = useCart()
  
    /*
     * Load the signature sock and culture images.
     */
    useEffect(() => {
      let cancelled = false
  
      async function loadSection() {
        try {
          setLoading(true)
          setError("")
  
          const [sockData, siteImageData] =
            await Promise.all([
              fetchProducts({
                category: "socks",
              }),
  
              fetchSiteImages("hero").catch(
                () => []
              ),
            ])
  
          if (cancelled) {
            return
          }
  
          const socks =
            normalizeResults(sockData)
  
          const siteImages =
            normalizeResults(siteImageData)
  
          setSock(socks[0] || null)
          setCultureImages(siteImages)
        } catch (requestError) {
          if (cancelled) {
            return
          }
  
          console.error(
            "Unable to load sock culture section:",
            requestError
          )
  
          setError(
            "The signature sock could not be loaded."
          )
        } finally {
          if (!cancelled) {
            setLoading(false)
          }
        }
      }
  
      loadSection()
  
      return () => {
        cancelled = true
      }
    }, [])
  
    /*
     * Collect every available image belonging to the
     * signature sock.
     */
    const productImages = useMemo(() => {
      if (!sock) {
        return []
      }
  
      const images = [
        sock.image_url,
        sock.image,
        sock.image_hover_url,
        sock.image_hover,
  
        ...(sock.gallery || []).flatMap(
          (item) => [
            item.image_url,
            item.image,
          ]
        ),
      ]
  
      return [
        ...new Set(
          images.filter(Boolean)
        ),
      ]
    }, [sock])
  
    /*
     * Combine product images and site images into the
     * handmade culture-wall artwork collection.
     */
    const artworkImages = useMemo(() => {
      const siteImages =
        cultureImages.flatMap((item) => [
          item.image_url,
          item.image,
          item.url,
        ])
  
      return [
        ...new Set(
          [
            ...productImages,
            ...siteImages,
            fallbackImage,
          ].filter(Boolean)
        ),
      ]
    }, [cultureImages, productImages])
  
    /*
     * Preload images and rotate the large polaroid
     * automatically.
     */
    useEffect(() => {
      if (!artworkImages.length) {
        return undefined
      }
  
      artworkImages.forEach((imageUrl) => {
        const image = new Image()
        image.src = imageUrl
      })
  
      setActiveArtwork(
        (current) =>
          current % artworkImages.length
      )
  
      if (
        artworkImages.length <= 1 ||
        artPaused
      ) {
        return undefined
      }
  
      const interval =
        window.setInterval(() => {
          setActiveArtwork((current) => {
            return (
              (current + 1) %
              artworkImages.length
            )
          })
        }, 5000)
  
      return () => {
        window.clearInterval(interval)
      }
    }, [artworkImages, artPaused])
  
    function artworkAt(index) {
      if (!artworkImages.length) {
        return fallbackImage
      }
  
      const safeIndex =
        index % artworkImages.length
  
      return getImageUrl(
        artworkImages[safeIndex]
      )
    }
  
    function handleAddToCart() {
      if (
        !sock ||
        Number(sock.stock) <= 0
      ) {
        return
      }
  
      addToCart(sock)
      setAdded(true)
  
      window.setTimeout(() => {
        setAdded(false)
      }, 1500)
    }
  
    if (loading) {
      return (
        <section className="sock-culture-loading">
          <span>
            Preparing the details...
          </span>
        </section>
      )
    }
  
    return (
      <>
        {/* SIGNATURE SOCK */}
  
        <section
          id="signature-sock"
          className="signature-sock"
          aria-labelledby="signature-sock-title"
        >
          <div className="signature-sock__inner">
            <div className="signature-sock__copy">
              <p className="signature-sock__eyebrow">
                Signature · The foundation
              </p>
  
              <h2 id="signature-sock-title">
                The sock
                <br />
                that started
                <br />
                it all.
              </h2>
  
              <p className="signature-sock__description">
                Black with white stripes.
                Cushioned footbed. Rib that stays.
                The pair we wore for a year before
                selling anything else.
              </p>
  
              {error && (
                <p className="signature-sock__error">
                  {error}
                </p>
              )}
  
              <div className="signature-sock__specs">
                <div>
                  <span>Weight</span>
                  <strong>Medium</strong>
                </div>
  
                <div>
                  <span>Length</span>
                  <strong>Crew</strong>
                </div>
  
                <div>
                  <span>Price</span>
  
                  <strong>
                    {formatPrice(
                      sock?.price || 24
                    )}
                  </strong>
                </div>
              </div>
  
              <div className="signature-sock__actions">
                {sock && (
                  <button
                    type="button"
                    className={
                      added
                        ? "signature-sock__add signature-sock__add--confirmed"
                        : "signature-sock__add"
                    }
                    onClick={
                      handleAddToCart
                    }
                    disabled={
                      added ||
                      Number(sock.stock) <= 0
                    }
                  >
                    {Number(sock.stock) <= 0
                      ? "Sold out"
                      : added
                        ? "Added to cart ✓"
                        : `Add socks · ${formatPrice(
                            sock.price
                          )}`}
                  </button>
                )}
  
                <Link
                  to="/shop?category=kit"
                  className="signature-sock__kits-link"
                >
                  Shop the kits
                </Link>
              </div>
  
              <div className="signature-sock__details-note">
                <strong>
                  Details Matter
                </strong>
  
                <p>
                  Woven Sockcs tab at the cuff.
                  No slip. No fade. Built from
                  the ground up.
                </p>
  
                <span>
                  socks first,
                  <br />
                  always.
                </span>
              </div>
            </div>
  
            {/* SOCK IMAGE GALLERY */}
  
            <div className="signature-sock__gallery">
              <figure className="signature-sock__image signature-sock__image--main">
                <img
                  src={artworkAt(0)}
                  alt={
                    sock?.name ||
                    "Sockcs signature stripe socks"
                  }
                />
  
                <figcaption>
                  Signature stripe · Nueva York
                </figcaption>
              </figure>
  
              <figure className="signature-sock__image signature-sock__image--detail">
                <img
                  src={artworkAt(1)}
                  alt="Sockcs signature product detail"
                />
              </figure>
  
              <figure className="signature-sock__image signature-sock__image--street">
                <img
                  src={artworkAt(2)}
                  alt="Sockcs worn in New York"
                />
  
                <figcaption>
                  Worn in NYC
                </figcaption>
              </figure>
  
              <div className="signature-sock__material-card">
                <span>Fabric note</span>
  
                <strong>
                  Combed cotton
                  <br />
                  + stretch.
                  <br />
                  Terry bottom.
                </strong>
  
                <p>
                  Cushioned.
                  <br />
                  Ribbed.
                  <br />
                  Built to stay up.
                </p>
              </div>
            </div>
          </div>
        </section>
  
        {/* HANDMADE CULTURE WALL */}
  
        <section
          className="culture-wall"
          aria-labelledby="culture-wall-title"
        >
          <div className="culture-wall__scribble culture-wall__scribble--top">
            made for sidewalks, not runways
          </div>
  
          <div className="culture-wall__inner">
            <div className="culture-wall__copy">
              <span className="culture-wall__yellow-sticker">
                Brooklyn tested
              </span>
  
              <h2 id="culture-wall-title">
                Worn
                <br />
                in
                <br />
                NYC
              </h2>
  
              <p className="culture-wall__hand-copy">
                every pair comes with a scuff
                from the lab. we walked in ’em
                first ♡
              </p>
  
              <div className="culture-wall__badges">
                <span>No slip</span>
                <span>Woven tag</span>
                <span>Built to move</span>
                <span>
                  Packaged by hand ♡
                </span>
              </div>
  
              <div className="culture-wall__mini-photos">
                {[0, 1, 2, 3].map(
                  (index) => (
                    <div
                      key={index}
                      className={`culture-wall__mini-photo culture-wall__mini-photo--${
                        index + 1
                      }`}
                    >
                      <img
                        src={artworkAt(index)}
                        alt=""
                        aria-hidden="true"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
  
            {/* LOOPING POLAROID */}
  
            <div className="culture-wall__art">
              <div className="culture-wall__tape" />
  
              <figure
                className="culture-wall__polaroid"
                onMouseEnter={() =>
                  setArtPaused(true)
                }
                onMouseLeave={() =>
                  setArtPaused(false)
                }
              >
                <div className="culture-wall__photo-window">
                  <img
                    key={activeArtwork}
                    className="culture-wall__cycling-image"
                    src={artworkAt(
                      activeArtwork
                    )}
                    alt="Sockcs street culture in New York"
                  />
  
                  <div className="culture-wall__photo-counter">
                    {String(
                      activeArtwork + 1
                    ).padStart(2, "0")}
  
                    <span>/</span>
  
                    {String(
                      artworkImages.length
                    ).padStart(2, "0")}
                  </div>
  
                  {artworkImages.length > 1 && (
                    <div
                      className="culture-wall__photo-dots"
                      aria-label="Street image navigation"
                    >
                      {artworkImages.map(
                        (image, index) => (
                          <button
                            key={`${image}-${index}`}
                            type="button"
                            className={
                              index ===
                              activeArtwork
                                ? "culture-wall__photo-dot culture-wall__photo-dot--active"
                                : "culture-wall__photo-dot"
                            }
                            onClick={() =>
                              setActiveArtwork(
                                index
                              )
                            }
                            aria-label={`Show street image ${
                              index + 1
                            }`}
                            aria-current={
                              index ===
                              activeArtwork
                                ? "true"
                                : undefined
                            }
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
  
                <figcaption>
                  Bed-Stuy → LES · 11:42pm
                </figcaption>
              </figure>
  
              {/* STICKERS */}
  
              <div className="culture-wall__sticker culture-wall__sticker--heavy">
                240GSM HEAVY!!
              </div>
  
              <div className="culture-wall__sticker culture-wall__sticker--intention">
                hecho con intención
              </div>
  
              <div className="culture-wall__sticker culture-wall__sticker--system">
                CITY SYSTEM
                <br />
                NUEVA YORK
              </div>
  
              <div
                className="culture-wall__arrow"
                aria-hidden="true"
              >
                ↘
              </div>
  
              <p className="culture-wall__sock-note">
                ps: socks first,
                <br />
                always.
              </p>
            </div>
          </div>
  
          <div className="culture-wall__footer">
            <span>
              uniform notes: tee + jorts +
              stripe → done.
            </span>
  
            <span>
              est. 2025 on a rooftop in New
              York
            </span>
          </div>
        </section>
      </>
    )
  }