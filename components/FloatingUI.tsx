
import React from 'react';

interface FloatingUIProps {
  lang: 'EN' | 'RU';
  setLang: (lang: 'EN' | 'RU') => void;
}

const FloatingUI: React.FC<FloatingUIProps> = ({ lang, setLang }) => {
  const navItems = lang === 'EN' ? [
    { label: 'IDX', id: 'hero' },
    { label: 'STK', id: 'stack' },
    { label: 'ACT', id: 'active' },
    { label: 'BIO', id: 'bio' },
    { label: 'WKS', id: 'projects' },
    { label: 'CON', id: 'contact' }
  ] : [
    { label: 'ГЛВ', id: 'hero' },
    { label: 'СТК', id: 'stack' },
    { label: 'АКТ', id: 'active' },
    { label: 'БИО', id: 'bio' },
    { label: 'ПРК', id: 'projects' },
    { label: 'КОН', id: 'contact' }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6 md:p-12">
      {/* Top Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex flex-col items-start">
          <div className="inline-block border-b border-white/20 pb-1">
            <div className="text-xl md:text-3xl font-serif italic tracking-tighter leading-none text-white uppercase">
              KARACHKOV
            </div>
          </div>
          <div className="text-[12px] md:text-[14px] font-bold tracking-[0.25em] text-cyan-400 mt-2 uppercase">
            ARTEM & VLAD
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="h-1 w-1 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-[7px] md:text-[8px] tracking-[0.4em] opacity-40 uppercase font-mono whitespace-nowrap text-white">
              {lang === 'EN' ? 'Status: Active' : 'Статус: Активен'}
            </span>
          </div>
        </div>

        {/* Minimal Pill Language Switcher */}
        <div className="flex bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 relative overflow-hidden h-9 w-24 md:h-10 md:w-32 items-center">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full transition-transform duration-500 ease-in-out ${lang === 'RU' ? 'translate-x-[calc(100%+2px)]' : 'translate-x-[2px]'}`}
          />
          <button 
            onClick={() => setLang('EN')}
            className={`relative z-10 flex-1 text-[9px] md:text-[10px] font-mono font-bold tracking-widest transition-colors duration-500 ${lang === 'EN' ? 'text-black' : 'text-white/40'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('RU')}
            className={`relative z-10 flex-1 text-[9px] md:text-[10px] font-mono font-bold tracking-widest transition-colors duration-500 ${lang === 'RU' ? 'text-black' : 'text-white/40'}`}
          >
            RU
          </button>
        </div>
        
        <div className="hidden lg:flex gap-8 items-center bg-black/40 backdrop-blur-xl px-6 py-3 border border-white/5 rounded-full">
           <div className="flex flex-col items-end">
              <span className="text-[7px] font-mono opacity-30 uppercase tracking-widest text-white">{lang === 'EN' ? 'Build' : 'Сборка'}</span>
              <span className="text-[9px] font-mono text-cyan-400">V4.2.0</span>
           </div>
           <div className="w-[1px] h-6 bg-white/10"></div>
           <div className="flex flex-col items-end">
              <span className="text-[7px] font-mono opacity-30 uppercase tracking-widest text-white">{lang === 'EN' ? 'Type' : 'Тип'}</span>
              <span className="text-[9px] font-mono uppercase text-white">{lang === 'EN' ? 'Portfolio' : 'Портфолио'}</span>
           </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 flex flex-col items-end gap-6 md:gap-6 pointer-events-auto">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="group flex items-center gap-4 transition-all"
          >
            <span className="hidden md:block text-[9px] font-mono opacity-0 group-hover:opacity-40 transition-opacity tracking-widest translate-x-4 group-hover:translate-x-0 text-white">
              {item.label}
            </span>
            <div className="w-2 h-2 md:w-1.5 md:h-1.5 rounded-full border border-white/30 group-hover:bg-cyan-400 group-hover:border-cyan-400 group-hover:scale-125 transition-all"></div>
          </button>
        ))}
      </div>

      {/* Bottom Footer */}
      <div className="flex justify-between items-end pointer-events-auto border-t border-white/5 pt-6">
        <div className="flex flex-col gap-1 md:gap-2">
          <div className="text-[7px] md:text-[9px] tracking-[0.4em] uppercase opacity-30 font-mono text-white">
            [ FLUID_ARCHITECTURE ]
          </div>
          <div className="hidden md:block text-[6px] md:text-[8px] tracking-[0.1em] opacity-10 font-mono italic text-white">
            Visual Engine: WebGL 2.0
          </div>
        </div>
        
        <div className="flex gap-6 md:gap-10 text-[9px] md:text-[9px] tracking-[0.3em] md:tracking-[0.5em] uppercase font-bold font-mono text-white">
          <a href="https://github.com" target="_blank" className="hover:text-cyan-400 transition-colors">GH</a>
          <a href="https://linkedin.com" target="_blank" className="hover:text-cyan-400 transition-colors">LN</a>
          <a href="https://t.me/Laksxe" target="_blank" className="hover:text-cyan-400 transition-colors">TG</a>
        </div>
      </div>
    </div>
  );
};

export default FloatingUI;
