
import React from 'react';

interface LakeModelProps {
  temperature: number;
}

const LakeModel: React.FC<LakeModelProps> = ({ temperature }) => {
  // Layer logic: 
  // If temp is < 0, surface is ice.
  // The water at 4C is at the bottom.
  const isFreezing = temperature <= 0;
  
  return (
    <div className="w-full h-80 bg-blue-50 rounded-xl overflow-hidden border border-blue-200 relative shadow-lg">
      <div className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-lg shadow-sm border border-blue-100">
        <h4 className="font-bold text-sm text-blue-900">Sjö-tvärsnitt (Vinter)</h4>
        <p className="text-xs text-blue-700">Visar hur vattnet skiktar sig</p>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
        {/* Sky */}
        <rect x="0" y="0" width="400" height="50" fill={isFreezing ? "#e2e8f0" : "#bae6fd"} />
        
        {/* Surface / Ice Layer */}
        {isFreezing ? (
          <rect x="0" y="50" width="400" height="20" fill="#f8fafc" stroke="#e2e8f0" />
        ) : (
          <rect x="0" y="50" width="400" height="2" fill="#0ea5e9" />
        )}

        {/* Water Gradient Layers */}
        <defs>
          <linearGradient id="lakeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isFreezing ? "#bae6fd" : "#38bdf8"} />
            <stop offset="70%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
        </defs>
        
        <rect x="0" y="50" width="400" height="200" fill="url(#lakeGrad)" />
        
        {/* Bottom Sediment */}
        <path d="M 0 250 Q 100 240 200 255 T 400 250 L 400 300 L 0 300 Z" fill="#422006" />

        {/* Temperature Indicators */}
        {isFreezing && (
          <g>
            <text x="200" y="65" textAnchor="middle" fill="#1e293b" className="text-[10px] font-bold">0°C (IS)</text>
            <text x="200" y="100" textAnchor="middle" fill="#fff" className="text-[10px]">1°C</text>
            <text x="200" y="150" textAnchor="middle" fill="#fff" className="text-[10px]">2°C</text>
            <text x="200" y="200" textAnchor="middle" fill="#fff" className="text-[10px]">3°C</text>
            <text x="200" y="240" textAnchor="middle" fill="#fff" className="text-[10px] font-bold">4°C (DENSITETSTOPP)</text>
          </g>
        )}
      </svg>

      <div className="absolute bottom-12 left-0 right-0 px-4 text-center pointer-events-none">
        <p className="text-white text-xs font-medium drop-shadow-md">
          {isFreezing 
            ? "Eftersom 4-gradigt vatten är tyngst sjunker det till botten. Sjön fryser uppifrån och ned!" 
            : "Vattnet cirkulerar mer fritt när yttemperaturen är högre."}
        </p>
      </div>
    </div>
  );
};

export default LakeModel;
