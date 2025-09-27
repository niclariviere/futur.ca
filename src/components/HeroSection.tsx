import React, { useEffect, useState } from 'react';
const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToNext = () => {
    const nextSection = document.getElementById('shadows-section');
    nextSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/68d70fc5f56f108d4e4b2f69_1758924789529_0cea136a.webp')`,
      transform: `translateY(${scrollY * 0.5}px)`
    }} />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-2 tracking-wider" data-editor-uid="c330a49a-fe64-4d07-93e7-ea269cc87553" data-editor-name="h1" data-component-path="src/components/HeroSection.tsx" data-component-line="34" data-static="true" data-editor-content="%7B%22text%22%3A%22FUTUR%22%2C%22className%22%3A%22text-6xl%20md%3Atext-8xl%20font-bold%20text-white%20mb-2%20tracking-wider%22%7D">
            FUTUR
          </h1>
          <p className="text-2xl md:text-3xl font-light text-cyan-400 tracking-[0.5em] opacity-90" data-editor-uid="9a18d0a6-3aab-4788-a74b-09b3e7fbc3e4" data-editor-name="p" data-component-path="src/components/HeroSection.tsx" data-component-line="37" data-static="true" data-editor-content="%7B%22text%22%3A%22is%20yours%22%2C%22className%22%3A%22text-2xl%20md%3Atext-3xl%20font-light%20text-cyan-400%20tracking-%5B0.5em%5D%20opacity-90%22%7D">
            is yours
          </p>
        </div>
        
        <div className="space-y-6 text-lg md:text-xl text-gray-200 leading-relaxed mb-12">
          <p data-editor-uid="a2fa20a9-ffd2-49c3-b739-33ea14aab1c3" data-editor-name="p" data-component-path="src/components/HeroSection.tsx" data-component-line="43" data-static="true" data-editor-content="%7B%22text%22%3A%22In%20the%20neon-veiled%20sprawl%20of%20tomorrow's%20marketplace%2C%20you%E2%80%94the%20trailblazing%20captain%20of%20your%20small%20fleet%E2%80%94command%20a%20ship%20adrift%20in%20the%20data%20storm.%20Alerts%20cascade%20like%20rogue%20comets%3A%20invoices%20lost%20in%20the%20void%2C%20leads%20evaporating%20into%20ether%2C%20routines%20devouring%20your%20spark.%22%2C%22className%22%3A%22%22%7D">In the neon-veiled sprawl of tomorrow's marketplace, you
—the trailblazing captain of your small fleet—command a ship adrift in the data storm. Alerts cascade like rogue comets: invoices lost in the void, leads evaporating into ether, routines devouring your spark.</p>
          <p data-editor-uid="4577e5bd-4387-4ffb-9d99-3ce446070d21" data-editor-name="p" data-component-path="src/components/HeroSection.tsx" data-component-line="46" data-static="true" data-editor-content="%7B%22text%22%3A%22Your%20empire%20hums%20with%20potential%2C%20yet%20manual%20chains%20bind%20your%20crew%2C%20stifling%20the%20stars%20you%20were%20born%20to%20conquer.%22%2C%22className%22%3A%22%22%7D">
            Your empire hums with potential, yet manual chains bind your crew, stifling the stars you were born to conquer.
          </p>
          <p className="text-cyan-400 font-semibold" data-editor-uid="99834fa5-a34a-4361-bb02-88b8749bfda1" data-editor-name="p" data-component-path="src/components/HeroSection.tsx" data-component-line="49" data-static="true" data-editor-content="%7B%22text%22%3A%22But%20whispers%20echo%20from%20the%20grid%3A%20What%20if%20arcane%20allies%20could%20rewrite%20the%20code%20of%20chaos%3F%22%2C%22className%22%3A%22text-cyan-400%20font-semibold%22%7D">
            But whispers echo from the grid: What if arcane allies could rewrite the code of chaos?
          </p>
        </div>
        
        <button onClick={scrollToNext} className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white font-bold text-lg hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25">
          <span className="relative z-10" data-editor-uid="6570a952-7e30-4559-8a51-15a239507b81" data-editor-name="span" data-component-path="src/components/HeroSection.tsx" data-component-line="58" data-static="true" data-editor-content="%7B%22text%22%3A%22Scroll%20to%20Awaken%22%2C%22className%22%3A%22relative%20z-10%22%7D">Scroll to Awaken</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
        </button>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>;
};
export default HeroSection;