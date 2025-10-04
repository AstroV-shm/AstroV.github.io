import { ImpactResults } from '../utils/impactCalculator';
import { Flame, Mountain, Waves, Activity, Users, Wind } from 'lucide-react';

interface ImpactResultsProps {
  results: ImpactResults;
}

export default function ImpactResultsDashboard({ results }: ImpactResultsProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)} billion`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)} million`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)} thousand`;
    return num.toFixed(0);
  };

  const footballFields = (results.craterDiameter / 100).toFixed(1);

  const comparisons = [
    { event: 'Hiroshima Bomb', value: 0.015 },
    { event: 'Tsar Bomba', value: 50 },
    { event: 'Krakatoa Eruption', value: 200 },
    { event: 'Tunguska Event', value: 15 },
    { event: 'Mt. St. Helens', value: 24 },
  ];

  const closestComparison = comparisons.reduce((prev, curr) =>
    Math.abs(curr.value - results.tntEquivalent) < Math.abs(prev.value - results.tntEquivalent)
      ? curr
      : prev
  );

  const getEnvironmentalEffects = () => {
    const effects = [];

    if (results.tntEquivalent > 1) {
      effects.push('Severe local fires and forest destruction');
    }
    if (results.tntEquivalent > 10) {
      effects.push('Regional atmospheric disturbance');
    }
    if (results.tntEquivalent > 100) {
      effects.push('Global dust cloud affecting climate');
    }
    if (results.tntEquivalent > 1000) {
      effects.push('Mass extinction event possible');
    }
    if (results.seismicMagnitude > 5) {
      effects.push(`Magnitude ${results.seismicMagnitude.toFixed(1)} earthquake`);
    }

    return effects.length > 0 ? effects : ['Localized damage only'];
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-red-900/40 to-red-800/40 rounded-lg p-5 border border-red-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Flame className="text-red-400" size={24} />
            <h3 className="text-lg font-bold text-white">Impact Energy</h3>
          </div>
          <div className="text-3xl font-bold text-red-400 mb-2">
            {results.tntEquivalent.toExponential(2)} MT
          </div>
          <div className="text-sm text-gray-300">
            Similar to {closestComparison.event}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 rounded-lg p-5 border border-orange-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Mountain className="text-orange-400" size={24} />
            <h3 className="text-lg font-bold text-white">Crater Size</h3>
          </div>
          <div className="text-3xl font-bold text-orange-400 mb-2">
            {results.craterDiameter.toFixed(0)}m
          </div>
          <div className="text-sm text-gray-300">
            ~{footballFields} football fields wide
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg p-5 border border-blue-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Wind className="text-blue-400" size={24} />
            <h3 className="text-lg font-bold text-white">Affected Area</h3>
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {(results.affectedAreaRadius / 1000).toFixed(1)} km
          </div>
          <div className="text-sm text-gray-300">
            Blast radius from impact site
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 rounded-lg p-5 border border-yellow-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Flame className="text-yellow-400" size={24} />
            <h3 className="text-lg font-bold text-white">Fireball Radius</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {(results.fireball / 1000).toFixed(2)} km
          </div>
          <div className="text-sm text-gray-300">
            Everything vaporized instantly
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-lg p-5 border border-purple-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="text-purple-400" size={24} />
            <h3 className="text-lg font-bold text-white">Seismic Activity</h3>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {results.seismicMagnitude > 0 ? results.seismicMagnitude.toFixed(1) : 'N/A'}
          </div>
          <div className="text-sm text-gray-300">
            {results.seismicMagnitude > 0 ? 'Richter scale magnitude' : 'Negligible'}
          </div>
        </div>

        {results.casualtyEstimate > 0 && (
          <div className="bg-gradient-to-br from-red-900/40 to-red-800/40 rounded-lg p-5 border border-red-700/50">
            <div className="flex items-center gap-3 mb-3">
              <Users className="text-red-400" size={24} />
              <h3 className="text-lg font-bold text-white">Casualty Estimate</h3>
            </div>
            <div className="text-3xl font-bold text-red-400 mb-2">
              {formatNumber(results.casualtyEstimate)}
            </div>
            <div className="text-sm text-gray-300">
              In populated area
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-lg p-5 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Waves className="text-green-400" size={24} />
          <h3 className="text-lg font-bold text-white">Environmental Effects</h3>
        </div>
        <ul className="space-y-2">
          {getEnvironmentalEffects().map((effect, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-300">
              <span className="text-green-400 mt-1">•</span>
              <span>{effect}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-lg p-5 border border-blue-700/50">
        <h3 className="text-lg font-bold text-white mb-3">Damage Zones</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Fireball</span>
            <span className="text-red-400 font-bold">{(results.fireball / 1000).toFixed(2)} km</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ width: '100%' }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300">Thermal Radiation</span>
            <span className="text-orange-400 font-bold">{(results.thermalRadiation / 1000).toFixed(2)} km</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full"
              style={{ width: `${Math.min((results.thermalRadiation / results.affectedAreaRadius) * 100, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300">Air Blast</span>
            <span className="text-yellow-400 font-bold">{(results.airBlast / 1000).toFixed(2)} km</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${Math.min((results.airBlast / results.affectedAreaRadius) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
