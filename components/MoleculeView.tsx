
import React from 'react';

interface MoleculeViewProps {
  temperature: number;
  isWater: boolean;
  density: number;
}

const MoleculeView: React.FC<MoleculeViewProps> = ({ temperature, isWater, density }) => {
  // Map density to a spread factor
  // Lower density = more spread
  const maxD = isWater ? 1000 : 900;
  const spread = Math.max(1, (maxD / density) * 1.5);
  
  // Generate a grid of "molecules"
  const molecules = [];
  const rows = 5;
  const cols = 5;
  const spacing = 30 * spread;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = 50 + j * spacing;
      const y = 50 + i * spacing;
      molecules.push({ x, y });
    }
  }

  const isIce = isWater && temperature < 0;

  return (
    <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-700 flex items-center justify-center">
      <div className="absolute top-2 left-2 px-2 py-1 bg-white/10 rounded text-xs text-slate-300 font-mono">
        Molekylmodell
      </div>
      <svg width="250" height="250" viewBox="0 0 300 300" className="transition-all duration-500 ease-out">
        {molecules.map((m, idx) => (
          <circle
            key={idx}
            cx={m.x}
            cy={m.y}
            r={isIce ? 8 : 6}
            fill={isWater ? (isIce ? "#a5f3fc" : "#38bdf8") : "#fbbf24"}
            className="transition-all duration-700 ease-in-out"
            stroke={isIce ? "#0891b2" : "none"}
            strokeWidth={2}
          />
        ))}
        {isIce && (
          <text x="150" y="150" textAnchor="middle" fill="#fff" className="text-xl font-bold opacity-30 select-none pointer-events-none">
            IS (Kristall)
          </text>
        )}
      </svg>
      <div className="absolute bottom-4 right-4 text-right">
         <p className="text-xs text-slate-400">Glesare = Lägre densitet</p>
         <p className="text-xs text-slate-400">Tätare = Högre densitet</p>
      </div>
    </div>
  );
};

export default MoleculeView;
