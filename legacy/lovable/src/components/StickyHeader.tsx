import React, { useEffect, useState } from 'react';

const StickyHeader = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (currentScrollY / documentHeight) * 100;
      
      setScrollProgress(progress);
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 transition-all duration-300" style={{ width: `${scrollProgress}%` }} />
      
      {/* Header Content */}
      <div className="bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Only */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:opacity-80 transition-opacity duration-300"
            >
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68805a2b526d10502513d6c1_1758929151114_46d651a4.png" 
                alt="FUTUR Logo" 
                className="h-8 w-auto"
              />
            </button>
            
            {/* Navigation Dots */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => scrollToSection('shadows-section')}
                className="w-3 h-3 rounded-full bg-gray-600 hover:bg-red-500 transition-colors duration-300"
                title="Shadows of the Grind"
              />
              <button
                onClick={() => scrollToSection('wizard-section')}
                className="w-3 h-3 rounded-full bg-gray-600 hover:bg-cyan-400 transition-colors duration-300"
                title="The Wizard's Veil"
              />
              <button
                onClick={() => scrollToSection('ascendant-section')}
                className="w-3 h-3 rounded-full bg-gray-600 hover:bg-purple-500 transition-colors duration-300"
                title="Nebula Ascendant"
              />
            </div>
            
            {/* CTA Button */}
            <button
              onClick={() => {
                const form = document.querySelector('form');
                form?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-full hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 text-sm"
            >
              Summon AI
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;