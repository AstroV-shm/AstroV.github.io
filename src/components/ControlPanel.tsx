import { useState, useEffect } from 'react';
import { Rocket, AlertTriangle } from 'lucide-react';
import { AsteroidParams } from '../utils/impactCalculator';
import { fetchNASAAsteroids, NASAAsteroid } from '../services/nasaApi';

interface ControlPanelProps {
  params: AsteroidParams;
  onParamsChange: (params: AsteroidParams) => void;
}

export default function ControlPanel({ params, onParamsChange }: ControlPanelProps) {
  const [asteroids, setAsteroids] = useState<NASAAsteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  useEffect(() => {
    fetchNASAAsteroids().then((data) => {
      setAsteroids(data);
      setLoading(false);
    });
  }, []);

  const handleSliderChange = (key: keyof AsteroidParams, value: number) => {
    onParamsChange({ ...params, [key]: value });
  };

  const handleDensityChange = (density: 'rocky' | 'metallic' | 'icy') => {
    onParamsChange({ ...params, density });
  };

  const loadAsteroid = (asteroid: NASAAsteroid) => {
    onParamsChange({
      diameter: asteroid.diameter,
      velocity: asteroid.velocity,
      angle: 45,
      density: 'rocky',
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Rocket className="text-blue-400" size={28} />
        <h2 className="text-2xl font-bold text-white">Impact Parameters</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              className="text-sm font-medium text-gray-300 cursor-help"
              onMouseEnter={() => setShowTooltip('diameter')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              Asteroid Diameter (meters)
            </label>
            <span className="text-lg font-bold text-blue-400">{params.diameter}m</span>
          </div>
          <input
            type="range"
            min="1"
            max="1000"
            value={params.diameter}
            onChange={(e) => handleSliderChange('diameter', Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          {showTooltip === 'diameter' && (
            <div className="mt-2 text-xs text-gray-400 bg-gray-800 p-2 rounded">
              The size of the asteroid. Larger asteroids cause more damage. Chicxulub was ~10km.
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              className="text-sm font-medium text-gray-300 cursor-help"
              onMouseEnter={() => setShowTooltip('velocity')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              Velocity (km/s)
            </label>
            <span className="text-lg font-bold text-blue-400">{params.velocity} km/s</span>
          </div>
          <input
            type="range"
            min="10"
            max="70"
            value={params.velocity}
            onChange={(e) => handleSliderChange('velocity', Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          {showTooltip === 'velocity' && (
            <div className="mt-2 text-xs text-gray-400 bg-gray-800 p-2 rounded">
              Impact speed. Earth's escape velocity is 11 km/s. Higher speeds = more energy.
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              className="text-sm font-medium text-gray-300 cursor-help"
              onMouseEnter={() => setShowTooltip('angle')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              Impact Angle (degrees)
            </label>
            <span className="text-lg font-bold text-blue-400">{params.angle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            value={params.angle}
            onChange={(e) => handleSliderChange('angle', Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          {showTooltip === 'angle' && (
            <div className="mt-2 text-xs text-gray-400 bg-gray-800 p-2 rounded">
              0° = grazing impact, 90° = direct vertical impact. Most impacts are 30-45°.
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 mb-3 block">Composition</label>
          <div className="grid grid-cols-3 gap-2">
            {(['rocky', 'metallic', 'icy'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleDensityChange(type)}
                className={`py-2 px-3 rounded-lg font-medium transition-all ${
                  params.density === type
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-orange-400" size={20} />
            <h3 className="text-lg font-bold text-white">Real NASA Asteroids</h3>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-4">Loading NASA data...</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {asteroids.map((asteroid) => (
                <button
                  key={asteroid.id}
                  onClick={() => loadAsteroid(asteroid)}
                  className="w-full text-left bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                        {asteroid.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {asteroid.diameter}m • {asteroid.velocity.toFixed(1)} km/s
                      </div>
                    </div>
                    {asteroid.isPotentiallyHazardous && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                        PHO
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
