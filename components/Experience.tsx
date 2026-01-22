
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  ScrollControls, 
  Scroll, 
  Float, 
  MeshDistortMaterial, 
  Environment, 
  ContactShadows, 
  useScroll,
  PerspectiveCamera,
  Lightformer
} from '@react-three/drei';
import * as THREE from 'three';

const NocturnalLights = ({ isMobile }: { isMobile: boolean }) => {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.05;
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[15, 10, 5]} distance={50} intensity={isMobile ? 1.0 : 2.5} color="#88ccff" />
      <pointLight position={[-15, -5, 2]} distance={30} intensity={isMobile ? 0.6 : 1.2} color="#ffaa44" />
      <ambientLight intensity={0.1} />
    </group>
  );
};

const PortfolioCore = ({ hoveredId }: { hoveredId: string | null }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const scroll = useScroll();
  const { viewport } = useThree();
  const isMobile = viewport.width < 8;
  
  const colors = useMemo(() => ({
    start: new THREE.Color("#02040a"), 
    mid: new THREE.Color("#05162a"),   
    end: new THREE.Color("#1a2a44")    
  }), []);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const offset = scroll.offset;
    const time = state.clock.getElapsedTime();

    let targetX, targetY, targetZ, targetScale;

    if (hoveredId) {
      targetX = hoveredId.includes('proj-') ? (hoveredId === 'proj-1' ? (isMobile ? 0 : -3.5) : (isMobile ? 0 : 3.5)) : 0;
      targetY = isMobile ? (-offset * 12.5) : (-offset * 5.2); 
      targetZ = isMobile ? -6 : -5;
      targetScale = isMobile ? 3.0 : 4.5;
    } else {
      const horizontalAmplitude = isMobile ? 0.5 : 3.8;
      targetX = Math.sin(offset * Math.PI * 1.1) * horizontalAmplitude;
      targetY = isMobile ? (-offset * 13.5) : (-offset * 6.2);
      targetZ = isMobile ? -5 : -2 + (offset * 6);
      targetScale = (isMobile ? 1.6 : 2.4) + (offset * (isMobile ? 0.8 : 1.4));
    }

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.06);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.06);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.04);
    
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.05));
    meshRef.current.rotation.y = time * 0.12 + (offset * 2);
    
    const pulse = Math.sin(time * 1.5) * 0.02;
    const targetDistort = hoveredId ? 0.05 : 0.2 + pulse + (offset * 0.2);
    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.05);

    if (offset < 0.5) {
      materialRef.current.color.lerpColors(colors.start, colors.mid, offset * 2);
    } else {
      materialRef.current.color.lerpColors(colors.mid, colors.end, (offset - 0.5) * 2);
    }
  });

  return (
    <Float speed={hoveredId ? 0.5 : 1.2} rotationIntensity={0.1} floatIntensity={0.4}>
      <mesh ref={meshRef} castShadow={!isMobile} receiveShadow={!isMobile}>
        {/* Slightly lower poly but smooth on mobile */}
        <sphereGeometry args={[1, isMobile ? 42 : 128, isMobile ? 42 : 128]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#000000"
          speed={isMobile ? 0.8 : 1.5}
          distort={0.3}
          radius={1}
          metalness={1}
          roughness={isMobile ? 0.1 : 0.03}
          clearcoat={isMobile ? 0.2 : 1}
          envMapIntensity={hoveredId ? 2.5 : (isMobile ? 0.3 : 0.8)}
        />
      </mesh>
    </Float>
  );
};

