
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Thermometer, Info, Droplets, FlaskConical, Waves, ChevronDown } from 'lucide-react';
import MoleculeView from './components/MoleculeView';
import LakeModel from './components/LakeModel';
import { 
  TEMPERATURE_RANGE, 
  DEFAULT_TEMP, 
  SUBSTANCES,
  Substance,
  calculateWaterDensity, 
  calculateSubstanceDensity,
  calculateVolume 
} from './constants';
import { getExplanation } from './services/gemini.ts';

const App: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(DEFAULT_TEMP);
  const [selectedSubstance, setSelectedSubstance] = useState<Substance>(SUBSTANCES[0]);
  const [explanation, setExplanation] = useState<string>("Dra i reglaget för att utforska...");
  const [loading, setLoading] = useState<boolean>(false);

  const waterDensity = calculateWaterDensity(temperature);
  const substanceDensity = calculateSubstanceDensity(selectedSubstance, temperature);

  // Data for the charts
  const chartData = useMemo(() => {
    const data = [];
    for (let t = TEMPERATURE_RANGE.min; t <= TEMPERATURE_RANGE.max; t += 0.5) {
      data.push({
        temp: t,
        waterDensity: calculateWaterDensity(t),
        substanceDensity: calculateSubstanceDensity(selectedSubstance, t),
      });
    }
    return data;
  }, [selectedSubstance]);

  const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(parseFloat(e.target.value));
  };

  const handleSubstanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sub = SUBSTANCES.find(s => s.id === e.target.value);
    if (sub) setSelectedSubstance(sub);
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      // Pass the context of the selected substance to Gemini for a better explanation
      const msg = await getExplanation(temperature);
      setExplanation(msg || "Ingen förklaring tillgänglig.");
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [temperature, selectedSubstance]);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-6 shadow-lg mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Waves size={36} className="text-blue-200" />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Varför fryser inte sjöar från botten?</h1>
          </div>
          <p className="text-lg text-blue-100 max-w-2xl font-light">
            En interaktiv utforskning av vattnets unika egenskap: att ha sin högsta densitet vid exakt 4° Celsius, jämfört med andra vätskor.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Control Panel */}
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Thermometer className="text-red-500" /> Simulator-kontroll
              </h2>
              <span className={`px-3 py-1 rounded-full text-lg font-mono font-bold ${temperature <= 0 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                {temperature.toFixed(1)}°C
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Jämför vatten med:</label>
                <div className="relative">
                  <select 
                    value={selectedSubstance.id} 
                    onChange={handleSubstanceChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10 text-slate-700 font-medium"
                  >
                    {SUBSTANCES.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Justera Temperatur</label>
                <input 
                  type="range" 
                  min={TEMPERATURE_RANGE.min} 
                  max={TEMPERATURE_RANGE.max} 
                  step="0.5" 
                  value={temperature} 
                  onChange={handleTempChange}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono mt-2">
                  <span>-5°C</span>
                  <span className="text-blue-500 font-bold">0°C</span>
                  <span className="text-indigo-600 font-bold">4°C</span>
                  <span>20°C</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed relative">
              <div className="absolute -top-3 left-4 bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Lärar-AI</div>
              {loading ? (
                <div className="flex gap-1 py-2">
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              ) : explanation}
            </div>

            <div className="mt-6 space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Vatten:</span>
                 <span className="font-bold text-blue-600">{waterDensity.toFixed(1)} kg/m³</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">{selectedSubstance.name}:</span>
                 <span className="font-bold" style={{ color: selectedSubstance.color }}>{substanceDensity.toFixed(1)} kg/m³</span>
               </div>
            </div>
          </div>
        </section>

        {/* Visualizations */}
        <section className="lg:col-span-2 space-y-8">
          
          {/* Comparison Views */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-bold text-slate-700">
                <Droplets className="text-blue-500" /> Vatten
              </h3>
              <MoleculeView temperature={temperature} isWater={true} density={waterDensity} />
            </div>
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-bold text-slate-700">
                <FlaskConical style={{ color: selectedSubstance.color }} /> {selectedSubstance.name}
              </h3>
              <MoleculeView temperature={temperature} isWater={false} density={substanceDensity} />
            </div>
          </div>

          {/* Lake Cross-section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Info className="text-blue-500" size={20} /> Vattnets unika botten-egenskap
              </h3>
            </div>
            <LakeModel temperature={temperature} />
          </div>

          {/* Graphs */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-8">Densitetens kurva</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="temp" 
                    label={{ value: 'Temperatur (°C)', position: 'insideBottomRight', offset: -5 }} 
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    label={{ value: 'kg/m³', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => value.toFixed(1) + ' kg/m³'}
                    labelFormatter={(label) => `Temperatur: ${label}°C`}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <ReferenceLine x={4} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'top', value: 'Vattnets topp', fill: '#3b82f6', fontSize: 11 }} />
                  <Line 
                    type="monotone" 
                    dataKey="waterDensity" 
                    name="Vatten" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="substanceDensity" 
                    name={selectedSubstance.name} 
                    stroke={selectedSubstance.color} 
                    strokeWidth={2} 
                    dot={false} 
                  />
                  <ReferenceLine x={temperature} stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-100">
              <p><strong>Vetenskaplig insikt:</strong> De flesta vätskor (som {selectedSubstance.name.toLowerCase()}) blir hela tiden tätare när de kyls ner. Vatten gör tvärtom under 4°C – det börjar expandera igen på grund av hur vattenmolekylerna börjar bilda kristallstrukturer (is).</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-slate-200 py-12 text-center text-slate-400 text-sm">
        <p className="mb-2">&copy; 2024 Pedagogisk Fysik-Simulator.</p>
        <p className="max-w-md mx-auto italic">Data visas som approximationer för att tydliggöra de fysikaliska principerna bakom vattnets densitetsanomali.</p>
      </footer>
    </div>
  );
};

export default App;
