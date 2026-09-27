import React, { useEffect, useState } from 'react';

const WizardSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [portalActive, setPortalActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setTimeout(() => setPortalActive(true), 800);
        }
      },
      { threshold: 0.4 }
    );
    
    const element = document.getElementById('wizard-section');
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="wizard-section" className="min-h-screen bg-gradient-to-b from-black to-purple-900/20 py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Portal Effect */}
          <div className={`relative mb-12 transition-all duration-2000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <div className={`relative inline-block transition-all duration-1500 ${portalActive ? 'scale-110' : 'scale-100'}`}>
              <img
                src="https://d64gsuwffb70l.cloudfront.net/68d70fc5f56f108d4e4b2f69_1758924790294_46f3347e.webp"
                alt="AI Wizard Portal"
                className="w-full max-w-2xl h-auto rounded-lg shadow-2xl"
              />
              
              {/* Portal Glow Effect */}
              <div className={`absolute inset-0 rounded-lg transition-all duration-2000 ${portalActive ? 'shadow-[0_0_100px_rgba(0,191,255,0.5)]' : 'shadow-none'}`} />
              
              {/* Mystical Particles */}
              {portalActive && (
                <>
                  <div className="absolute top-0 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                  <div className="absolute top-1/3 right-0 w-3 h-3 bg-purple-500 rounded-full animate-ping delay-300" />
                  <div className="absolute bottom-1/4 left-0 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-700" />
                  <div className="absolute bottom-0 right-1/3 w-4 h-4 bg-cyan-300 rounded-full animate-ping delay-1000" />
                </>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className={`space-y-8 transition-all duration-1500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              The Wizard's Veil
            </h2>
            
            <div className="space-y-6 text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              <p>
                Enter <span className="text-cyan-400 font-bold">FUTUR INC</span>, the arcane forge where tomorrow's sentinels are born. We are the weavers of etheric bots and agents—conceived in starfire, forged for your realm.
              </p>
              <p>
                Not mere machines, but spectral aides: task-weaving phantoms that anticipate, adapt, and amplify. For small empires like yours, we craft, deploy, and steward these digital djinn, turning whispers of will into worlds remade.
              </p>
              <p className="text-purple-400 font-semibold text-xl">
                The veil parts. Your alliance awaits.
              </p>
            </div>
          </div>
          
          {/* Scroll Arrow */}
          <div className={`mt-16 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="animate-bounce">
              <svg className="w-8 h-8 mx-auto text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WizardSection;