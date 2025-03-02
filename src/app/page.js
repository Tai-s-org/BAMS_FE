import Header from "@/components/home/Header"
import HeroSection from "@/components/home/HeroSection"
import Banner from "@/components/home/Banner"
import InfoSection from "@/components/home/InfoSection"
import AchievementsSection from "@/components/home/AchievementsSection"
import GallerySection from "@/components/home/GallerySection"
import ContactSection from "@/components/home/ContactSection"
import Footer from "@/components/home/Footer"
import DemoButtons from "@/components/demo_button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-900 to-gray-900">
      <Header />
      <main>
        
        <Banner />
        <HeroSection />
        <InfoSection />
        <AchievementsSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
      <DemoButtons />
    </div>
  )
}