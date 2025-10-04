import { useState, useEffect } from 'react';
import { Rocket, Target, Shield, BarChart3, Map } from 'lucide-react';
import SolarSystemViewer from './components/SolarSystemViewer';
import ControlPanel from './components/ControlPanel';
import ImpactResultsDashboard from './components/ImpactResults';
import WorldMap from './components/WorldMap';
import MitigationSimulator from './components/MitigationSimulator';
import EducationalMode from './components/EducationalMode';
import DataVisualization from './components/DataVisualization';
import { AsteroidParams, calculateImpact, ImpactResults } from './utils/impactCalculator';

type Tab = 'impact' | 'map' | 'mitigation' | 'data';

function App() {
  const [params, setParams] = useState<AsteroidParams>({
    diameter: 100,
    velocity: 30,
    angle: 45,
    density: 'rocky',
  });

  const [results, setResults] = useState<ImpactResults | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('impact');
  const [impactLocation, setImpactLocation] = useState({ lat: 40.7128, lng: -74.006 });
  const [educationalMode, setEducationalMode] = useState(false);

  useEffect(() => {
    const locationData = getCityPopulation(impactLocation.lat, impactLocation.lng);
    const calculatedResults = calculateImpact(params, locationData.population);
    setResults(calculatedResults);
  }, [params, impactLocation]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setImpactLocation({ lat, lng });
  };

  function getCityPopulation(lat: number, lng: number): { population: number; city: string } {
    const cities = [
      { name: 'New York', lat: 40.7128, lng: -74.006, population: 8000000 },
      { name: 'London', lat: 51.5074, lng: -0.1278, population: 9000000 },
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503, population: 14000000 },
      { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, population: 4000000 },
      { name: 'Paris', lat: 48.8566, lng: 2.3522, population: 2200000 },
      { name: 'Mumbai', lat: 19.076, lng: 72.8777, population: 20000000 },
    ];

    for (const city of cities) {
      const distance = Math.sqrt(
        Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
      );
      if (distance < 1) {
        return { population: city.population, city: city.name };
      }
    }

    return { population: 0, city: 'Ocean/Rural Area' };
  }

  const tabs = [
    { id: 'impact' as const, label: 'Impact Analysis', icon: Target },
    { id: 'map' as const, label: 'World Map', icon: Map },
    { id: 'mitigation' as const, label: 'Mitigation', icon: Shield },
    { id: 'data' as const, label: 'Data Analysis', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rocket className="text-blue-500" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white">AstroV</h1>
                <p className="text-sm text-gray-400">Asteroid Impact Simulator</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">NASA Space Apps Challenge 2025</p>
              <p className="text-xs text-gray-600">Real Physics • Real Data</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-gray-900/60 backdrop-blur-sm border-b border-gray-800 sticky top-[73px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'impact' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden h-[500px]">
                <SolarSystemViewer
                  asteroidDiameter={params.diameter}
                  velocity={params.velocity}
                  angle={params.angle}
                />
              </div>
              {results && <ImpactResultsDashboard results={results} />}
            </div>

            <div className="lg:col-span-1">
              <ControlPanel params={params} onParamsChange={setParams} />
            </div>
          </div>
        )}

        {activeTab === 'map' && results && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden h-[600px]">
              <WorldMap
                impactLocation={impactLocation}
                onLocationSelect={handleLocationSelect}
                affectedRadius={results.affectedAreaRadius / 1000}
                fireballRadius={results.fireball}
                thermalRadius={results.thermalRadiation}
              />
            </div>
            <ImpactResultsDashboard results={results} />
          </div>
        )}

        {activeTab === 'mitigation' && results && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MitigationSimulator tntEquivalent={results.tntEquivalent} />
            </div>
            <div className="lg:col-span-1">
              <ControlPanel params={params} onParamsChange={setParams} />
            </div>
          </div>
        )}

        {activeTab === 'data' && results && (
          <div className="space-y-6">
            <DataVisualization results={results} />
          </div>
        )}
      </main>

      <footer className="bg-gray-900/80 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">
              Made for <span className="text-blue-400 font-semibold">NASA Space Apps Challenge 2025</span>
            </p>
            <p className="text-xs text-gray-500">
              Physics calculations based on impact cratering equations and NASA NEO data
            </p>
          </div>
        </div>
      </footer>

      <EducationalMode
        isEnabled={educationalMode}
        onToggle={() => setEducationalMode(!educationalMode)}
      />
    </div>
  );
}

export default App;
