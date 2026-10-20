import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("sockcs-cart")
    return saved ? JSON.parse(saved) : []
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem("sockcs-cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) return prev.map(p => p.id === product.id ? {...p, qty: p.qty + 1} : p)
      return [...prev, {...product, qty: 1}]
    })
    setIsOpen(true)
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(p => p.id !== id))
  const updateQty = (id, qty) => {
    if(qty <= 0) return removeFromCart(id)
    setCart(prev => prev.map(p => p.id === id ? {...p, qty} : p))
  }

  const total = cart.reduce((sum, p) => sum + (parseFloat(p.price) * p.qty), 0)
  const count = cart.reduce((sum, p) => sum + p.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, total, count, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)