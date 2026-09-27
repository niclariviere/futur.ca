import React, { useEffect, useState } from 'react';

const ShadowsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    
    const element = document.getElementById('shadows-section');
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="shadows-section" className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Content */}
          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">
              Shadows of the Grind
            </h2>
            
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                You summon legacy relics—spreadsheets that rebel, apps that phantom-sync, nights blurred into code. Deadlines warp time itself, innovation flickers like a dying holoscreen.
              </p>
              <p>
                Allies falter, visions dim. The frontier demands more: relentless efficiency, unseen guardians to shield your core from the grind.
              </p>
              <p className="text-purple-400 font-semibold">
                Yet in the code's underbelly, a signal pulses—ready to ignite your legend?
              </p>
            </div>
          </div>
          
          {/* Right Graphic */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <img
                src="https://d64gsuwffb70l.cloudfront.net/68d70fc5f56f108d4e4b2f69_1758924791043_d203a6f9.webp"
                alt="Fracturing legacy tools"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              
              {/* Glitch Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-600/20 rounded-lg animate-pulse" />
              
              {/* Floating Particles */}
              <div className="absolute -top-4 -right-4 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
              <div className="absolute top-1/2 -left-4 w-2 h-2 bg-purple-500 rounded-full animate-ping delay-1000" />
              <div className="absolute -bottom-4 left-1/3 w-4 h-4 bg-red-500 rounded-full animate-ping delay-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Gradient Divider */}
      <div className="mt-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
    </section>
  );
};

export default ShadowsSection;