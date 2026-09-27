import React, { useEffect } from 'react';
import StickyHeader from './StickyHeader';
import HeroSection from './HeroSection';
import ShadowsSection from './ShadowsSection';
import WizardSection from './WizardSection';
import IgnitionSection from './IgnitionSection';
import AscendantSection from './AscendantSection';
import SummoningForm from './SummoningForm';

const AppLayout: React.FC = () => {
  useEffect(() => {
    // Set document title and meta description
    document.title = "FUTUR INC: Summon AI Wizards for Your Small Empire";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Empower your small org with AI task bots—conception, development, management. Heroic automation awaits.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Empower your small org with AI task bots—conception, development, management. Heroic automation awaits.';
      document.head.appendChild(meta);
    }

    // Add custom CSS for smooth scrolling and cyberpunk effects
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      
      body {
        background: #000000;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Orbitron', 'Rajdhani', sans-serif;
        font-weight: 700;
      }
      
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .animate-spin-slow {
        animation: spin-slow 3s linear infinite;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: #000000;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #00BFFF, #8A2BE2);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #00CCFF, #9932CC);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <StickyHeader />
      <HeroSection />
      <ShadowsSection />
      <WizardSection />
      <IgnitionSection />
      <AscendantSection />
      <SummoningForm />
    </div>
  );
};
export default AppLayout;