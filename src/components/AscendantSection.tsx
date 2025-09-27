import React, { useEffect, useState } from 'react';

const AscendantSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    
    const element = document.getElementById('ascendant-section');
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="ascendant-section" className="min-h-screen relative overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/68d70fc5f56f108d4e4b2f69_1758924791736_6364bb7e.webp')`
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-ping delay-500" />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-1000" />
        <div className="absolute bottom-1/4 right-1/6 w-4 h-4 bg-pink-400 rounded-full animate-ping delay-1500" />
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-ping delay-2000" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-2000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-6xl md:text-7xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
            Nebula Ascendant
          </h2>
          
          <div className="space-y-8 text-xl md:text-2xl text-gray-200 leading-relaxed">
            <p className={`transition-all duration-1500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              From fractured code to cosmic command, your legend ignites. Empires rise not by toil, but by the bots that bend reality to your decree.
            </p>
            
            <p className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 transition-all duration-1500 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              FUTUR INC: Where small orgs summon the infinite.
            </p>
            
            <p className={`text-xl md:text-2xl text-purple-400 font-semibold transition-all duration-1500 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              Your frontier, forever expanded.
            </p>
            
            <p className={`text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 animate-pulse transition-all duration-1500 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              The stars align. What realm will you conquer next?
            </p>
          </div>
          
          {/* Glow Effect */}
          <div className={`mt-12 transition-all duration-2000 delay-1500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <div className="inline-block p-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 backdrop-blur-sm border border-cyan-400/30">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 animate-spin-slow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AscendantSection;