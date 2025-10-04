import { useState } from 'react';
import { Shield, Zap, Radio } from 'lucide-react';
import { calculateMitigation } from '../utils/impactCalculator';

interface MitigationSimulatorProps {
  tntEquivalent: number;
}

export default function MitigationSimulator({ tntEquivalent }: MitigationSimulatorProps) {
  const [strategy, setStrategy] = useState<'kinetic' | 'nuclear' | 'gravity'>('kinetic');
  const [daysBeforeImpact, setDaysBeforeImpact] = useState(1825);

  const mitigation = calculateMitigation(tntEquivalent, daysBeforeImpact, strategy);

  const strategies = [
    {
      id: 'kinetic' as const,
      name: 'Kinetic Impact',
      icon: Zap,
      color: 'blue',
      description: 'Launch spacecraft to collide with asteroid, changing its momentum',
      pros: ['Proven technology', 'No nuclear material', 'Predictable results'],
      cons: ['Requires years of warning', 'Less effective on large asteroids'],
    },
    {
      id: 'nuclear' as const,
      name: 'Nuclear Deflection',
      icon: Radio,
      color: 'red',
      description: 'Detonate nuclear device near asteroid to vaporize surface material',
      pros: ['Most powerful option', 'Effective on large asteroids', 'Faster than alternatives'],
      cons: ['Political challenges', 'Risk of fragmentation', 'Radioactive concerns'],
    },
    {
      id: 'gravity' as const,
      name: 'Gravity Tractor',
      icon: Shield,
      color: 'green',
      description: 'Position spacecraft near asteroid to gradually alter trajectory via gravity',
      pros: ['Gentle and controlled', 'No fragmentation risk', 'Precise adjustments'],
      cons: ['Requires decades of warning', 'Only works on smaller asteroids'],
    },
  ];

  const currentStrategy = strategies.find(s => s.id === strategy)!;

  const getSuccessColor = (probability: number) => {
    if (probability >= 70) return 'text-green-400';
    if (probability >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSuccessBarColor = (probability: number) => {
    if (probability >= 70) return 'bg-green-500';
    if (probability >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Mitigation Strategy</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {strategies.map((strat) => {
            const Icon = strat.icon;
            const isSelected = strategy === strat.id;
            return (
              <button
                key={strat.id}
                onClick={() => setStrategy(strat.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `border-${strat.color}-500 bg-${strat.color}-500/20`
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon
                    className={isSelected ? `text-${strat.color}-400` : 'text-gray-400'}
                    size={24}
                  />
                  <h3 className="font-bold text-white text-left">{strat.name}</h3>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-gray-800 rounded-lg p-5 mb-6">
          <h3 className="font-bold text-white mb-2">{currentStrategy.name}</h3>
          <p className="text-gray-300 text-sm mb-4">{currentStrategy.description}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-green-400 font-semibold text-sm mb-2">Advantages</h4>
              <ul className="space-y-1">
                {currentStrategy.pros.map((pro, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold text-sm mb-2">Disadvantages</h4>
              <ul className="space-y-1">
                {currentStrategy.cons.map((con, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Days Before Impact
            </label>
            <span className="text-lg font-bold text-blue-400">
              {daysBeforeImpact} days ({(daysBeforeImpact / 365).toFixed(1)} years)
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="3650"
            value={daysBeforeImpact}
            onChange={(e) => setDaysBeforeImpact(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg p-5 border border-blue-700/50">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Deflection Needed</h3>
            <div className="text-3xl font-bold text-blue-400">
              {mitigation.deflectionNeeded.toFixed(4)}°
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Change in trajectory required to miss Earth
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-lg p-5 border border-purple-700/50">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Success Probability</h3>
            <div className={`text-3xl font-bold ${getSuccessColor(mitigation.successProbability)}`}>
              {mitigation.successProbability.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mt-3">
              <div
                className={`${getSuccessBarColor(mitigation.successProbability)} h-3 rounded-full transition-all`}
                style={{ width: `${mitigation.successProbability}%` }}
              />
            </div>
          </div>
        </div>

        {mitigation.successProbability < 40 && (
          <div className="mt-4 bg-red-900/30 border border-red-700/50 rounded-lg p-4">
            <p className="text-red-400 text-sm font-semibold">
              ⚠ Warning: Low success probability. Consider:
            </p>
            <ul className="text-red-300 text-sm mt-2 space-y-1 ml-4">
              <li>• Increasing warning time (move slider right)</li>
              <li>• Trying a different mitigation strategy</li>
              <li>• Multiple mission approach</li>
            </ul>
          </div>
        )}

        {mitigation.successProbability >= 70 && (
          <div className="mt-4 bg-green-900/30 border border-green-700/50 rounded-lg p-4">
            <p className="text-green-400 text-sm font-semibold">
              ✓ High probability of success with current parameters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
