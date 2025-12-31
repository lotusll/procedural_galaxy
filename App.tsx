
import React, { useState, useEffect } from 'react';
import CelestialScene from './components/CelestialScene';
import CosmicUI from './components/CosmicUI';
import { generateCosmicInfo } from './services/geminiService';
import { PlanetStats } from './types';

const INITIAL_STATS: PlanetStats = {
  name: "Cerulean-9",
  description: "A majestic gas giant wrapped in sapphire mists and frozen methane clouds. Its colossal rings sing with the light of a thousand captured comets.",
  age: "4.5 Billion Years",
  mass: "124 Earth Masses",
  temperature: "-185°C",
  atmosphere: ["Hydrogen", "He", "CH4"]
};

const App: React.FC = () => {
  const [stats, setStats] = useState<PlanetStats>(INITIAL_STATS);
  const [message, setMessage] = useState("Scanning the deep void for signals...");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (prompt: string) => {
    setLoading(true);
    try {
      const result = await generateCosmicInfo(prompt);
      setStats(result);
      setMessage(result.message || "New coordinates established.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setMessage("Deep space signal synchronized."), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen bg-[#020617] relative overflow-hidden">
      {/* Vanilla Three.js Scene */}
      <CelestialScene isLoading={loading} />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none transition-all duration-500">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-400 rounded-full animate-spin"></div>
            <p className="text-blue-400 font-space tracking-[0.2em] text-xs animate-pulse uppercase">Recalibrating Lens...</p>
          </div>
        </div>
      )}

      {/* Interface */}
      <CosmicUI 
        stats={stats} 
        message={message} 
        onGenerate={handleGenerate} 
        isLoading={loading}
      />
    </div>
  );
};

export default App;
