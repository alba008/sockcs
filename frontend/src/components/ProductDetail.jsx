import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { fetchProductBySlug, fetchProducts } from "../api"
import { useCart } from "../context/CartContext"

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [size, setSize] = useState("M")
  const [activeImg, setActiveImg] = useState(null)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProductBySlug(slug).then(p => {
      setProduct(p)
      setActiveImg(p.image_url)
      // If kit, pull singles for OR BUILD YOUR OWN
      if (p.category === "kit") {
        fetchProducts({}).then(d => {
          const singles = d.results.filter(x => x.category!== "kit" && x.id!== p.id)
          setRelated(singles.slice(0, 3))
        })
      }
    })
  }, [slug])

  if (!product) return <div style={{ background: "#FAF9F6", minHeight: "100vh", padding: "80px", textAlign: "center", fontSize: "11px", letterSpacing: "2px" }}>LOADING CITY SYSTEM...</div>

  const isKit = product.category === "kit"
  const allImages = [product.image_url,...(product.gallery?.map(g => g.image_url) || [])].filter(Boolean)

  const handleAdd = (item) => {
    addToCart({...item, selectedSize: size })
    setAdded(item.id)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div style={{ background: "#FAF9F6", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 40px" }}>
        <div style={{ padding: "20px 0", fontSize: "10px", letterSpacing: "0.14em", color: "rgba(0,0,0,0.4)" }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>SHOP</Link> <span> / </span> <span style={{ color: "#000" }}>{product.name.toUpperCase()}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "64px", paddingBottom: "80px" }}>
          {/* LEFT — GALLERY LIKE YOUR MOCK FILE */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "86px 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {allImages.slice(0, 5).map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(img)} style={{ width: "86px", height: "86px", borderRadius: "14px", overflow: "hidden", border: activeImg === img? "1px solid #000" : "1px solid rgba(0,0,0,0.08)", padding: 0, background: "#fff", cursor: "pointer" }}>
                    <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  </button>
                ))}
              </div>
              <div style={{ background: "#EDE9E1", aspectRatio: "3/4", borderRadius: "16px", overflow: "hidden", position: "relative" }}>
                <img src={activeImg} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: "16px", left: "16px", display: "flex", gap: "6px" }}>
                  {product.is_bestseller && <span style={{ background: "#000", color: "#fff", fontSize: "10px", padding: "5px 10px", letterSpacing: "0.08em", borderRadius: "20px" }}>BESTSELLER</span>}
                  {product.is_new && <span style={{ background: "#fff", color: "#000", fontSize: "10px", padding: "5px 10px", letterSpacing: "0.08em", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.1)" }}>NEW</span>}
                </div>
              </div>
            </div>

            {/* KIT INCLUDES — only for kits */}
            {isKit && (
              <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "14px", overflow: "hidden" }}>
                {[
                  { label: "TEE", value: "$38" },
                  { label: "JORTS", value: "$45" },
                  { label: "SOCKS", value: "$24" },
                ].map(b => (
                  <div key={b.label} style={{ background: "#fff", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "0.16em", color: "rgba(0,0,0,0.4)" }}>INCLUDES</div>
                    <div style={{ fontSize: "12px", fontWeight: 600, marginTop: "6px", letterSpacing: "0.08em" }}>{b.label}</div>
                    <div style={{ fontSize: "10px", color: "#A85C2F", marginTop: "2px" }}>{b.value} value</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — DETAILS */}
          <div style={{ paddingRight: "16px" }}>
            <h1 style={{ fontSize: "44px", fontWeight: 700, lineHeight: "0.9", letterSpacing: "-0.02em", margin: 0 }}>{product.name}</h1>
            <div style={{ marginTop: "12px", display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontSize: "22px", fontWeight: 500 }}>${product.price}</span>
              {isKit && product.compare_at_price && <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)", textDecoration: "line-through" }}>${product.compare_at_price}</span>}
              {isKit && <span style={{ fontSize: "10px", background: "#6CFF7A", padding: "4px 8px", borderRadius: "20px", letterSpacing: "0.08em" }}>SAVE $18</span>}
            </div>
            <div style={{ marginTop: "8px", fontSize: "10px", letterSpacing: "0.14em", color: "rgba(0,0,0,0.6)" }}>{product.category_display?.toUpperCase() || product.category.toUpperCase()} • CITY SYSTEM / 11377 • {product.stock > 0? `${product.stock} IN STOCK` : "LOW STOCK"}</div>

            <p style={{ marginTop: "24px", fontSize: "13px", lineHeight: "1.6", color: "rgba(0,0,0,0.7)" }}>
              {product.description || "Heavyweight tee. 12oz jorts. Ribbed logo socks. Designed in Brooklyn, NY. One system, one price. Built line by line."}
            </p>
            {product.materials && <p style={{ marginTop: "12px", fontSize: "11px", color: "rgba(0,0,0,0.5)" }}>{product.materials}</p>}

            <div style={{ marginTop: "28px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.14em", marginBottom: "12px" }}>SIZE — {size}</div>
              <div style={{ display: "flex", gap: "8px" }}>
                {["S", "M", "L", "XL"].map(s => (
                  <button key={s} onClick={() => setSize(s)} style={{ minWidth: "48px", height: "38px", padding: "0 14px", border: size === s? "1px solid #000" : "1px solid rgba(0,0,0,0.15)", background: size === s? "#000" : "#fff", color: size === s? "#fff" : "#000", fontSize: "11px", letterSpacing: "0.08em", borderRadius: "20px", cursor: "pointer" }}>{s}</button>
                ))}
              </div>
            </div>

            <button onClick={() => handleAdd(product)} style={{ marginTop: "24px", width: "100%", height: "56px", background: "#000", color: "#fff", border: "none", borderRadius: "28px", fontSize: "11px", letterSpacing: "0.14em", cursor: "pointer" }}>
              {added === product.id? "ADDED ✓" : `ADD TO CITY SYSTEM — $${product.price}`}
            </button>
            <div style={{ marginTop: "12px", textAlign: "center", fontSize: "10px", color: "rgba(0,0,0,0.4)", letterSpacing: "0.08em" }}>Secure checkout • Free returns • Ships 2-3 days from BROOKLYN, NY 11211</div>

            {/* OR BUILD YOUR OWN — THIS IS YOUR "JUST A JORT" FIX */}
            {isKit && related.length > 0 && (
              <div style={{ marginTop: "32px", borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "24px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.14em", marginBottom: "16px", textAlign: "center", color: "rgba(0,0,0,0.4)" }}>— OR BUILD YOUR OWN —</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "14px", overflow: "hidden" }}>
                  {related.map(r => (
                    <div key={r.id} style={{ background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px" }}>
                      <Link to={`/products/${r.slug}`} style={{ display: "flex", gap: "12px", alignItems: "center", textDecoration: "none", color: "inherit" }}>
                        <img src={r.image_url} style={{ width: "52px", height: "52px", borderRadius: "8px", objectFit: "cover", background: "#FAF9F6" }} alt="" />
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{r.name}</div>
                          <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.5)" }}>${r.price} • {r.category}</div>
                        </div>
                      </Link>
                      <button onClick={() => handleAdd(r)} style={{ fontSize: "10px", border: "1px solid #000", background: added === r.id? "#000" : "#fff", color: added === r.id? "#fff" : "#000", padding: "8px 14px", borderRadius: "20px", cursor: "pointer", letterSpacing: "0.08em", minWidth: "48px" }}>{added === r.id? "✓" : "ADD"}</button>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "12px", fontSize: "11px", textAlign: "center", color: "rgba(0,0,0,0.5)" }}>
                  <Link to="/" style={{ textDecoration: "underline", color: "inherit" }}>See all individual pieces</Link>
                </div>
              </div>
            )}

            <div style={{ marginTop: "32px", borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "20px", fontSize: "11px", lineHeight: "1.8", color: "rgba(0,0,0,0.6)" }}>
              <div>• 100% Cotton heavyweight • Pre-shrunk</div>
              <div>• Ships from Brooklyn, NY 11377 • 2-3 days</div>
              <div>• Free returns • Built line by line</div>
            </div>
          </div>
        </div>
      </div>

<div style={{ marginTop:"80px", background:"#FAF9F6", borderTop:"1px solid rgba(0,0,0,0.07)", padding:"40px", borderRadius:"16px", position:"relative" }}>
  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"24px" }}>
    <span style={{ fontSize:"20px" }}>★</span>
    <h3 style={{ fontSize:"20px", fontWeight:700, letterSpacing:"-0.01em" }}>FAQ</h3>
  </div>

  <div style={{ position:"relative", paddingBottom:"24px", borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
    <div style={{ display:"flex", justifyContent:"space-between" }}>
      <h4 style={{ fontSize:"14px", fontWeight:600 }}>Shipping</h4>
      <span style={{ fontSize:"11px", color:"rgba(0,0,0,0.5)" }}>30 days • Easy</span>
    </div>
    <p style={{ fontSize:"12px", color:"rgba(0,0,0,0.6)", marginTop:"6px", lineHeight:1.6 }}>Free shipping on $75+. Standard 3-5 business days. Express 1-2 days at checkout.</p>
    {/* HANDWRITTEN */}
    <div className="font-hand" style={{ position:"absolute", top:"-10px", right:"0", fontSize:"22px", color:"#1e3a8a", transform:"rotate(-3deg)" }}>
      <span>↙ ships from BK<br/>2-3 days ✈️</span>
    </div>
  </div>

  <div style={{ position:"relative", padding:"24px 0", borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
    <h4 style={{ fontSize:"14px", fontWeight:600 }}>Sizing</h4>
    <p style={{ fontSize:"12px", color:"rgba(0,0,0,0.6)", marginTop:"6px" }}>One size fits most. Fits US Men's 6-11 / Women's 7-12.</p>
    <div className="font-hand" style={{ fontSize:"24px", color:"#1e3a8a", transform:"rotate(-2deg)", marginTop:"8px" }}>
      → runs big!! size down ↴
    </div>
  </div>

  <div style={{ padding:"24px 0" }}>
    <div style={{ display:"flex", justifyContent:"space-between" }}>
      <h4 style={{ fontSize:"14px", fontWeight:600 }}>Returns</h4>
      <span style={{ fontSize:"11px", color:"rgba(0,0,0,0.5)" }}>30 days • Easy exchanges</span>
    </div>
  </div>

  <div style={{ marginTop:"24px", border:"1px solid #1e3a8a", borderRadius:"12px", padding:"16px", position:"relative" }}>
    <p style={{ fontSize:"12px", fontWeight:600 }}>Still unsure? We're real people in Brooklyn.</p>
    <p style={{ fontSize:"11px", color:"rgba(0,0,0,0.6)", marginTop:"4px" }}>DM us @sockcs or email hello@sockcs.co — we reply within a few hours.</p>
  </div>

  <div className="font-hand" style={{ marginTop:"16px", fontSize:"18px", color:"#1e3a8a" }}>
    Packaged by hand in our Bushwick studio. ♡
  </div>
</div>


    </div>
  )
}