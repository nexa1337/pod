
import React, { useState } from 'react';
import { PenTool, Mail, MapPin, Send, Facebook, Instagram, Linkedin, Download, Plus, Minus, Users, Globe, Award, ArrowRight, Hash, Sparkles, Palette, Truck, Phone, Clock, Camera, Video, X, Box, Activity, Server, Cpu, Wifi, Database, Star, CheckCircle, Quote } from 'lucide-react';
import { BLOG_POSTS } from '../data';

interface CustomLogoSectionProps {
  onStartCustom?: () => void;
}

export const CustomLogoSection: React.FC<CustomLogoSectionProps> = ({ onStartCustom }) => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section id="custom" className="py-24 relative overflow-hidden bg-gray-900">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="mr-2" /> Premium Customization
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
              Your Design. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Your Rules.
              </span>
            </h2>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Stand out from the crowd. Whether it's for your brand, a special event, or just personal style, 
              we bring your vision to life with high-fidelity printing on premium fabrics.
            </p>

            <div className="flex flex-wrap gap-4">
              {onStartCustom && (
                <button 
                  onClick={onStartCustom}
                  className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center"
                >
                  Start Custom Order <ArrowRight size={18} className="ml-2" />
                </button>
              )}
              <button 
                onClick={scrollToContact}
                className="px-8 py-4 bg-transparent border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Bulk Orders
              </button>
            </div>
          </div>

          {/* Visual Steps */}
          <div className="grid grid-cols-1 gap-6">
            {[
              { icon: Palette, title: "1. Choose Your Gear", desc: "Pick any product from our premium catalog." },
              { icon: PenTool, title: "2. Upload Design", desc: "Toggle 'Custom Logo' and attach your artwork." },
              { icon: Truck, title: "3. We Deliver", desc: "Fast production and shipping to your door." }
            ].map((step, idx) => (
              <div key={idx} className="flex items-start p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                  <step.icon className="text-white" size={20} />
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export const ClientReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: "Oussama Benali",
      location: "Casablanca, Morocco",
      flag: "🇲🇦",
      role: "Verified Buyer",
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60",
      rating: 5,
      text: "Incroyable la qualité. Le tissu est lourd (heavyweight) et le print ne bouge pas au lavage. J'ai pris le hoodie 'NEXA' et franchement c'est niveau international. Recommandé à 100%."
    },
    {
      id: 2,
      name: "Jessica Miller",
      location: "New York, USA",
      flag: "🇺🇸",
      role: "Verified Buyer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60",
      rating: 5,
      text: "Was skeptical about ordering internationally but the tracking was on point. The hoodie fits perfectly oversized, and the puff print texture is insane. Will order again."
    },
    {
      id: 3,
      name: "Yassine El Idrissi",
      location: "Marrakech, Morocco",
      flag: "🇲🇦",
      role: "Custom Order",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60",
      rating: 5,
      text: "Service client top! J'ai demandé un logo personnalisé pour mon équipe gaming et le résultat est magnifique. Livraison rapide via Amana."
    },
    {
      id: 4,
      name: "Lucas Dubois",
      location: "Paris, France",
      flag: "🇫🇷",
      role: "Verified Buyer",
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&auto=format&fit=crop&q=60",
      rating: 5,
      text: "La coupe est parfaite. C'est rare de trouver du streetwear de cette qualité à ce prix. Shipping to Paris took about 5 days via DHL. Très satisfait."
    },
    {
      id: 5,
      name: "Fatima Zahra",
      location: "Tangier, Morocco",
      flag: "🇲🇦",
      role: "Verified Buyer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60",
      rating: 4.8,
      text: "Livraison rapide sur Tanger (2 jours). Le packaging est propre et minimaliste. Merci NEXA pour le petit cadeau avec la commande!"
    },
    {
      id: 6,
      name: "David Chen",
      location: "Singapore",
      flag: "🇸🇬",
      role: "Verified Buyer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
      rating: 5,
      text: "Shipping took about 10 days to Singapore. Worth the wait for this quality. The attention to detail on the embroidery is legit."
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#080808] relative overflow-hidden transition-colors">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 text-xs font-bold uppercase tracking-wider mb-4">
             <CheckCircle size={12} className="mr-2" /> Client Verification
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Global <span className="text-primary">Trust</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            From the streets of Casablanca to major cities worldwide. See what our community is saying about the drop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="group relative bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              
              {/* Quote Icon Background */}
              <div className="absolute top-6 right-8 text-gray-200 dark:text-gray-800 opacity-50 group-hover:text-primary/20 transition-colors">
                 <Quote size={60} fill="currentColor" />
              </div>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                 <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
                    <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{review.name}</h4>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                       <span className="mr-2">{review.flag} {review.location}</span>
                       {review.role === "Verified Buyer" && (
                          <span className="flex items-center text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                             <CheckCircle size={10} className="mr-1" /> Verified
                          </span>
                       )}
                    </div>
                 </div>
              </div>

              <div className="flex text-yellow-400 mb-4 space-x-1">
                 {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.floor(review.rating) ? "currentColor" : "none"} 
                      className={i < Math.floor(review.rating) ? "" : "text-gray-300 dark:text-gray-700"}
                    />
                 ))}
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm font-medium relative z-10">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
           <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-mono">
              <Activity size={14} className="animate-pulse text-green-500"/>
              <span>Last review updated 2 hours ago</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export const AboutSection: React.FC = () => (
  <section id="about" className="py-24 bg-gray-50 dark:bg-dark transition-colors">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
          Bridging <span className="text-primary">Culture</span> & <span className="text-primary">Streetwear</span>
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
          NEXA 1337 isn't just a brand; it's a movement. Born in Casablanca, raised on the internet, 
          and worn globally. We merge traditional Moroccan craftsmanship with modern urban aesthetics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Users, title: "Community Driven", desc: "Empowering local artists to reach a global stage." },
          { icon: Globe, title: "Global Shipping", desc: "From Casablanca to New York, we ship worldwide." },
          { icon: Award, title: "Premium Quality", desc: "Sustainable materials meets cutting-edge print tech." }
        ].map((item, i) => (
          <div key={i} className="group relative p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/20 hover:-translate-y-2 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <item.icon size={28} className="text-gray-900 dark:text-white group-hover:text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const GlobalMapSection: React.FC = () => {
  const [activeHub, setActiveHub] = useState<string>('ma');

  const locations = [
    { name: 'Morocco (HQ)', id: 'ma', region: 'Africa', status: 'Online', latency: '1ms' },
    { name: 'USA', id: 'us', region: 'Americas', status: 'Active', latency: '45ms' },
    { name: 'UK', id: 'gb', region: 'Europe', status: 'Active', latency: '28ms' },
    { name: 'Spain', id: 'es', region: 'Europe', status: 'Active', latency: '15ms' },
    { name: 'France', id: 'fr', region: 'Europe', status: 'Active', latency: '18ms' },
    { name: 'Dubai', id: 'ae', region: 'Middle East', status: 'Hub', latency: '55ms' },
    { name: 'Qatar', id: 'qa', region: 'Middle East', status: 'Active', latency: '58ms' },
    { name: 'Mexico', id: 'mx', region: 'Americas', status: 'Active', latency: '60ms' },
    { name: 'Japan', id: 'jp', region: 'Asia', status: 'Node', latency: '120ms' },
    { name: 'China', id: 'cn', region: 'Asia', status: 'Active', latency: '110ms' },
    { name: 'South Korea', id: 'kr', region: 'Asia', status: 'Active', latency: '115ms' },
    { name: 'South Africa', id: 'za', region: 'Africa', status: 'Node', latency: '90ms' },
  ];

  return (
    <section className="py-24 bg-[#050505] text-white relative overflow-hidden border-t border-white/5 font-sans">
       {/* Background Matrix Effect */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,30,30,0.5)_0%,_rgba(5,5,5,1)_100%)]"></div>
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>

       <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
             
             {/* Left: Command Interface */}
             <div className="lg:col-span-5 space-y-10">
                <div>
                   <div className="inline-flex items-center space-x-3 text-primary font-mono text-xs uppercase tracking-[0.3em] mb-6 border border-primary/20 bg-primary/5 px-3 py-1 rounded">
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </div>
                      <span>Network Status: Optimal</span>
                   </div>
                   <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none mb-6 tracking-tighter">
                      THE N E X A <br/>
                      <span className="text-gray-600">NETWORK</span>
                   </h2>
                   <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light max-w-md">
                      A decentralized logistics grid. From our Morocco HQ to global nodes, we ensure high-velocity delivery with real-time tracking.
                   </p>
                </div>

                {/* Server Status List */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-xs font-mono text-gray-500 uppercase tracking-wider border-b border-white/10 pb-2">
                      <span>Node ID</span>
                      <span>Latency</span>
                      <span>Status</span>
                   </div>
                   <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent pr-2">
                     {locations.map((loc) => (
                        <div 
                           key={loc.id}
                           onMouseEnter={() => setActiveHub(loc.id)}
                           className={`group flex items-center justify-between p-3 rounded border transition-all cursor-pointer ${activeHub === loc.id ? 'bg-white/10 border-primary/50' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                        >
                           <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full transition-all ${loc.id === 'ma' ? 'animate-pulse bg-primary' : ''} ${activeHub === loc.id ? 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.8)] scale-125' : 'bg-gray-700'}`}></div>
                              <span className={`font-bold text-sm ${activeHub === loc.id ? 'text-white' : 'text-gray-400'}`}>{loc.name}</span>
                           </div>
                           <span className="font-mono text-xs text-gray-600">{loc.latency}</span>
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${loc.status === 'Online' ? 'bg-green-500/20 text-green-400' : loc.status === 'Hub' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {loc.status}
                           </span>
                        </div>
                     ))}
                   </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                    <div>
                       <div className="text-xl md:text-2xl font-black text-white font-mono">98%</div>
                       <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">Coverage</div>
                    </div>
                    <div>
                       <div className="text-xl md:text-2xl font-black text-white font-mono">24/7</div>
                       <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">Uptime</div>
                    </div>
                    <div>
                       <div className="text-xl md:text-2xl font-black text-white font-mono">&lt;24h</div>
                       <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">Dispatch</div>
                    </div>
                </div>
             </div>

             {/* Right: The Orbital Visualization (No Map Image) */}
             <div className="lg:col-span-7 flex items-center justify-center relative h-[400px] md:h-[500px]">
                
                {/* Core Glow */}
                <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
                
                {/* The Orbital System Container - Scaled down on Mobile */}
                <div className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] flex items-center justify-center perspective-1000 transform scale-75 md:scale-100 origin-center transition-transform duration-500">
                   
                   {/* Center Hub (Morocco) */}
                   <div className="relative z-20 w-24 h-24 rounded-full bg-black border border-primary/30 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.3)] group cursor-pointer hover:scale-110 transition-transform">
                      <div className="absolute inset-0 rounded-full border-2 border-primary opacity-40 animate-ping"></div>
                      <div className="absolute inset-0 rounded-full border border-primary opacity-20 animate-ping delay-75"></div>
                      <Globe size={40} className="text-primary animate-pulse" strokeWidth={1} />
                      <div className="absolute -bottom-8 text-center">
                         <span className="text-xs font-bold text-white bg-black/80 px-2 py-1 rounded border border-white/10 whitespace-nowrap">HQ: MOROCCO</span>
                      </div>
                   </div>

                   {/* Orbit Ring 1: Europe (Small) */}
                   <div className="absolute w-[200px] h-[200px] rounded-full border border-white/10 animate-spin-slow border-dashed">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black border border-white/50 rounded-full flex items-center justify-center group">
                         <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                         {/* Tooltip */}
                         <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white bg-black px-2 py-1 rounded whitespace-nowrap">
                            Paris Node
                         </div>
                      </div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-black border border-white/50 rounded-full flex items-center justify-center group">
                         <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                         <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white bg-black px-2 py-1 rounded whitespace-nowrap">
                            London Node
                         </div>
                      </div>
                   </div>

                   {/* Orbit Ring 2: Middle East/Asia (Medium) */}
                   <div className="absolute w-[320px] h-[320px] rounded-full border border-white/5 animate-spin-slow [animation-direction:reverse] [animation-duration:20s]">
                      <div className="absolute top-1/4 left-[6%] w-3 h-3 bg-black border border-blue-400 rounded-full group">
                         <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 text-[10px] text-blue-400 font-bold">Dubai</div>
                      </div>
                      <div className="absolute bottom-1/4 right-[6%] w-3 h-3 bg-black border border-blue-400 rounded-full group">
                         <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 text-[10px] text-blue-400 font-bold">Tokyo</div>
                      </div>
                   </div>

                   {/* Orbit Ring 3: Americas (Large) */}
                   <div className="absolute w-[450px] h-[450px] rounded-full border border-white/5 animate-spin-slow [animation-duration:30s]">
                      <div className="absolute top-1/2 right-[-6px] w-5 h-5 bg-black border border-green-500 rounded-full flex items-center justify-center group shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                         <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                         <div className="absolute right-full mr-3 opacity-0 group-hover:opacity-100 text-xs font-bold text-green-400 whitespace-nowrap bg-black/90 px-2 py-1 rounded border border-green-500/30">
                            New York Hub
                         </div>
                      </div>
                      <div className="absolute top-1/2 left-[-6px] w-4 h-4 bg-black border border-green-500 rounded-full flex items-center justify-center group">
                         <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                         <div className="absolute left-full ml-3 opacity-0 group-hover:opacity-100 text-xs font-bold text-green-400 whitespace-nowrap bg-black/90 px-2 py-1 rounded border border-green-500/30">
                            Mexico City
                         </div>
                      </div>
                   </div>

                   {/* Decorative Data Lines */}
                   <div className="absolute inset-0 pointer-events-none opacity-20">
                      <svg className="w-full h-full">
                         <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="currentColor" className="text-primary" strokeWidth="1" />
                         <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="currentColor" className="text-primary" strokeWidth="1" />
                         <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="currentColor" className="text-white" strokeWidth="0.5" strokeDasharray="5,5" />
                      </svg>
                   </div>

                </div>

                {/* Floating UI Elements */}
                <div className="absolute top-0 right-0 bg-black/50 backdrop-blur border border-white/10 p-3 rounded-lg flex flex-col items-end">
                   <span className="text-[10px] text-gray-400 uppercase tracking-widest">Encryption</span>
                   <span className="text-xs font-bold text-green-400 font-mono">AES-256 ENABLED</span>
                </div>

                <div className="absolute bottom-0 left-0 bg-black/50 backdrop-blur border border-white/10 p-3 rounded-lg">
                   <div className="flex items-center space-x-2">
                      <Wifi size={14} className="text-primary animate-pulse" />
                      <span className="text-xs font-bold text-white font-mono">LIVE SIGNAL</span>
                   </div>
                </div>

             </div>

          </div>
       </div>
    </section>
  );
};

export const SocialMediaSection: React.FC = () => {
  const hashtags = [
    "#NEXA1337", "#StreetWear", "#CasablancaStyle", "#CustomPrint", "#UrbanFashion", 
    "#MoroccoDrip", "#MadeInMorocco", "#GlobalShipping", "#DailyFits", "#OOTD"
  ];

  const galleryImages = [
    { src: "https://picsum.photos/400/400?random=101", icon: Instagram, user: "@street_king" },
    { src: "https://picsum.photos/400/600?random=102", icon: Video, user: "@urban.vibes" }, // Portrait
    { src: "https://picsum.photos/400/400?random=103", icon: Instagram, user: "@casa_fashion" },
    { src: "https://picsum.photos/400/400?random=104", icon: Camera, user: "@morocco.style" },
    { src: "https://picsum.photos/400/400?random=105", icon: Instagram, user: "@drip_check" },
    { src: "https://picsum.photos/400/600?random=106", icon: Video, user: "@night.rider" }, // Portrait
    { src: "https://picsum.photos/400/400?random=107", icon: Instagram, user: "@pod_fan" },
    { src: "https://picsum.photos/400/400?random=108", icon: Camera, user: "@daily.fit" },
  ];

  return (
    <section className="bg-white dark:bg-dark pb-0 pt-16 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
         <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            <Instagram size={12} className="mr-2" /> Join the movement
         </div>
         <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Seen on Social</h2>
         <p className="text-gray-500 dark:text-gray-400">Tag us @NEXA1337 to get featured.</p>
      </div>

      {/* Masonry-like Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2">
        {galleryImages.map((item, idx) => (
          <div key={idx} className="relative group overflow-hidden cursor-pointer aspect-square md:aspect-auto md:h-80">
            <img 
              src={item.src} 
              alt="Social media post" 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
               <item.icon size={32} className="text-white mb-2 drop-shadow-lg" />
               <span className="text-white font-bold text-sm tracking-wide drop-shadow-md">{item.user}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Marquee Strip */}
      <div className="py-8 bg-black overflow-hidden border-y border-gray-800 relative z-10">
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex space-x-8">
            {/* Duplicate list to create seamless loop */}
            {[...hashtags, ...hashtags, ...hashtags].map((tag, idx) => (
              <span 
                key={idx} 
                className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800 hover:from-primary hover:to-purple-500 transition-all duration-300 cursor-default select-none"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: "Do you ship internationally?", a: "Yes! We offer worldwide shipping. Delivery times vary: 3-7 days for Europe, 7-14 days for USA/Canada, and up to 21 days for other regions." },
    { q: "How does Cash on Delivery work in Morocco?", a: "Simply place your order, select COD at checkout, and pay our courier when your package arrives. Available in all major cities." },
    { q: "Can I return a custom item?", a: "Custom items are made uniquely for you, so we cannot accept returns unless there is a manufacturing defect or printing error." },
    { q: "What file format should I use for my logo?", a: "For best results, use a transparent PNG file with at least 300 DPI resolution. We also support high-quality JPEGs." }
  ];

  return (
    <section className="py-24 bg-white dark:bg-dark">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Frequency Asked Questions</h2>
          <p className="text-gray-500 dark:text-gray-400">Everything you need to know about ordering with us.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === idx 
                  ? 'bg-gray-50 dark:bg-gray-800/50 border-primary/30 shadow-lg' 
                  : 'bg-white dark:bg-dark-card border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className={`font-bold text-lg ${openIndex === idx ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                  {faq.q}
                </span>
                <span className={`ml-4 p-2 rounded-full transition-colors ${openIndex === idx ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                  {openIndex === idx ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-6 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const BlogSection: React.FC = () => (
  <section id="blog" className="py-24 bg-gray-50 dark:bg-dark/50 transition-colors">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Latest Stories</h2>
          <p className="text-gray-500 dark:text-gray-400">Trends, insights, and behind the scenes.</p>
        </div>
        <button className="hidden md:flex items-center text-primary font-bold hover:text-indigo-600 transition-colors">
          View all posts <ArrowRight size={18} className="ml-2" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map(post => (
          <article key={post.id} className="group cursor-pointer flex flex-col h-full">
            <div className="relative overflow-hidden rounded-2xl mb-5 aspect-video shadow-lg">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
              <img 
                src={post.thumbnail} 
                alt={post.title} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 z-20">
                {post.date}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors leading-tight">
              {post.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
              {post.excerpt}
            </p>
            <span className="text-primary font-bold text-sm flex items-center mt-auto group-hover:translate-x-2 transition-transform">
              Read Story <ArrowRight size={14} className="ml-1" />
            </span>
          </article>
        ))}
      </div>
      
      <button className="md:hidden w-full mt-8 py-3 border border-gray-300 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-300">
        View all posts
      </button>
    </div>
  </section>
);

export const ContactSection: React.FC = () => {
    const [form, setForm] = useState({name: '', email: '', msg: ''});

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        const text = `Name: ${form.name}\nEmail: ${form.email}\nMsg: ${form.msg}`;
        window.open(`https://wa.me/1234567890?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
      <section id="contact" className="py-24 relative overflow-hidden bg-white dark:bg-dark">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left Info */}
            <div className="space-y-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                  Let's Create <br/> Something <span className="text-primary">Together</span>.
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                  Have a question about an order, a collaboration idea, or just want to say hi? We'd love to hear from you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                   <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                     <MapPin size={20} />
                   </div>
                   <div className="ml-4">
                     <h4 className="text-lg font-bold text-gray-900 dark:text-white">Headquarters</h4>
                     <p className="text-gray-500 dark:text-gray-400">123 Boulevard Anfa, Casablanca, Morocco</p>
                   </div>
                </div>
                
                <div className="flex items-start">
                   <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-400">
                     <Mail size={20} />
                   </div>
                   <div className="ml-4">
                     <h4 className="text-lg font-bold text-gray-900 dark:text-white">Email Us</h4>
                     <p className="text-gray-500 dark:text-gray-400">hello@nexa1337.ma</p>
                   </div>
                </div>

                <div className="flex items-start">
                   <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400">
                     <Phone size={20} />
                   </div>
                   <div className="ml-4">
                     <h4 className="text-lg font-bold text-gray-900 dark:text-white">Call Us</h4>
                     <p className="text-gray-500 dark:text-gray-400">+212 600 123 456</p>
                     <p className="text-xs text-gray-400 mt-1">Mon-Fri from 9am to 6pm</p>
                   </div>
                </div>

                {/* Google Maps Embed */}
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 h-64 w-full relative mt-8">
                   <iframe 
                     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.4843133525856!2d-6.832365123974332!3d34.03144567316485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b146a4caac9%3A0xdc0f711f384b0c52!2sN%20E%20X%20A%201337%20-%20Digital%20Agency!5e0!3m2!1sfr!2sma!4v1763738822449!5m2!1sfr!2sma" 
                     width="100%" 
                     height="100%" 
                     style={{border:0}} 
                     allowFullScreen={true} 
                     loading="lazy" 
                     referrerPolicy="no-referrer-when-downgrade"
                     className="absolute inset-0 w-full h-full"
                   ></iframe>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-gray-50 dark:bg-dark-card p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 h-fit">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h3>
              <form onSubmit={handleSend} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                  <input 
                    className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input 
                    className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                    placeholder="john@example.com"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea 
                    className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all h-32 resize-none shadow-sm"
                    placeholder="How can we help you?"
                    value={form.msg}
                    onChange={e => setForm({...form, msg: e.target.value})}
                  ></textarea>
                </div>
                <button className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-lg flex justify-center items-center transform hover:scale-[1.02]">
                   <Send size={18} className="mr-2"/> Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    );
}

export const Footer: React.FC = () => {
  const [policyModal, setPolicyModal] = useState<{isOpen: boolean, title: string, content: string}>({
      isOpen: false, title: '', content: ''
  });

  const openPolicy = (type: string) => {
      let title = '';
      let content = '';
      switch(type) {
          case 'shipping':
             title = 'Shipping Policy';
             content = 'We utilize local couriers for Moroccan orders (1-3 days). International orders are shipped via DHL/FedEx: Europe (3-7 days), North America (7-14 days), Rest of World (up to 21 days). Processing time is 1-2 business days.';
             break;
          case 'returns':
             title = 'Returns & Exchanges';
             content = 'We offer a 14-day return policy for defective or damaged items. As many of our products are printed on demand or custom-made, we cannot accept returns for sizing issues or change of mind. Please check the size guide carefully.';
             break;
          case 'privacy':
             title = 'Privacy Policy';
             content = 'Your privacy is critical. We only collect information necessary to process your order and improve your experience. We do not sell your data to third parties. Payments are processed securely via encrypted gateways.';
             break;
          case 'terms':
             title = 'Terms of Service';
             content = 'By using NEXA 1337, you agree to our terms. All designs are intellectual property of NEXA 1337 or their respective artists. Unauthorized reproduction is prohibited.';
             break;
      }
      setPolicyModal({isOpen: true, title, content});
  };

  const handleScroll = (id: string) => {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
  };

  return (
    <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800 font-sans pb-24 md:pb-16 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div>
            <div className="text-3xl font-black text-white italic mb-6 tracking-widest leading-none">
              N E X A <span className="text-primary">1337</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Elevating street style with premium, custom-made apparel delivered to your doorstep. 
              Quality you can feel, designs you can trust.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/nexa1337" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors">
                <Instagram size={18}/>
              </a>
              <a href="https://www.linkedin.com/in/nexa1337" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Linkedin size={18}/>
              </a>
              <a href="https://tiktok.com/@nexa.1337" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-black hover:text-white transition-colors group border border-gray-700 hover:border-white">
                 {/* Simple Custom TikTok SVG */}
                 <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => handleScroll('home')} className="hover:text-primary transition-colors flex items-center text-left"><ArrowRight size={12} className="mr-2"/> Home</button></li>
              <li><button onClick={() => handleScroll('products')} className="hover:text-primary transition-colors flex items-center text-left"><ArrowRight size={12} className="mr-2"/> Shop Collection</button></li>
              <li><button onClick={() => handleScroll('about')} className="hover:text-primary transition-colors flex items-center text-left"><ArrowRight size={12} className="mr-2"/> About Us</button></li>
              <li><button onClick={() => handleScroll('custom')} className="hover:text-primary transition-colors flex items-center text-left"><ArrowRight size={12} className="mr-2"/> Custom Orders</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://wa.me/212723242286?text=Hello%20NEXA%20Team%2C%20I%20would%20like%20to%20track%20my%20order." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center"
                >
                  Track Your Order
                </a>
              </li>
              <li><button onClick={() => openPolicy('shipping')} className="hover:text-primary transition-colors text-left w-full">Shipping Policy</button></li>
              <li><button onClick={() => openPolicy('returns')} className="hover:text-primary transition-colors text-left w-full">Returns & Exchanges</button></li>
              <li><button onClick={() => openPolicy('privacy')} className="hover:text-primary transition-colors text-left w-full">Privacy Policy</button></li>
              <li><button onClick={() => openPolicy('terms')} className="hover:text-primary transition-colors text-left w-full">Terms of Service</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Get the App</h4>
            <p className="text-sm mb-4">Shop faster and get exclusive in-app offers.</p>
            <div className="space-y-3">
               <div className="bg-gray-800 p-3 rounded-xl flex items-center cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700">
                 <Download size={20} className="mr-3"/> 
                 <div>
                   <div className="text-[10px] uppercase font-bold text-gray-400">Download on the</div>
                   <div className="text-sm font-bold text-white">App Store</div>
                 </div>
               </div>
               <div className="bg-gray-800 p-3 rounded-xl flex items-center cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700">
                 <Download size={20} className="mr-3"/> 
                 <div>
                   <div className="text-[10px] uppercase font-bold text-gray-400">Get it on</div>
                   <div className="text-sm font-bold text-white">Google Play</div>
                 </div>
               </div>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2024 NEXA 1337 S.A.R.L. All rights reserved.</p>
          <div className="flex space-x-6">
            <button onClick={() => openPolicy('privacy')} className="hover:text-white">Privacy</button>
            <button onClick={() => openPolicy('terms')} className="hover:text-white">Terms</button>
            <button onClick={() => handleScroll('home')} className="hover:text-white">Sitemap</button>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {policyModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPolicyModal({...policyModal, isOpen: false})}></div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl max-w-lg w-full relative z-10 animate-fade-in-up shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{policyModal.title}</h3>
                    <button onClick={() => setPolicyModal({...policyModal, isOpen: false})} className="text-gray-500 hover:text-red-500 bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                        <X size={20} />
                    </button>
                </div>
                <div className="prose dark:prose-invert">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">{policyModal.content}</p>
                </div>
                <button 
                  onClick={() => setPolicyModal({...policyModal, isOpen: false})} 
                  className="mt-8 w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
            </div>
        </div>
      )}
    </footer>
  );
};
