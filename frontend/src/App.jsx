import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import ProductDetail from "./components/ProductDetail"
import Cart from "./components/Cart"
import "./App.css"

function AppContent() {
  return (
    <div className="app">
      <Header />

      <main className="app__main">
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/shop"
            element={<Shop />}
          />

          <Route
            path="/products/:slug"
            element={<ProductDetail />}
          />
        </Routes>
      </main>

      <Footer />

      <Cart />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  )
}