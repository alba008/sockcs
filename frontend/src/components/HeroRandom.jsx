import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const API = "http://localhost:8000"

export default function HeroRandom() {
  const [heroes, setHeroes] = useState([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    fetch(`${API}/api/site-images/?location=hero`)
     .then(r => r.json())
     .then(d => {
        if (d && d.length > 0) setHeroes(d)
        else {
          setHeroes([{
            image_url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600",
            title_handwritten: "Built line by line",
            subtitle: "City System 11377",
            link_url: "/"
          }])
        }
      })
     .catch(() => {
        setHeroes([{
          image_url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600",
          title_handwritten: "Built line by line",
          subtitle: "City System 11377",
          link_url: "/"
        }])
      })
  }, [])

  useEffect(() => {
    if (heroes.length <= 1) return
    const id = setInterval(() => setActive(a => (a + 1) % heroes.length), 4500)
    return () => clearInterval(id)
  }, [heroes])

  if (!heroes.length) return null
  const h = heroes[active]

  return (
<div
  style={{
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    height: "86vh",
    background: "#EDE9E1",
    overflow: "hidden",
  }}
>
    <img src={h.image_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 60%)" }} />

      <h1 className="font-hand" style={{ position:"absolute", top:"16%", left:"5%", fontSize:"clamp(48px, 7.5vw, 96px)", color:"#fff", lineHeight:0.9, transform:"rotate(-3deg)", textShadow:"0 4px 30px rgba(0,0,0,0.4)" }}>
        {h.title_handwritten || "Built line by line"}
      </h1>

      <div style={{ position:"absolute", bottom:"8%", right:"5%", textAlign:"right" }}>
        <div className="font-hand" style={{ fontSize:"clamp(32px,4.5vw,64px)", color:"#fff", transform:"rotate(1.5deg)", textDecoration:"underline", textDecorationStyle:"wavy", textUnderlineOffset:"10px" }}>
          {h.subtitle}
        </div>
        <Link to={h.link_url || "/"} style={{ display:"inline-block", marginTop:"16px", background:"#000", color:"#fff", padding:"12px 24px", borderRadius:"28px", fontSize:"11px", letterSpacing:"0.14em" }}>
          SHOP CITY SYSTEM
        </Link>
      </div>

      <div style={{ position:"absolute", bottom:"20px", left:"50%", transform:"translateX(-50%)", display:"flex", gap:"8px" }}>
        {heroes.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ width: active===i? "28px":"8px", height:"8px", borderRadius:"20px", background: active===i? "#fff":"rgba(255,255,255,0.5)", border:"none", transition:"all 0.3s" }} />
        ))}
      </div>
    </div>
  )
}