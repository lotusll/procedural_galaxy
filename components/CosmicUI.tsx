
import React, { useState } from 'react';
import { Search, Info, Wind, Thermometer, Database, Star } from 'lucide-react';
import { PlanetStats } from '../types';

interface CosmicUIProps {
  stats: PlanetStats;
  message: string;
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const CosmicUI: React.FC<CosmicUIProps> = ({ stats, message, onGenerate, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onGenerate(input);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10 font-space text-white select-none">
      {/* Top Section: Header and Stats Labels */}
      <div className="space-y-8 pointer-events-auto">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              {stats.name.toUpperCase()}
            </h1>
            <p className="text-sm text-blue-200/60 max-w-md italic">
              "{message}"
            </p>
          </div>
          
          <div className="hidden sm:block bg-blue-900/20 backdrop-blur-md border border-blue-500/20 p-4 rounded-xl space-y-2">
             <div className="flex items-center gap-2 text-xs text-blue-400">
               <Star size={14} fill="currentColor" /> SYSTEM STATUS: OPERATIONAL
             </div>
             <div className="text-[10px] font-mono text-blue-300/40">
               SECTOR: 0xFF-7A-42<br/>
               COORDS: -24.8, 114.2, 0.05
             </div>
          </div>
        </div>

        {/* Stats Cards moved "above" (to the top section) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Info size={18} />} label="Mass" value={stats.mass} />
          <StatCard icon={<Wind size={18} />} label="Age" value={stats.age} />
          <StatCard icon={<Thermometer size={18} />} label="Temp" value={stats.temperature} />
          <StatCard icon={<Database size={18} />} label="Atmosphere" value={stats.atmosphere.join(", ")} />
        </div>
      </div>

      {/* Bottom Control & Info */}
      <div className="flex flex-col sm:flex-row gap-6 items-end justify-between pointer-events-auto">
        <div className="w-full sm:max-w-md bg-black/40 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl shadow-2xl">
          <p className="text-sm text-blue-100/80 leading-relaxed mb-4">
            {stats.description}
          </p>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search other celestial bodies..."
              className="w-full bg-blue-900/20 border border-blue-400/30 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-blue-400 transition-colors"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1.5 text-blue-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <Search size={20} className={isLoading ? "animate-pulse" : ""} />
            </button>
          </form>
        </div>

        <div className="hidden lg:flex gap-4">
          <div className="text-right">
             <div className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Visual Algorithm</div>
             <div className="text-xs text-blue-200/50">GLSL Noise v3.2 + Three.js 160</div>
          </div>
          <div className="h-10 w-[1px] bg-blue-500/30"></div>
          <div className="text-right">
             <div className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Deep Space Sync</div>
             <div className="text-xs text-blue-200/50">Gemini-3 Flash Preview</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-blue-900/10 backdrop-blur-md border border-blue-500/20 p-4 rounded-xl hover:bg-blue-800/20 transition-all group">
    <div className="flex items-center gap-3 text-blue-400 mb-2 group-hover:scale-105 transition-transform">
      {icon}
      <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">{label}</span>
    </div>
    <div className="text-sm sm:text-base font-semibold truncate text-white">{value}</div>
  </div>
);

export default CosmicUI;
