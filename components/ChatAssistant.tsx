
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Minimize2, Bot, Send, MoreHorizontal, User, Cpu } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  options?: { label: string; value: string }[];
};

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "System Online... 🟢\nNEXA 1337 AI Assistant initialized. How can I facilitate your experience?",
      sender: 'bot',
      options: [
        { label: "Track Order 📦", value: "track" },
        { label: "Shipping Policy 🌍", value: "shipping" },
        { label: "About NEXA ℹ️", value: "about" },
        { label: "Custom Design 🎨", value: "custom" },
        { label: "Human Support 👤", value: "support" }
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleOptionClick = (option: { label: string; value: string }) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      text: option.label,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let botText = "";
      let nextOptions: { label: string; value: string }[] | undefined = undefined;

      switch (option.value) {
        case 'track':
          botText = "Accessing logistics database...\n\nTracking links are sent via Email/WhatsApp upon dispatch. For real-time status, query our WhatsApp line.";
          nextOptions = [{ label: "Open WhatsApp", value: "whatsapp" }, { label: "Main Menu", value: "menu" }];
          break;
        
        case 'shipping':
          botText = "Global Logistics Protocol:\n\n✅ FREE Shipping Worldwide\n✅ Morocco (1-3 Days)\n✅ International (7-15 Days)\n\nWe utilize premium couriers for secure delivery.";
          nextOptions = [{ label: "Main Menu", value: "menu" }];
          break;
        
        case 'custom':
          botText = "Custom Protocol Initiated.\n\nNavigate to 'Add Custom Logo' on any product page to upload your assets. We handle the rest.";
          nextOptions = [{ label: "Bulk Order?", value: "bulk" }, { label: "Main Menu", value: "menu" }];
          break;
        
        case 'support':
          botText = "Support agents are online [09:00 - 18:00 GMT+1].\nConnecting you to secure channel...";
          nextOptions = [{ label: "Launch WhatsApp", value: "whatsapp" }, { label: "Send Email", value: "email" }];
          break;

        case 'about':
          botText = "NEXA 1337 // SYSTEM INFO\n\nSelect a data node to explore:";
          nextOptions = [
            { label: "Brand Identity", value: "what_is_nexa" },
            { label: "POD Masters", value: "what_is_pod" },
            { label: "The Founder", value: "owner" },
            { label: "Network Links", value: "links" },
            { label: "Main Menu", value: "menu" }
          ];
          break;

        case 'what_is_nexa':
          botText = "IDENTITY: NEXA1337\n\nAn elite digital brand fusing AI solutions, automation, and modern aesthetics.\n\nCORE:\n> Next-Gen Services\n> AI Automation\n> Digital Strategy\n\nNEXA = Next Era\n1337 = Elite Status";
          nextOptions = [{ label: "< Back", value: "about" }, { label: "Main Menu", value: "menu" }];
          break;

        case 'what_is_pod':
          botText = "MODULE: POD MASTERS\n\nWe operate a high-fidelity Print-On-Demand infrastructure based in Morocco.\n\nFEATURES:\n> Premium Fabric\n> DTF Printing\n> Global Fulfillment";
          nextOptions = [{ label: "< Back", value: "about" }, { label: "Main Menu", value: "menu" }];
          break;

        case 'owner':
          botText = "USER PROFILE: Marouan Anouar\nROLE: Founder / Architect\n\nA visionary entrepreneur leveraging AI and tech to build global digital infrastructures from Morocco.\n\nFOCUS:\n> Innovation\n> E-Commerce Automation\n> Future Tech";
          nextOptions = [{ label: "< Back", value: "about" }, { label: "Main Menu", value: "menu" }];
          break;

        case 'links':
          botText = "Retrieving Uplinks...\n\nAccess full network here: https://linktr.ee/nexa1337";
          nextOptions = [{ label: "Open Linktree", value: "open_linktree" }, { label: "< Back", value: "about" }];
          break;

        case 'open_linktree':
          window.open("https://linktr.ee/nexa1337", "_blank");
          botText = "Link opened in new tab.";
          nextOptions = [{ label: "Main Menu", value: "menu" }];
          break;

        case 'whatsapp':
          window.open("https://wa.me/212723242286", "_blank");
          botText = "Secure channel opened.";
          nextOptions = [{ label: "Main Menu", value: "menu" }];
          break;
        
        case 'email':
           window.location.href = "mailto:hello@nexa1337.ma";
           botText = "Mail client launched.";
           nextOptions = [{ label: "Main Menu", value: "menu" }];
           break;
        
        case 'menu':
          botText = "Main Menu loaded. Awaiting command.";
          nextOptions = [
            { label: "Track Order", value: "track" },
            { label: "Shipping Info", value: "shipping" },
            { label: "About NEXA", value: "about" },
            { label: "Custom Design", value: "custom" },
            { label: "Support", value: "support" }
          ];
          break;
        
        case 'bulk':
           botText = "B2B Protocol: We offer tier-based pricing for 10+ units. Contact sales channel directly.";
           nextOptions = [{ label: "Contact Sales", value: "whatsapp" }, { label: "Main Menu", value: "menu" }];
           break;
        
        default:
          botText = "Command not recognized. Rebooting menu...";
          nextOptions = [{ label: "Main Menu", value: "menu" }];
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        options: nextOptions
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[60] group flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180' : ''}`}
      >
        <div className={`relative flex items-center justify-center w-14 h-14 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 transition-all duration-300 ${isOpen ? 'bg-red-600/90' : 'bg-[#0a0a0a] hover:bg-black'}`}>
           {/* Pulse Ring */}
           <div className={`absolute inset-0 rounded-2xl blur-md opacity-50 transition-all duration-1000 ${isOpen ? 'bg-red-600' : 'bg-primary animate-pulse'}`}></div>
           
           {isOpen ? (
             <X className="text-white relative z-10" size={24} />
           ) : (
             <Cpu className="text-primary relative z-10 group-hover:text-white transition-colors" size={24} />
           )}
           
           {!isOpen && (
             <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full z-20 animate-ping-slow"></span>
           )}
        </div>
      </button>

      {/* Chat Terminal */}
      <div className={`fixed bottom-36 md:bottom-24 right-4 md:right-6 z-[60] w-[90vw] sm:w-[380px] h-[550px] max-h-[70vh] flex flex-col transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}>
        
        {/* Terminal Window */}
        <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
           
           {/* Terminal Header */}
           <div className="relative p-4 border-b border-white/5 bg-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                    <Bot size={20} className="text-primary relative z-10" />
                 </div>
                 <div>
                    <h3 className="text-white font-bold text-sm tracking-wider font-mono">NEXA_AI_CORE</h3>
                    <div className="flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                       <span className="text-[10px] text-gray-400 font-mono uppercase">v2.4 Online</span>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Minimize2 size={16} />
                 </button>
              </div>
           </div>

           {/* Messages Area */}
           <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in-up`}>
                   
                   {/* Sender Label */}
                   <span className="text-[9px] text-gray-500 mb-1 font-mono uppercase ml-1 tracking-wider">
                      {msg.sender === 'bot' ? 'SYSTEM RESPONSE' : 'USER INPUT'}
                   </span>

                   <div className={`max-w-[85%] p-4 text-sm leading-relaxed relative group ${
                      msg.sender === 'user' 
                        ? 'bg-white text-black rounded-2xl rounded-tr-none shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                        : 'bg-[#111] text-gray-300 border border-white/10 rounded-2xl rounded-tl-none'
                   }`}>
                      {msg.text.split('\n').map((line, i) => (
                         <React.Fragment key={i}>{line}<br/></React.Fragment>
                      ))}
                   </div>
                   
                   {/* Options Grid */}
                   {msg.sender === 'bot' && msg.options && messages.indexOf(msg) === messages.length - 1 && (
                      <div className="mt-3 flex flex-wrap gap-2 w-full max-w-[90%]">
                         {msg.options.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleOptionClick(opt)}
                              className="px-4 py-2 text-xs font-bold bg-black hover:bg-white/10 border border-white/20 hover:border-primary text-gray-300 hover:text-white rounded-lg transition-all text-center flex-grow"
                            >
                              {opt.label}
                            </button>
                         ))}
                      </div>
                   )}
                </div>
              ))}
              
              {isTyping && (
                 <div className="flex items-start animate-fade-in">
                    <div className="bg-[#111] border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5">
                       <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                       <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100"></span>
                       <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200"></span>
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
           </div>

           {/* Footer */}
           <div className="p-3 bg-black/60 border-t border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-2 bg-[#111] rounded-xl p-2 border border-white/5 opacity-60 cursor-not-allowed">
                 <div className="p-2 rounded-lg bg-white/5">
                    <MoreHorizontal size={16} className="text-gray-500" />
                 </div>
                 <input 
                   type="text" 
                   disabled
                   placeholder="Select command above..." 
                   className="bg-transparent border-none outline-none text-sm text-gray-500 flex-1 cursor-not-allowed font-mono"
                 />
                 <button disabled className="p-2 rounded-lg bg-primary/10 text-primary cursor-not-allowed">
                    <Send size={16} />
                 </button>
              </div>
              <div className="text-center mt-2">
                 <p className="text-[9px] text-gray-600 font-mono tracking-widest uppercase">Powered by N E X A 1337 Team</p>
              </div>
           </div>

        </div>
      </div>
    </>
  );
};

export default ChatAssistant;
