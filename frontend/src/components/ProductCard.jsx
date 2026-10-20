import { useCart } from "../context/CartContext"
import { Link } from "react-router-dom"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div style={{ 
      background: "#FFF", 
      border: "1px solid #EAE8E3", 
      borderRadius: "2px", 
      overflow: "hidden", 
      display: "flex", 
      flexDirection: "column",
      transition: "border 0.2s"
    }}>
      {/* CLICKABLE IMAGE -> PDP */}
      <Link 
        to={`/products/${product.slug}`}
        style={{ 
          aspectRatio: "4/5", 
          background: "#FAF9F6", 
          position: "relative", 
          overflow: "hidden",
          display: "block"
        }}
      >
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.04)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
        ) : (
          <div style={{ padding: "100px 0", textAlign: "center", color: "#999", fontSize:"11px", letterSpacing:"1px" }}>NO IMAGE</div>
        )}
        
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
          {product.is_new && <span style={{ background: "#000", color: "#fff", fontSize: "10px", padding: "4px 8px", letterSpacing: "1px" }}>NEW</span>}
          {product.is_bestseller && <span style={{ background: "#fff", color: "#000", fontSize: "10px", padding: "4px 8px", border: "1px solid #000", letterSpacing: "1px" }}>BESTSELLER</span>}
        </div>
      </Link>

      {/* INFO + CART */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <Link to={`/products/${product.slug}`} style={{ textDecoration:"none", color:"#000" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>{product.name}</h3>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>${product.price}</span>
          </div>
          <p style={{ fontSize: "11px", color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", margin: "6px 0 16px 0" }}>{product.category} • {product.slug}</p>
        </Link>

        <div style={{ marginTop: "auto", display: "flex", gap: "8px" }}>
          <button 
            onClick={() => addToCart(product)} 
            style={{ flex:1, padding: "12px", background: "#000", color: "#fff", border: "none", fontSize: "11px", letterSpacing: "1px", cursor: "pointer" }}
          >
            {product.category === "kit" ? "ADD KIT — $89" : `ADD — $${product.price}`}
          </button>
          
          <Link 
            to={`/products/${product.slug}`}
            style={{ padding:"12px 14px", border:"1px solid #000", background:"#fff", color:"#000", fontSize:"11px", letterSpacing:"1px", textDecoration:"none", textAlign:"center" }}
          >
            VIEW
          </Link>
        </div>
      </div>
    </div>
  )
}