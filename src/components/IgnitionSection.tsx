import React, { useEffect, useState } from 'react';

const timelineData = [
  {
    title: "CONCEPTION",
    description: "We divine your saga's needs—scanning the grid for pain-points, sketching bot blueprints in quantum ink. Your vision, crystallized.",
    image: "https://d64gsuwffb70l.cloudfront.net/68d70fc5f56f108d4e4b2f69_1758924796949_1327a027.webp",
    color: "from-cyan-400 to-blue-500"
  },
  {
    title: "DEVELOPMENT", 
    description: "In our nebula labs, code coalesces into autonomous agents—learning your rhythms, wielding tools like extensions of your will. Seamless, scalable, yours.",
    image: "https://d64gsuwffb70l.cloudfront.net/68d70fc5f56f108d4e4b2f69_1758924798697_b1cd5db9.webp",
    color: "from-purple-400 to-pink-500"
  },
  {
    title: "MANAGEMENT",
    description: "Post-summoning, we guard the gate—tuning, evolving, ensuring your bots thrive in the flux. Eternal vigilance, zero drift.",
    image: "https://d64gsuwffb70l.cloudfront.net/68d70fc5f56f108d4e4b2f69_1758924800394_15279b0a.webp",
    color: "from-blue-500 to-purple-600"
  }
];

const IgnitionSection = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => [...prev, cardIndex]);
          }
        });
      },
      { threshold: 0.5 }
    );

    const cards = document.querySelectorAll('.timeline-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-purple-900/20 to-black py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
            Arcane Ignition
          </h2>
          
          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500" />
            
            {timelineData.map((item, index) => (
              <div
                key={index}
                data-index={index}
                className={`timeline-card relative mb-20 transition-all duration-1000 ${
                  visibleCards.includes(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
              >
                <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Content Card */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-cyan-400 transition-all duration-300 group">
                      <h3 className={`text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${item.color}`}>
                        {item.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {item.description}
                      </p>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  
                  {/* Timeline Node */}
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-full border-4 border-gray-900 bg-gradient-to-r ${item.color} flex items-center justify-center transition-all duration-500 ${
                      visibleCards.includes(index) ? 'scale-110 shadow-lg shadow-cyan-500/50' : 'scale-100'
                    }`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                    
                    {/* Particle Effects */}
                    {visibleCards.includes(index) && (
                      <>
                        <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-500 rounded-full animate-ping delay-300" />
                        <div className="absolute top-1/2 -left-4 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-600" />
                        <div className="absolute top-1/2 -right-4 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-900" />
                      </>
                    )}
                  </div>
                  
                  {/* Spacer for opposite side */}
                  <div className="w-5/12" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom Message */}
          <div className="text-center mt-16">
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Watch your ship surge: Leads harvested by phantom scouts, ops streamlined to light-speed, you—freed to chart uncharted stars.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IgnitionSection;