const ProjectCard = ({ id, name, users, desc, setHoveredId, link, linkText, shortDesc, lang }: any) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const finalLink = link.startsWith('http') ? link : `https://${link}`;
  
  const handleToggle = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.action-link')) return;
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="group perspective-1000 w-full max-w-[340px] md:max-w-none h-[480px] md:h-[520px] md:w-[460px] relative pointer-events-auto cursor-pointer touch-manipulation"
      onMouseEnter={() => setHoveredId(id)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={handleToggle}
    >
      <div className={`relative w-full h-full transition-all duration-1000 preserve-3d ${isFlipped ? 'rotate-y-180' : ''} md:group-hover:-translate-y-8`}>
        <div className="absolute inset-0 backface-hidden glass-panel flex flex-col justify-between p-6 md:p-12 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-[#0a0a0a]/80 shadow-2xl" style={{ transform: 'translateZ(10px)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}>
          <div className="absolute -top-10 -right-10 w-24 h-24 md:w-32 md:h-32 bg-cyan-400/10 rounded-full blur-[60px] md:blur-[80px] pointer-events-none"></div>
          <div className="relative z-10">
            <span className="text-cyan-300 font-mono text-[8px] md:text-[10px] tracking-[0.5em] uppercase mb-4 md:mb-8 block opacity-80 font-bold">Node_Active</span>
            <h4 className="text-3xl md:text-6xl font-serif italic text-outline leading-tight mb-4 md:mb-6 uppercase">{name}</h4>
            <div className="h-[1px] w-10 md:w-16 bg-cyan-400/40 mb-4 md:mb-8"></div>
            <p className="text-[13px] md:text-[16px] font-mono opacity-80 leading-relaxed normal-case tracking-tight max-w-[95%]">
              {shortDesc}
            </p>
          </div>
          <div className="relative z-20 flex justify-center py-2 md:py-4">
             <a href={finalLink} target="_blank" rel="noopener noreferrer" className="action-link flex items-center gap-2 md:gap-4 px-8 py-4 md:px-12 md:py-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 rounded-full transition-all duration-500 group/link shadow-2xl backdrop-blur-md">
                <span className="text-[10px] md:text-[11px] font-mono font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase text-white group-hover/link:text-cyan-200">{linkText}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-cyan-400 group-hover/link:translate-x-2 transition-transform duration-500"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
             </a>
          </div>
          <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-4 md:pt-8 mt-2">
             <div className="flex flex-col">
                <span className="text-[28px] md:text-[52px] font-bold text-outline tabular-nums leading-none mb-1 text-white">{users}</span>
                <span className="text-[8px] md:text-[9px] font-mono opacity-60 text-cyan-200/50 uppercase tracking-[0.3em] font-bold">{lang === 'EN' ? 'Users' : 'Юзеры'}</span>
             </div>
             <div className="flex items-center gap-2 md:gap-3">
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest">{lang === 'EN' ? 'Info' : 'Инфо'}</span>
                   <span className="text-[9px] font-mono text-cyan-300 uppercase font-bold">{lang === 'EN' ? 'Tap' : 'Тап'}</span>
                </div>
                <div className="w-8 h-8 md:w-14 md:h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5 transition-transform group-hover:rotate-180">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40 text-cyan-200"><path d="M12 5v14M5 12h14"/></svg>
                </div>
             </div>
          </div>
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180 glass-panel flex flex-col p-6 md:p-12 border border-white/20 rounded-[1.5rem] md:rounded-[2.5rem] bg-black shadow-2xl" style={{ transform: 'rotateY(180deg) translateZ(10px)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}>
          <div className="flex justify-between items-start mb-4 md:mb-10">
            <div className="flex flex-col">
              <h4 className="text-xl md:text-3xl font-serif italic text-cyan-200 leading-none mb-2 uppercase tracking-tighter">{lang === 'EN' ? 'Intelligence' : 'Интеллект'}</h4>
              <span className="text-[7px] font-mono opacity-30 uppercase tracking-widest">Core_Module_5.0</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full">
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-[8px] md:text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-widest">Online</span>
            </div>
          </div>
          <p className="text-[13px] md:text-[17px] font-mono opacity-80 leading-relaxed mb-6 md:mb-12 lowercase text-justify tracking-tight border-l border-cyan-400/20 pl-4 md:pl-8 overflow-y-auto max-h-[160px] md:max-h-none">{desc}</p>
          <div className="mt-auto">
            <a href={finalLink} target="_blank" rel="noopener noreferrer" className="action-link group/btn relative w-full py-4 md:py-7 border border-white/10 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center gap-2 md:gap-4 overflow-hidden transition-all duration-700 hover:bg-white shadow-2xl">
              <span className="relative z-10 text-[10px] md:text-[13px] font-bold tracking-[0.3em] md:tracking-[0.7em] font-mono text-white group-hover/btn:text-black transition-colors uppercase">{linkText}</span>
              <svg className="relative z-10 text-cyan-200 group-hover/btn:text-black transition-colors duration-700" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const BioCard = ({ name, title, bio, achievements, socials, lang }: any) => {
  const t = (en: string, ru: string) => (lang === 'EN' ? en : ru);
  return (
    <div className="glass-panel p-8 md:p-14 rounded-[1.5rem] md:rounded-[3rem] border border-white/10 bg-black/60 shadow-2xl flex flex-col justify-between h-full pointer-events-auto overflow-y-auto max-h-[85vh] lg:max-h-none">
      <div>
        <span className="text-cyan-400 font-mono text-[9px] md:text-[10px] tracking-[0.6em] mb-4 md:mb-6 block uppercase opacity-60 font-bold">Engineering_Entity</span>
        <h4 className="text-3xl md:text-5xl font-serif italic text-white leading-tight mb-2 uppercase">{name}</h4>
        <div className="text-[11px] md:text-[13px] font-mono text-cyan-200/60 tracking-widest uppercase mb-8 md:mb-12 border-b border-white/5 pb-4">
          {title}
        </div>
        <p className="text-[13px] md:text-[15px] font-mono opacity-70 leading-relaxed lowercase mb-8 text-justify tracking-tight">
          {bio}
        </p>

        {achievements && achievements.length > 0 && (
          <div className="mb-10">
            <h5 className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.4em] mb-4 opacity-80">{t('ACHIECHVEMENTS', 'ДОСТИЖЕНИЯ')}</h5>
            <ul className="space-y-2">
              {achievements.map((ach: string, i: number) => (
                <li key={i} className="text-[11px] md:text-[12px] font-mono opacity-80 lowercase flex items-start gap-3 border-l border-cyan-400/20 pl-4">
                  {ach}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-4 items-center mt-auto pt-6 border-t border-white/5">
        {socials.map((s: any) => (
          <a key={s.name} href={s.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.3em] text-white hover:text-cyan-400 transition-colors uppercase border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 hover:border-cyan-400/40">
            {s.name}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
          </a>
        ))}
      </div>
    </div>
  );
};

const SoldProject = ({ title, year, tag, desc, tech, link, lang }: any) => {
  const content = (
    <div className="group border-b border-white/5 py-10 md:py-14 transition-all hover:border-cyan-400/40 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-400/5 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
      <div className="relative z-10 flex flex-col gap-2 md:gap-3 max-w-2xl">
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-[10px] md:text-[9px] font-mono text-cyan-300/60 tracking-widest">{year} // {tag}</span>
          <div className="h-[1px] w-4 bg-white/10"></div>
          <span className="text-[8px] md:text-[7px] font-mono text-white/20 uppercase tracking-[0.3em] md:tracking-[0.4em]">Proprietary</span>
        </div>
        <h4 className="text-2xl md:text-5xl font-serif italic tracking-tight group-hover:text-cyan-50 transition-colors uppercase leading-none">{title}</h4>
        <p className="text-[13px] md:text-[13px] opacity-60 font-mono tracking-tight lowercase max-w-xl">{desc}</p>
      </div>
      <div className="relative z-10 flex flex-col items-start md:items-end gap-3 md:gap-4">
         <div className="flex flex-wrap gap-1.5 justify-start md:justify-end opacity-70 md:opacity-20 md:group-hover:opacity-100 transition-opacity duration-500">
            {tech.map((t: string) => (
              <span key={t} className="text-[9px] md:text-[7px] font-mono border border-white/10 px-2 py-0.5 rounded uppercase">{t}</span>
            ))}
         </div>
         <div className="flex items-center gap-3 md:gap-6 transition-all duration-500">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-cyan-400 group-hover:border-cyan-400 transition-all duration-500">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:text-black transition-colors"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </div>
         </div>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block pointer-events-auto">
        {content}
      </a>
    );
  }

  return <div className="pointer-events-auto">{content}</div>;
};

const ProjectCostCalculator = ({ lang }: { lang: 'EN' | 'RU' }) => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const t = (en: string, ru: string) => (lang === 'EN' ? en : ru);

  const modules = [
    { id: 'tg-bot', name: t('TG Bot', 'ТГ Бот'), price: 40 },
    { id: 'website', name: t('Website', 'Сайт'), price: 60 },
    { id: 'saas', name: t('SaaS / Platform', 'SaaS / Платформа'), price: 140 },
    { id: 'ai', name: t('AI Logic', 'ИИ Логика'), price: 50 },
    { id: 'webgl', name: t('3D Visuals', '3D Визуал'), price: 75 },
    { id: 'dashboard', name: t('Dashboard', 'Админка'), price: 25 },
  ];

  const totalPrice = 25 + modules.filter(m => selectedModules.includes(m.id)).reduce((acc, m) => acc + m.price, 0);

  const toggleModule = (id: string) => {
    setSelectedModules(prev => prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-5xl glass-panel p-8 md:p-20 rounded-[1.5rem] md:rounded-[4rem] relative overflow-hidden pointer-events-auto w-full">
      <div className="absolute -top-20 -left-20 w-64 md:w-96 h-64 md:h-96 bg-cyan-500/5 blur-[80px]"></div>
      
      <div className="flex flex-col md:flex-row justify-between gap-12">
        <div className="flex-1">
          <p className="text-cyan-300 font-mono text-[9px] md:text-[10px] tracking-[0.8em] mb-4 uppercase opacity-60 font-bold">{t('ESTIMATOR_V1.0', 'КАЛЬКУЛЯТОР_V1.0')}</p>
          <h3 className="text-3xl md:text-7xl font-serif italic mb-8 md:mb-12 text-outline leading-tight uppercase">{t('Quote_Your', 'Расчет')} <br/>{t('Complexity', 'Сложности')}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {modules.map(m => (
              <button
                key={m.id}
                onClick={() => toggleModule(m.id)}
                className={`flex items-center justify-between p-4 md:p-6 rounded-2xl border transition-all duration-500 group ${
                  selectedModules.includes(m.id) 
                    ? 'bg-white/10 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
              >
                <span className={`text-[11px] md:text-[13px] font-mono tracking-widest uppercase transition-colors ${selectedModules.includes(m.id) ? 'text-cyan-200' : 'text-white/40'}`}>
                  {m.name}
                </span>
                <span className={`text-[10px] font-mono opacity-30 ${selectedModules.includes(m.id) ? 'opacity-100 text-cyan-400' : ''}`}>
                  +${m.price}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="md:w-72 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/10 pt-12 md:pt-0 md:pl-12">
          <div className="text-center">
            <p className="text-[10px] font-mono opacity-40 uppercase tracking-[0.4em] mb-4">{t('ESTIMATED_TOTAL', 'ИТОГОВАЯ_СТОИМОСТЬ')}</p>
            <div className="relative inline-block">
              <span className="text-6xl md:text-8xl font-bold text-white tabular-nums tracking-tighter shadow-cyan-500/20 shadow-2xl">
                ${totalPrice}
              </span>
              <div className="absolute -inset-4 bg-cyan-400/5 blur-2xl rounded-full -z-10"></div>
            </div>
            <p className="text-[9px] font-mono opacity-20 uppercase tracking-[0.2em] mt-6 leading-relaxed max-w-[200px] mx-auto">
              {t('*Base price starting at $25. Subject to final review.', '*Базовая цена от $25. Зависит от финального ТЗ.')}
            </p>
          </div>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})} className="mt-12 w-full py-5 bg-white text-black font-mono font-bold text-[11px] tracking-[0.5em] uppercase rounded-full hover:bg-cyan-400 transition-colors shadow-2xl">
            {t('START_LINK', 'НАЧАТЬ_РАБОТУ')}
          </button>
        </div>
      </div>
    </div>
  );
};

const SceneContent = ({ lang, isMobile }: { lang: 'EN' | 'RU', isMobile: boolean }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const t = <T,>(en: T, ru: T): T => (lang === 'EN' ? en : ru);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={isMobile ? 55 : 35} />
      <NocturnalLights isMobile={isMobile} />
      <PortfolioCore hoveredId={hoveredId} />

      <Scroll html>
        <div className="w-screen text-white uppercase select-none font-light overflow-x-hidden min-h-[1200vh] md:min-h-0">
          <style>{`
            .perspective-1000 { perspective: 2000px; }
            .preserve-3d { transform-style: preserve-3d; }
            .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
            .rotate-y-180 { transform: rotateY(180deg); }
            @keyframes textSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
            .glass-panel { background: rgba(8, 8, 8, 0.4); backdrop-filter: blur(50px); -webkit-backdrop-filter: blur(50px); box-shadow: 0 50px 150px -40px rgba(0, 0, 0, 0.95); }
            .section-container { max-width: 1500px; margin: 0 auto; width: 100%; padding: 0 1.5rem; }
            @media (min-width: 768px) { .section-container { padding: 0 3.5rem; } }
            .text-outline { text-shadow: 0 10px 40px rgba(0,0,0,0.8); }
          `}</style>
          
          <section id="hero" className="h-screen w-screen flex flex-col items-center justify-center relative px-4">
            <div className="absolute bottom-[10%] md:bottom-[15%] left-0 right-0 z-20 flex flex-col items-center gap-6 md:gap-8 pointer-events-auto">
               <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-[260px] md:max-w-none items-center justify-center px-4">
                  <button onClick={() => document.getElementById('active')?.scrollIntoView({behavior: 'smooth'})} className="w-full md:w-auto px-8 md:px-10 py-4 border border-white/20 hover:border-cyan-400 rounded-full bg-white/5 hover:bg-cyan-400/10 transition-all text-[9px] md:text-[11px] font-mono tracking-[0.3em] md:tracking-[0.5em] text-white/60 hover:text-cyan-300 shadow-xl pointer-events-auto">
                    {t('EXPLORE_NODES', 'ОБЗОР_ПРОЕКТОВ')}
                  </button>
                  <button onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})} className="w-full md:w-auto px-8 md:px-10 py-4 border border-white/20 hover:border-white rounded-full bg-white/5 hover:bg-white transition-all text-[9px] md:text-[11px] font-mono tracking-[0.3em] md:tracking-[0.5em] text-white/60 hover:text-black shadow-xl pointer-events-auto">
                    {t('ESTABLISH_LINK', 'СВЯЗАТЬСЯ')}
                  </button>
               </div>
            </div>

            <div className="text-center relative z-10 px-4">
              <div className="overflow-hidden mb-3 md:mb-6">
                <p className="text-[8px] md:text-[11px] tracking-[0.6em] md:tracking-[1.5em] opacity-40 translate-y-full animate-[textSlideUp_1.2s_ease_forwards] font-mono text-outline uppercase">KARACHKOV ARTEM // SYSTEM_IDX</p>
              </div>
              <h1 className="text-[14vw] md:text-[11vw] font-serif italic leading-[1.0] md:leading-[0.8] tracking-tighter text-outline uppercase">
                CREATIVE <br/> 
                <span className="text-cyan-400">BRO</span> <br/> 
                ENGINEERS
              </h1>
            </div>
          </section>

          <section id="stack" className="min-h-screen w-screen flex items-center justify-center px-4 py-20 md:py-32">
            <div className="section-container">
              <div className="max-w-5xl glass-panel p-8 md:p-24 rounded-[1.5rem] md:rounded-[4rem] relative overflow-hidden pointer-events-auto">
                <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-cyan-500/5 blur-[80px] -mr-32 -mt-32"></div>
                <p className="text-cyan-300 font-mono text-[9px] md:text-[10px] tracking-[0.6em] md:tracking-[1em] mb-6 md:mb-12 uppercase opacity-60 font-bold">{t('System Architecture', 'Архитектура')}</p>
                <h2 className="text-3xl md:text-9xl font-serif italic mb-10 md:mb-20 text-outline leading-tight md:leading-none uppercase">{t('Full_Stack', 'Фулстек')} <br/>Matrix.</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-20 font-mono text-[12px] md:text-[12px] tracking-widest">
                  <div>
                    <h4 className="text-white/40 mb-4 border-b border-white/10 pb-3 uppercase tracking-[0.2em] font-bold">{t('Foundation', 'Фундамент')}</h4>
                    <ul className="space-y-3 opacity-90">
                      <li>Python / C++</li>
                      <li>YOLOv8 / OpenCV</li>
                      <li>Vue.js / Nuxt 3</li>
                      <li>FastAPI / Django</li>
                      <li>Rust (Core Logic)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white/40 mb-4 border-b border-white/10 pb-3 uppercase tracking-[0.2em] font-bold">{t('Intelligence', 'Интеллект')}</h4>
                    <ul className="space-y-3 opacity-90">
                      <li>PyTorch / TF</li>
                      <li>PostgreSQL / Redis</li>
                      <li>Vector DBs</li>
                      <li>Computer Vision</li>
                      <li>LLM Fine-tuning</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white/40 mb-4 border-b border-white/10 pb-3 uppercase tracking-[0.2em] font-bold">{t('Deployment', 'Деплой')}</h4>
                    <ul className="space-y-3 opacity-90">
                      <li>Docker / K8s</li>
                      <li>GPU Orchestration</li>
                      <li>CI/CD Pipelines</li>
                      <li>Cloud GPU Infra</li>
                      <li>Prometheus / Grafana</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="active" className="min-h-screen w-screen flex flex-col items-center justify-center py-24 md:py-32 px-4">
            <div className="section-container flex flex-col items-center">
               <div className="w-full mb-12 md:mb-32 flex flex-col items-start md:flex-row md:items-end md:justify-between">
                  <div className="mb-6 md:mb-0">
                    <p className="text-cyan-300 font-mono text-[11px] tracking-[0.8em] mb-4 uppercase opacity-60 font-bold">{t('Real-Time Operations', 'Операции')}</p>
                    <h3 className="text-4xl md:text-9xl font-serif italic text-outline leading-[1.0] md:leading-[0.8] uppercase">{t('Nodes_Live', 'Живые_Ноды')}</h3>
                  </div>
               </div>
               <div className="w-full flex flex-col md:flex-row gap-12 md:gap-24 justify-center items-center pointer-events-auto">
                  <ProjectCard id="proj-1" name="NeuroHub" users="25.4K+" shortDesc={t("Next-gen AI aggregator. Access to 100+ neural models.", "Агрегатор нейросетей нового поколения. Доступ к 100+ моделям.")} desc={t("Scalable AI ecosystem. We integrated top language, visual, and audio models into a single bot.", "Масштабируемая экосистема ИИ. Мы объединили лучшие языковые и визуальные модели в одном боте.")} link="https://t.me/AiNeuroHubBot" linkText={t("Launch Bot", "Запустить")} setHoveredId={setHoveredId} lang={lang} />
                  <ProjectCard id="proj-2" name="NetXwork" users="4.2K+" shortDesc={t("Global portal for co-founders and engineers.", "Портал для поиска ко-фаундеров и инженеров.")} desc={t("A networking platform for founders utilizing graph-matching algorithms.", "Платформа для нетворкинки фаундеров, использующая алгоритмы сопоставления.")} link="https://netxwork.com" linkText={t("Open Portal", "Открыть Портал")} setHoveredId={setHoveredId} lang={lang} />
               </div>
            </div>
          </section>

          <section id="bio" className="min-h-screen w-screen flex flex-col items-center justify-center py-24 md:py-32 px-4">
            <div className="section-container">
               <div className="w-full mb-12 md:mb-24">
                  <p className="text-cyan-300 font-mono text-[11px] tracking-[0.8em] mb-4 uppercase opacity-60 font-bold">{t('Entities Profile', 'Профиль Сущностей')}</p>
                  <h3 className="text-4xl md:text-9xl font-serif italic text-outline leading-none uppercase">{t('Creators_Bio', 'Био_Создателей')}</h3>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 w-full items-start">
                  <BioCard name="Artem Karachkov" title={t("Full-Stack / Backend Developer", "Full-Stack / Backend Разработчик")} bio={t("Artem Karachkov — Full-Stack / Backend developer with 4+ years of commercial experience in building web services, APIs, and Telegram bots.", "Artem Karachkov — Full-Stack / Backend разработчик с 4+ годами коммерческого опыта в создании веб-сервисов, API и Telegram-ботов.")} achievements={t(["✅ 4+ years commercial exp", "✅ Turnkey solutions"], ["✅ 4+ года опыта", "✅ Проекты под ключ"])} socials={[{ name: 'Telegram', link: 'https://t.me/Laksxe' }]} lang={lang} />
                  <BioCard name="Vladislav Karachkov" title={t("Senior Full-Stack / AI Engineer", "Senior Full-Stack / AI Инженер")} bio={t("Vladislav Karachkov — Senior Full-Stack / Backend / AI Engineer with 6+ years of commercial experience.", "Vladislav Karachkov — Senior Full-Stack / Backend / AI Engineer с 6+ годами коммерческого опыта.")} achievements={t(["🏆 Hackathon Winner x3", "🏆 ICPC Quarterfinalist"], ["🏆 Победитель 3 хакатонов", "🏆 ICPC четвертьфинал"])} socials={[{ name: 'LinkedIn', link: '#' }]} lang={lang} />
               </div>
            </div>
          </section>

          <section id="projects" className="min-h-screen w-screen flex items-center justify-center py-20 md:py-32 px-4">
            <div className="section-container">
               <div className="w-full mb-12 md:mb-24">
                  <p className="text-cyan-300 font-mono text-[9px] tracking-[0.6em] mb-4 uppercase opacity-60 font-bold">{t('Proprietary Archive', 'Архив Проектов')}</p>
                  <h3 className="text-3xl md:text-9xl font-serif italic text-outline uppercase leading-none tracking-tighter">EXITS_ARCHIVE</h3>
               </div>
               <div className="flex flex-col border-t border-white/5">
                  <SoldProject title="CV_SYSTEM_IDX" year="2024" tag="AI_VISION" desc={t("CV system for docs.", "CV система для документов.")} tech={["YOLOv8", "Python"]} lang={lang} />
                  <SoldProject title="LIB_RAG_SEARCH" year="2024" tag="RAG_AI" desc={t("Semantic search.", "Семантический поиск.")} tech={["LLM", "FastAPI"]} lang={lang} />
               </div>
            </div>
          </section>

          <section id="contact" className="min-h-screen w-screen flex items-center justify-center px-4 py-16 md:py-24">
            <div className="section-container flex flex-col items-center">
               <div className="w-full flex flex-col items-center gap-10 text-center relative py-12 md:py-24 group/contact pointer-events-auto">
                  <h4 className="text-4xl md:text-[12vw] font-serif italic leading-none text-outline tracking-tighter uppercase">{t('GET_IN_TOUCH', 'СВЯЗАТЬСЯ')}</h4>
                  <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-4xl px-4 justify-center items-center">
                      <a href="https://t.me/Laksxe" target="_blank" className="bg-cyan-400 text-black px-12 py-7 rounded-full font-mono font-bold tracking-[0.4em] uppercase hover:bg-white transition-all w-full md:w-auto">
                        {t('WRITE_ARTEM', 'Написать Артему')}
                      </a>
                      <a href="https://t.me/l0xa1" target="_blank" className="bg-white text-black px-12 py-7 rounded-full font-mono font-bold tracking-[0.4em] uppercase hover:bg-cyan-400 transition-all w-full md:w-auto">
                        {t('WRITE_VLAD', 'Написать Владу')}
                      </a>
                  </div>
               </div>
            </div>
          </section>

          <section id="pricing" className="min-h-screen w-screen flex items-center justify-center px-4 py-16 md:py-32 bg-black/20">
            <div className="section-container flex flex-col items-center">
              <ProjectCostCalculator lang={lang} />
              
              <div className="mt-20 w-full flex flex-col md:flex-row justify-between items-center opacity-20 font-mono text-[8px] md:text-[10px] tracking-widest uppercase gap-6 pb-20 border-t border-white/5 pt-16">
                <span>© 2025 KARACHKOV_ENGINEERING</span>
                <div className="flex gap-10">
                  <span>Latency: 24ms</span>
                  <span>Uptime: 99.9%</span>
                  <span>Region: Global</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Scroll>

      <Environment preset="night" blur={0.8}>
        <Lightformer form="circle" intensity={isMobile ? 0.6 : 1.5} position={[20, 5, -10]} scale={[10, 10, 1]} color="#ccddff" />
        <Lightformer form="rect" intensity={isMobile ? 0.2 : 0.5} position={[-20, -5, -5]} scale={[20, 2, 1]} color="#ffaa66" />
      </Environment>

      {!isMobile && <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={30} blur={4} far={12} color="#000810" />}
      <color attach="background" args={['#02040a']} />
    </>
  );
};

const Experience = ({ lang, setLang }: { lang: 'EN' | 'RU', setLang: (l: 'EN' | 'RU') => void }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#02040a]">
      <Canvas 
        shadows={!isMobile} 
        dpr={isMobile ? 1.5 : [1, 2]} 
        gl={{ 
          antialias: !isMobile, 
          alpha: false, 
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
      >
        <ScrollControls 
          pages={isMobile ? 18.0 : 10.2} 
          damping={0.15} 
          infinite={false}
        >
          <SceneContent lang={lang} isMobile={isMobile} />
        </ScrollControls>
      </Canvas>
    </div>
  );
};

export default Experience;
