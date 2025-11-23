
import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

interface HeroProps {
  onCreateCustom: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCreateCustom }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Calculate normalized position (-1 to 1)
    const x = ((e.clientX - left) / width) * 2 - 1;
    const y = ((e.clientY - top) / height) * 2 - 1;
    
    setMousePos({ x, y });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePos({ x: 0, y: 0 });
  };

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  // Smooth lerp for rotation
  const rotateX = isHovering ? mousePos.y * -8 : 0;
  const rotateY = isHovering ? mousePos.x * 8 : 0;

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen bg-[#030303] text-white overflow-hidden font-sans flex items-center justify-center pt-24 lg:pt-0"
    >
      {/* --- Clean Background Environment --- */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#050505] to-[#000000]"></div>
         
         {/* Soft Spotlights */}
         <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]"></div>
         
         {/* Subtle Noise Texture */}
         <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
         }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* --- LEFT: Clean Typography --- */}
        <div className="space-y-10 text-center lg:text-left order-2 lg:order-1 animate-fade-in-up">
           
           <div className="space-y-2">
              <div className="inline-flex items-center gap-3 mb-2">
                <span className="h-[1px] w-10 bg-indigo-500"></span>
                <span className="text-indigo-400 font-mono text-xs uppercase tracking-[0.3em]">Moroccan Origin // Global Reach</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white">
                 FUTURE
                 <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">READY</span>
              </h1>
           </div>

           <div className="space-y-6">
             <p className="text-xl md:text-2xl font-medium text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                We are in <span className="text-white font-bold relative inline-block">
                  Morocco
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-indigo-500"></span>
                </span> and <br/> 
                <span className="text-gray-400">all over the world.</span>
             </p>
             
             <p className="text-sm text-gray-500 max-w-md mx-auto lg:mx-0 leading-loose">
               Experience the fusion of premium heavyweight cotton and high-fidelity digital printing. Designed in Casablanca, shipped globally.
             </p>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-2">
              <button 
                onClick={scrollToProducts}
                className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
              >
                 Explore Drop <ArrowRight size={18} />
              </button>
              <button 
                onClick={onCreateCustom}
                className="px-10 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-all flex items-center justify-center gap-2 backdrop-blur-sm group"
              >
                 <Sparkles size={18} className="text-indigo-400 group-hover:text-indigo-300 transition-colors"/> Custom Lab
              </button>
           </div>
        </div>

        {/* --- RIGHT: 3D Hoodie Mockup --- */}
        <div className="relative h-[500px] md:h-[700px] flex items-center justify-center order-1 lg:order-2 perspective-container">
           
           {/* 3D Container */}
           <div 
             className="relative w-full max-w-[550px] aspect-[3/4] transition-transform duration-100 ease-out preserve-3d"
             style={{
               transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
             }}
           >
              {/* Glow behind product */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-white/5 blur-[80px] rounded-full"></div>

              {/* Hoodie Image Layer */}
              <div className="absolute inset-0 z-10 transform translate-z-[20px]">
                 <img 
                   src="https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?q=80&w=2187&auto=format&fit=crop" 
                   alt="NEXA Hoodie Black"
                   className="w-full h-full object-contain drop-shadow-2xl filter brightness-[0.85] contrast-[1.1]" 
                 />
              </div>

              {/* LOGO PRINTING LAYER */}
              {/* This div simulates the print on the chest area */}
              <div 
                className="absolute top-[28%] left-1/2 -translate-x-1/2 w-full z-20 flex flex-col items-center justify-center transform translate-z-[35px]"
                style={{
                   // Slight parallax effect for the logo
                   transform: `translateZ(35px) translateX(-50%) rotateX(${rotateX * 0.1}deg)`,
                }}
              >
                 <div className="relative flex flex-col items-center">
                    {/* N E X A */}
                    <h2 
                      className="text-4xl md:text-6xl font-black text-[#e5e5e5] tracking-[0.6em] md:tracking-[0.8em] leading-none text-center mix-blend-overlay opacity-90 select-none"
                      style={{ 
                        textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
                        filter: 'blur(0.3px)' // Slight blur to simulate ink bleed
                      }}
                    >
                      NEXA
                    </h2>
                    
                    {/* 1 3 3 7 */}
                    <h3 
                      className="text-2xl md:text-4xl font-bold text-[#a3a3a3] tracking-[0.8em] md:tracking-[1.2em] mt-3 md:mt-5 text-center mix-blend-overlay opacity-70 select-none"
                    >
                      1337
                    </h3>

                    {/* Fabric Texture Overlay on Logo */}
                    <div className="absolute inset-0 bg-black opacity-10 mix-blend-multiply pointer-events-none"></div>
                 </div>
              </div>

              {/* "Interactive" Hint */}
              <div className="absolute bottom-[15%] right-[10%] translate-z-[60px] animate-bounce hidden lg:flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300">Interactive 3D</span>
              </div>

           </div>
        </div>

      </div>

      {/* Custom Styles */}
      <style>{`
        .perspective-container {
          perspective: 1200px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .translate-z-\[20px\] { transform: translateZ(20px); }
        .translate-z-\[35px\] { transform: translateZ(35px); }
        .translate-z-\[60px\] { transform: translateZ(60px); }
      `}</style>
    </section>
  );
};

export default Hero;
