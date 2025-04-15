
import HeroSection from "@/components/home/HeroSection"
import InfoSection from "@/components/home/InfoSection"
import AchievementsSection from "@/components/home/AchievementsSection"
import GallerySection from "@/components/home/GallerySection"
import ContactSection from "@/components/home/ContactSection"
import Footer from "@/components/home/Footer"
import DemoButtons from "@/components/demo_button"
import Banner from "@/components/home/Banner"
import Header from "@/components/home/Header"
import ChatBot from "@/components/chatbot/Chatbot"

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
        <ChatBot/>
      </main>
      <Footer />
    </div>
  )
}