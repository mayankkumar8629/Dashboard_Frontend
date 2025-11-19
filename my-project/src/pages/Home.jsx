import Navbar from '../components/layout/navbar.jsx';
import HeroSection from '../components/heroSection/HeroSection.jsx';



export default function Home() {
  return (
    <div className="min-h-screen relative">
    
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a2a] to-[#000000]" />
      
      <div className="relative z-10">
        <Navbar />

        <main className="pt-52 pb-12 min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <HeroSection />
        </main>
      </div>
    </div>
  );
}