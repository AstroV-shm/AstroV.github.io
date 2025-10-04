import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ImpactResults } from '../utils/impactCalculator';

interface DataVisualizationProps {
  results: ImpactResults;
}

export default function DataVisualization({ results }: DataVisualizationProps) {
  const energyComparisons = [
    { name: 'Hiroshima', value: 0.015, color: '#3b82f6' },
    { name: 'Tunguska', value: 15, color: '#8b5cf6' },
    { name: 'Mt St Helens', value: 24, color: '#ec4899' },
    { name: 'Tsar Bomba', value: 50, color: '#f59e0b' },
    { name: 'This Impact', value: results.tntEquivalent, color: '#ef4444' },
  ].sort((a, b) => a.value - b.value);

  const damageZones = [
    { name: 'Fireball', value: results.fireball / 1000, color: '#ef4444' },
    { name: 'Thermal Radiation', value: (results.thermalRadiation - results.fireball) / 1000, color: '#f97316' },
    { name: 'Air Blast', value: (results.airBlast - results.thermalRadiation) / 1000, color: '#eab308' },
  ].filter(zone => zone.value > 0);

  const formatValue = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    if (value >= 1) return value.toFixed(2);
    return value.toExponential(1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Energy Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={energyComparisons} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#9ca3af"
              scale="log"
              domain={['auto', 'auto']}
              tickFormatter={formatValue}
              label={{ value: 'Megatons TNT', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => [`${formatValue(value)} MT`, 'Energy']}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {energyComparisons.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Damage Zone Distribution</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={damageZones}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {damageZones.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => [`${value.toFixed(2)} km`, 'Radius']}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col justify-center space-y-3">
            {damageZones.map((zone) => (
              <div key={zone.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: zone.color }}
                  />
                  <span className="text-gray-300">{zone.name}</span>
                </div>
                <span className="text-white font-bold">{zone.value.toFixed(2)} km</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Impact Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Mass</div>
            <div className="text-white font-bold text-lg">
              {(results.mass / 1e9).toExponential(2)}
            </div>
            <div className="text-gray-500 text-xs">kg (×10⁹)</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Energy</div>
            <div className="text-white font-bold text-lg">
              {results.impactEnergy.toExponential(2)}
            </div>
            <div className="text-gray-500 text-xs">Joules</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Crater Depth</div>
            <div className="text-white font-bold text-lg">
              {results.craterDepth.toFixed(0)}
            </div>
            <div className="text-gray-500 text-xs">meters</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Seismic</div>
            <div className="text-white font-bold text-lg">
              {results.seismicMagnitude > 0 ? results.seismicMagnitude.toFixed(1) : 'N/A'}
            </div>
            <div className="text-gray-500 text-xs">Magnitude</div>
          </div>
        </div>
      </div>
    </div>
  );
}
