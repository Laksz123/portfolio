
import React, { useState, useEffect, Suspense } from 'react';
import { useProgress } from '@react-three/drei';
import Experience from './components/Experience';
import FloatingUI from './components/FloatingUI';

const Loader = ({ lang }: { lang: 'EN' | 'RU' }) => {
  const { progress } = useProgress();
  return (
    <div className="fixed inset-0 z-[100] bg-[#02040a] flex flex-col items-center justify-center transition-opacity duration-1000">
      <div className="relative flex flex-col items-center gap-12 max-w-xs w-full px-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="text-cyan-400 font-mono text-[10px] tracking-[0.5em] uppercase opacity-60 animate-pulse">
            {lang === 'EN' ? 'Initializing Neural Link' : 'Инициализация Нейросвязи'}
          </div>
          <div className="text-4xl font-serif italic text-white uppercase tracking-tighter">
            Karachkov
          </div>
        </div>
        
        <div className="w-full h-[2px] bg-white/5 relative overflow-hidden rounded-full">
          <div 
            className="absolute top-0 left-0 h-full bg-cyan-400 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between w-full font-mono text-[8px] tracking-widest text-white/30 uppercase">
          <span>{progress.toFixed(0)}%</span>
          <span>Buffer: 0.12ms</span>
        </div>
      </div>
      
      <div className="absolute bottom-12 text-[7px] font-mono opacity-20 tracking-[0.8em] uppercase text-white">
        Hardware Accelerated Viewport v4.2
      </div>
    </div>
  );
};

function App() {
  const [lang, setLang] = useState<'EN' | 'RU'>('EN');
  const [loaded, setLoaded] = useState(false);
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setLoaded(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <main className="relative w-full h-full min-h-screen">
      {!loaded && <Loader lang={lang} />}
      
      <Suspense fallback={null}>
        <Experience lang={lang} setLang={setLang} />
      </Suspense>

      <FloatingUI lang={lang} setLang={setLang} />

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[60]"></div>
      <div className="fixed inset-0 pointer-events-none z-[61] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-15"></div>

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-[55] pointer-events-none opacity-40">
          <span className="text-[8px] tracking-[0.8em] md:tracking-[1em] uppercase text-white/60 font-mono mb-1">
            {lang === 'EN' ? 'Scroll' : 'Скролл'}
          </span>
          <div className="w-[1px] h-16 md:h-24 bg-gradient-to-b from-cyan-500/50 via-white/20 to-transparent overflow-hidden">
            <div className="w-full h-1/4 bg-cyan-400 animate-[scrollLine_2s_infinite_ease-in-out]"></div>
          </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        ::selection { background: #0088ff; color: white; }
        html { scrollbar-width: none; -ms-overflow-style: none; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}

export default App;
