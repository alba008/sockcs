import { useState } from "react"
import ProductGrid from "../components/ProductGrid"
import HeroRandom from "../components/HeroRandom"

export default function Home() {
  const [filter, setFilter] = useState({})
  const current = (a,b) => JSON.stringify(a)===JSON.stringify(b)
  const btn = (active) => ({padding:"10px 18px", fontSize:"11px", letterSpacing:"1px", textTransform:"uppercase", border:active?"1px solid #000":"1px solid #EAE8E3", background:active?"#000":"#fff", color:active?"#fff":"#000", cursor:"pointer", borderRadius:"20px", transition:"all 0.2s"})

  return (
    <>
      <HeroRandom />
      <div style={{ maxWidth:"1440px", margin:"0 auto", padding:"60px 40px 20px 40px" }}>
        <h2 style={{ fontSize:"48px", fontWeight:900, lineHeight:"0.9", letterSpacing:"-2px", margin:0 }}>CITY SYSTEM<br/>$89</h2>
        <p style={{ fontSize:"13px", letterSpacing:"2px", textTransform:"uppercase", marginTop:"16px", color:"#666" }}>Tee. Jorts. Socks. Designed in Brooklyn, NY. Built line by line.</p>
        <p className="font-hand" style={{ fontSize:"20px", marginTop:"8px", color:"#A85C2F", transform:"rotate(-1deg)" }}>real people, real Brooklyn — est. 2020 ✍️</p>
        <div style={{ marginTop:"30px", display:"flex", gap:"12px", flexWrap:"wrap" }}>
          <button onClick={() => setFilter({})} style={btn(current(filter,{}))}>ALL SYSTEMS</button>
          <button onClick={() => setFilter({ featured:"true" })} style={btn(current(filter,{featured:"true"}))}>FEATURED</button>
          <button onClick={() => setFilter({ bestseller:"true" })} style={btn(current(filter,{bestseller:"true"}))}>BESTSELLERS</button>
          <button onClick={() => setFilter({ category:"kit" })} style={btn(current(filter,{category:"kit"}))}>KITS $89</button>
          <button onClick={() => setFilter({ category:"socks" })} style={btn(current(filter,{category:"socks"}))}>SOCKS</button>
        </div>
      </div>
      <div style={{ maxWidth:"1440px", margin:"0 auto", padding:"20px 40px 100px 40px" }}><ProductGrid filter={filter} /></div>
    </>
  )
}