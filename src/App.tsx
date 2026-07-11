import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import WaterLevel from './components/WaterLevel';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WhySough from './components/WhySough';
import PurificationJourney from './components/PurificationJourney';
import OurPromise from './components/OurPromise';
import FeelingSection from './components/FeelingSection';
import Products from './components/Products';
import OurValues from './components/OurValues';
import Distributor from './components/Distributor';
import Contact from './components/Contact';
import Footer from './components/Footer';
import VerifyPage from './pages/VerifyPage.tsx';

function HomePage() {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <LoadingScreen onComplete={() => setLoaded(true)} />
      <CustomCursor />
      {loaded && (
        <>
          <WaterLevel />
          <Navbar />
          <main>
            <HeroSection />
            <WhySough />
            <PurificationJourney />
            <OurPromise />
            <FeelingSection />
            <Products />
            <OurValues />
            <Distributor />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify" element={<VerifyPage />} />
      </Routes>
    </BrowserRouter>
  );
}
