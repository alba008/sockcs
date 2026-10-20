import HeroRandom from "../components/HeroRandom"
import KitsShowcase from "../components/KitsShowcase"
import CityEssentials from "../components/CityEssentials"
import SockCulture from "../components/SockCulture"

export default function Home() {
  return (
    <main className="home-page">
      <HeroRandom />
      <KitsShowcase />
      <CityEssentials />
      <SockCulture />
    </main>
  )
}