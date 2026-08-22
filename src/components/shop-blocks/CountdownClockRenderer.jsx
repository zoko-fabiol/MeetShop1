import React from 'react';
import { Clock, Zap, Flame, Sparkles, Award, ShieldCheck, Terminal, Tag } from 'lucide-react';

export default function CountdownClockRenderer({
  hours = 14,
  minutes = 59,
  seconds = 8,
  clockStyle = 'flip_card',
  themeId = 'emerald',
  dv = {}
}) {
  const hStr = String(hours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  // Ratios pour les anneaux circulaires
  const hPercent = (hours / 24) * 100;
  const mPercent = (minutes / 60) * 100;
  const sPercent = (seconds / 60) * 100;

  // 1. 🎴 FLIP CARDS 3D (Cartes à rabat rétro-numériques)
  if (clockStyle === 'flip_card') {
    return (
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        {[
          { val: hStr, label: 'HEURES' },
          { val: mStr, label: 'MINUTES' },
          { val: sStr, label: 'SECONDES' }
        ].map((item, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div className="relative w-11 sm:w-13 h-11 sm:h-13 rounded-xl bg-slate-900 text-white font-mono font-black text-base sm:text-lg flex items-center justify-center shadow-lg border border-slate-800 overflow-hidden">
                {/* Ligne médiane de pliure 3D */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-slate-950/80 shadow-sm z-10" />
                <div className="absolute inset-x-0 top-0 h-1/2 bg-white/5 pointer-events-none" />
                <span className="relative z-0 tracking-widest">{item.val}</span>
              </div>
              <span className="text-[8px] font-black uppercase tracking-wider text-current opacity-70 mt-1">
                {item.label}
              </span>
            </div>
            {idx < 2 && (
              <span className="text-base font-black text-current opacity-50 pb-3 -mx-0.5 animate-pulse">:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // 2. ⚡ NEON CYBER MATRIX (Chiffres néon cyan avec lueur luminescente)
  if (clockStyle === 'neon_cyber') {
    return (
      <div className="flex items-center gap-2 pt-1 flex-wrap font-mono">
        {[
          { val: hStr, label: 'HR' },
          { val: mStr, label: 'MIN' },
          { val: sStr, label: 'SEC' }
        ].map((item, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#070B12] border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.4)] text-cyan-300 font-black text-base sm:text-lg tracking-wider">
                {item.val}
              </div>
              <span className="text-[8px] font-bold text-cyan-400/90 tracking-widest mt-1 uppercase">
                {item.label}
              </span>
            </div>
            {idx < 2 && (
              <span className="text-cyan-400 font-black text-lg pb-3 shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-pulse">:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // 3. 💊 MINIMAL MODERN PILLS (Pilules épurées douces)
  if (clockStyle === 'minimal_pills') {
    return (
      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
        {[
          { val: hStr, unit: 'h' },
          { val: mStr, unit: 'm' },
          { val: sStr, unit: 's' }
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-current/15 text-current shadow-sm"
          >
            <span className="font-mono font-black text-sm sm:text-base">{item.val}</span>
            <span className="text-[10px] font-bold opacity-75 uppercase">{item.unit}</span>
          </div>
        ))}
      </div>
    );
  }

  // 4. ⭕ CIRCULAR RINGS (Anneaux Radiaux Circulaires SVG)
  if (clockStyle === 'circular_rings') {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    return (
      <div className="flex items-center gap-3 pt-1 flex-wrap">
        {[
          { val: hStr, label: 'Heures', pct: hPercent, color: '#10B981' },
          { val: mStr, label: 'Min', pct: mPercent, color: '#06B6D4' },
          { val: sStr, label: 'Sec', pct: sPercent, color: '#F59E0B' }
        ].map((ring, idx) => {
          const strokeDashoffset = circumference - (ring.pct / 100) * circumference;
          return (
            <div key={idx} className="flex flex-col items-center">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    className="stroke-black/10 dark:stroke-white/10"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth="2.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute font-mono font-black text-xs text-current">
                  {ring.val}
                </span>
              </div>
              <span className="text-[8px] font-extrabold uppercase opacity-75 text-current mt-0.5">
                {ring.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // 5. 🍂 VINTAGE 70S WARM (Boîtes crème & terracotta rétro)
  if (clockStyle === 'retro_warm') {
    return (
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        {[
          { val: hStr, label: 'Heures' },
          { val: mStr, label: 'Minutes' },
          { val: sStr, label: 'Secondes' }
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-[#FFF5EB] dark:bg-[#2A1E17] text-[#5C2B14] dark:text-[#FAD8C3] border border-[#E8B896] dark:border-[#593724] shadow-sm"
          >
            <span className="font-serif font-black text-sm sm:text-base tracking-wider">{item.val}</span>
            <span className="text-[8px] font-serif font-bold italic opacity-80 uppercase">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  // 6. 🧊 GLASSMORPHISM FROST (Verre dépoli givré cristal)
  if (clockStyle === 'glassmorphism_frost') {
    return (
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        {[
          { val: hStr, label: 'H' },
          { val: mStr, label: 'M' },
          { val: sStr, label: 'S' }
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center px-3 py-2 rounded-2xl bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/40 dark:border-white/20 text-current shadow-lg"
          >
            <span className="font-mono font-black text-sm sm:text-base drop-shadow-sm">{item.val}</span>
            <span className="text-[8px] font-black opacity-80 uppercase tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  // 7. 💥 NEO-BRUTALISM POP (Contours 2px et ombre 3D dure décalée)
  if (clockStyle === 'neo_brutalist_pop') {
    return (
      <div className="flex items-center gap-2.5 pt-1 flex-wrap font-mono">
        {[
          { val: hStr, label: 'HRS', bg: 'bg-amber-300' },
          { val: mStr, label: 'MIN', bg: 'bg-emerald-300' },
          { val: sStr, label: 'SEC', bg: 'bg-pink-300' }
        ].map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center px-2.5 py-1.5 rounded-lg ${item.bg} text-slate-950 border-2 border-black shadow-[3px_3px_0px_0px_#000]`}
          >
            <span className="font-black text-sm sm:text-base">{item.val}</span>
            <span className="text-[8px] font-black uppercase tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  // 8. 👑 LUXURY GOLD PRESTIGE (Doré impérial haute-couture)
  if (clockStyle === 'luxury_gold') {
    return (
      <div className="flex items-center gap-2.5 pt-1 flex-wrap">
        {[
          { val: hStr, label: 'HEURES' },
          { val: mStr, label: 'MINUTES' },
          { val: sStr, label: 'SECONDES' }
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-gradient-to-b from-amber-500/10 to-amber-900/20 border border-amber-400/60 text-amber-200 shadow-md"
          >
            <span className="font-serif font-black text-sm sm:text-base tracking-widest text-amber-300">{item.val}</span>
            <span className="text-[7px] font-serif font-extrabold uppercase tracking-widest text-amber-200/80">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  // 9. 🏷️ COMPACT INLINE (Bandeau badge ultra-compact sur une seule ligne)
  if (clockStyle === 'compact_inline') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 border border-current/15 text-current shadow-sm font-mono text-xs font-black">
        <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
        <span>Fin dans :</span>
        <span className="text-emerald-500 font-mono tracking-wider">{hStr}h : {mStr}m : {sStr}s</span>
      </div>
    );
  }

  // 10. 🌈 HOLOGRAPHIC PRISM (Dégradé pastel irisé avec pulsation)
  if (clockStyle === 'holographic_prism') {
    return (
      <div className="flex items-center gap-2 pt-1 flex-wrap font-mono">
        {[
          { val: hStr, label: 'H' },
          { val: mStr, label: 'M' },
          { val: sStr, label: 'S' }
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center px-3 py-1.5 rounded-2xl bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-pink-400/50 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]"
          >
            <span className="font-black text-sm sm:text-base tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-cyan-300">
              {item.val}
            </span>
            <span className="text-[8px] font-bold text-pink-200/80 uppercase">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  // 11. 💻 TERMINAL MATRIX (Console hacker verte monospace)
  if (clockStyle === 'terminal_matrix') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#080D09] border border-emerald-500/50 shadow-inner font-mono text-xs text-emerald-400">
        <Terminal className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
        <span className="opacity-70">&gt; EXPIRE_IN:</span>
        <span className="font-black tracking-widest text-emerald-300">
          [{hStr}:{mStr}:{sStr}]
        </span>
        <span className="w-1.5 h-3 bg-emerald-400 animate-ping inline-block" />
      </div>
    );
  }

  // 12. 📊 SPLIT SEGMENTED (Jauges segmentées sous chaque chiffre)
  if (clockStyle === 'split_segmented') {
    return (
      <div className="flex items-center gap-2.5 pt-1 flex-wrap">
        {[
          { val: hStr, label: 'Heures', pct: hPercent },
          { val: mStr, label: 'Minutes', pct: mPercent },
          { val: sStr, label: 'Secondes', pct: sPercent }
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 border border-current/15 text-current shadow-sm w-16"
          >
            <span className="font-mono font-black text-sm sm:text-base">{item.val}</span>
            {/* Barre de jauge segmentée */}
            <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden my-1">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.pct}%` }} />
            </div>
            <span className="text-[7px] font-extrabold uppercase opacity-70">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  // Style par défaut de repli
  return (
    <div className="flex items-center gap-2 pt-1 font-mono text-xs font-bold text-current opacity-90">
      <Clock className="w-4 h-4" />
      <span>Temps restant : {hStr}h {mStr}m {sStr}s</span>
    </div>
  );
}
