import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from 'recharts';
import { AlertTriangle, Flame, Droplets, Wind, Shield, Users } from 'lucide-react';
import { UrbanData } from '../App';

type RiskMappingProps = {
  data: UrbanData | null;
};

export function RiskMapping({ data }: RiskMappingProps) {
  const [selectedRiskLayer, setSelectedRiskLayer] = useState<string>('composite');

  const calculateRiskScore = (district: any) => {
    const heatRisk = (district.heatIslandIntensity || 0) * 20;
    const floodRisk = (district.floodRisk || 0) * 10;
    const pollutionRisk = district.pollutionExposure || 0;
    return Math.round((heatRisk * 0.35 + floodRisk * 0.35 + pollutionRisk * 0.30));
  };

  const calculateVulnerability = (district: any) => {
    const riskScore = calculateRiskScore(district);
    const densityFactor = Math.min(100, district.populationDensity / 100);
    return Math.round((riskScore * 0.7 + densityFactor * 0.3));
  };

  const enrichedData = useMemo(() => {
    if (!data) return [];

    // Create a map to keep only the latest data per district
    const latestDistrictMap: Record<string, typeof data.districts[0]> = {};

    data.districts.forEach((d) => {
      const existing = latestDistrictMap[d.district];
      if (!existing || d.year > existing.year) {
        latestDistrictMap[d.district] = d;
      }
    });

    // Convert map to array and enrich
    return Object.values(latestDistrictMap).map((d) => ({
      ...d,
      riskScore: calculateRiskScore(d),
      vulnerability: calculateVulnerability(d),
      heatRiskNorm: (d.heatIslandIntensity || 0) * 20,
      floodRiskNorm: (d.floodRisk || 0) * 10,
    }));
  }, [data]);
  

    const sortedByRisk = useMemo(() => {
      return [...enrichedData].sort((a, b) => b.riskScore - a.riskScore);
    }, [enrichedData]);

    const maxRiskScore = useMemo(() => {
    if (!enrichedData.length) return 1000;
    const maxVal = Math.max(...enrichedData.map(d => d.riskScore || 0));
    return Math.max(1000, Math.ceil(maxVal / 100) * 100); // at least 1000, round up to 100s
  }, [enrichedData]);


  const getRiskColor = (score: number) => {
    const s = maxRiskScore || 1000;
    if (score >= 0.7 * s) return '#ef4444';  // Critical
    if (score >= 0.5 * s) return '#f59e0b';  // High
    if (score >= 0.3 * s) return '#fbbf24';  // Moderate
    return '#10b981';                        // Low
  };

  const getRiskLevel = (score: number) => {
    const s = maxRiskScore || 1000;
    if (score >= 0.7 * s) return 'Critical';
    if (score >= 0.5 * s) return 'High';
    if (score >= 0.3 * s) return 'Moderate';
    return 'Low';
  };


  const hotspots = useMemo(() => {
    return enrichedData.filter((d) => d.riskScore >= 60);
  }, [enrichedData]);

  if (!data || data.districts.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-12 text-center">
        <AlertTriangle className="size-12 text-amber-400 mx-auto mb-4" />
        <p className="text-slate-400">No data available. Please import data first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
        <h2 className="text-white mb-2">Environmental Risk Mapping Module</h2>
        <p className="text-slate-400">
          Geospatial ML-based hotspot detection and vulnerability assessment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 text-white rounded-2xl p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/20 rounded-full blur-3xl" />
          <Flame className="size-8 mb-3 text-red-400 relative z-10" />
          <p className="text-red-200 mb-1 relative z-10">Heat Island Risk</p>
          <p className="text-3xl relative z-10">{hotspots.filter((d) => (d.heatIslandIntensity || 0) > 3).length}</p>
          <p className="text-red-200 mt-1 relative z-10">Districts affected</p>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 text-white rounded-2xl p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl" />
          <Droplets className="size-8 mb-3 text-blue-400 relative z-10" />
          <p className="text-blue-200 mb-1 relative z-10">Flood Zones</p>
          <p className="text-3xl relative z-10">{hotspots.filter((d) => (d.floodRisk || 0) > 3).length}</p>
          <p className="text-blue-200 mt-1 relative z-10">High risk areas</p>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 text-white rounded-2xl p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl" />
          <Wind className="size-8 mb-3 text-purple-400 relative z-10" />
          <p className="text-purple-200 mb-1 relative z-10">Pollution Exposure</p>
          <p className="text-3xl relative z-10">{hotspots.filter((d) => (d.pollutionExposure || 0) > 50).length}</p>
          <p className="text-purple-200 mt-1 relative z-10">Critical areas</p>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 text-white rounded-2xl p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/20 rounded-full blur-3xl" />
          <Users className="size-8 mb-3 text-orange-400 relative z-10" />
          <p className="text-orange-200 mb-1 relative z-10">Vulnerable Pop.</p>
          <p className="text-3xl relative z-10">{hotspots.length}</p>
          <p className="text-orange-200 mt-1 relative z-10">Districts at risk</p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
        <h3 className="text-white mb-4">Risk Layer Visualization</h3>
        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'composite', label: 'Composite Risk', icon: Shield },
            { id: 'heat', label: 'Heat Island', icon: Flame },
            { id: 'flood', label: 'Flood Risk', icon: Droplets },
            { id: 'pollution', label: 'Pollution', icon: Wind },
          ].map((layer) => {
            const Icon = layer.icon;
            return (
              <button
                key={layer.id}
                onClick={() => setSelectedRiskLayer(layer.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  selectedRiskLayer === layer.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-lg shadow-purple-500/50'
                    : 'bg-slate-900/50 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                <Icon className="size-4" />
                {layer.label}
              </button>
            );
          })}
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={sortedByRisk}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="district" angle={-45} textAnchor="end" height={120} stroke="#94a3b8" />
            <YAxis domain={[0, 100]} stroke="#94a3b8" />
            
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }} />
            <Legend />
            {selectedRiskLayer === 'composite' && (
              <Bar dataKey="riskScore" name="Composite Risk Score"  fill="#ef4444">
                {sortedByRisk.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRiskColor(entry.riskScore)} />
                ))}
              </Bar>
            )}
            {selectedRiskLayer === 'heat' && (
              <Bar dataKey="heatRiskNorm" fill="#ef4444" name="Heat Island Intensity" />
            )}
            {selectedRiskLayer === 'flood' && (
              <Bar dataKey="floodRiskNorm" fill="#3b82f6" name="Flood Risk" />
            )}
            {selectedRiskLayer === 'pollution' && (
              <Bar dataKey="pollutionExposure" fill="#8b5cf6" name="Pollution Exposure" />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
        <h3 className="text-white mb-4">Vulnerability Assessment (Risk × Population Exposure)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis
              type="number"
              dataKey="riskScore"
              domain={[0, maxRiskScore]}
              stroke="#94a3b8"
              label={{
                value: 'Environmental Risk Score (0 - 1000)',
                position: 'insideBottom',
                offset: -25,
                fill: '#94a3b8',
              }}
            />

            <YAxis
              type="number"
              dataKey="populationDensity"
              stroke="#94a3b8"
              label={{
                value: 'Population Density',
                angle: -90,
                position: 'insideLeft',
                fill: '#94a3b8',
              }}
            />

            <ZAxis type="number" dataKey="vulnerability" range={[20, 180]} />

            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '0.5rem',
              }}
            />

            <Legend verticalAlign="top" align="right" iconType="circle" 
            />

            <Scatter name="Districts" data={enrichedData} fill="#ef4444">
              {enrichedData.map((entry, index) => (
                <Cell key={index} fill={getRiskColor(entry.riskScore)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        <p className="text-slate-400 mt-4 text-center">
          Bubble size represents vulnerability score (risk exposure × population density)
        </p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="size-5 text-red-400" />
          <h3 className="text-white">Detected Environmental Hotspots (ML-based)</h3>
        </div>
        {hotspots.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotspots.map((district) => (
              <div key={district.district} className="border-l-4 p-4 bg-slate-900/50 backdrop-blur-xl rounded border border-slate-700/50" style={{ borderLeftColor: getRiskColor(district.riskScore) }}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-">{district.district}</h4>
                  <span className={`px-2 py-1 text-xs rounded ${district.riskScore >= 70 ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'}`}>
                    {getRiskLevel(district.riskScore)}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Composite Risk:</span>
                    <span className="text-slate-200">{district.riskScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Heat Island:</span>
                    <span className="text-slate-200">{district.heatIslandIntensity?.toFixed(1) || 'N/A'}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Flood Risk:</span>
                    <span className="text-slate-200">{district.floodRisk?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pollution:</span>
                    <span className="text-slate-200">{district.pollutionExposure || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vulnerability:</span>
                    <span className="text-slate-200">{district.vulnerability}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">
            <Shield className="size-12 mx-auto mb-3 text-green-400" />
            <p>No critical environmental hotspots detected</p>
          </div>
        )}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 overflow-hidden">
        <h3 className="text-white mb-4">District-Level Environmental Risk Indices</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-300">District</th>
                <th className="text-left py-3 px-4 text-slate-300">Risk Level</th>
                <th className="text-left py-3 px-4 text-slate-300">Composite Score</th>
                <th className="text-left py-3 px-4 text-slate-300">Heat Island</th>
                <th className="text-left py-3 px-4 text-slate-300">Flood Risk</th>
                <th className="text-left py-3 px-4 text-slate-300">Pollution</th>
                <th className="text-left py-3 px-4 text-slate-300">Vulnerability</th>
              </tr>
            </thead>
            <tbody>
              {sortedByRisk.map((district, index) => (
                <tr key={district.district} className={`border-b border-slate-800 ${index % 2 === 0 ? 'bg-slate-900/30' : 'bg-transparent'}`}>
                  <td className="py-3 px-4 text-slate-200">{district.district}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${district.riskScore >= 70 ? 'bg-red-500/20 text-red-300' : district.riskScore >= 50 ? 'bg-orange-500/20 text-orange-300' : district.riskScore >= 30 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                      {getRiskLevel(district.riskScore)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span style={{ color: getRiskColor(district.riskScore) }}>{district.riskScore}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{district.heatIslandIntensity?.toFixed(1) || 'N/A'}</td>
                  <td className="py-3 px-4 text-slate-400">{district.floodRisk?.toFixed(1) || 'N/A'}</td>
                  <td className="py-3 px-4 text-slate-400">{district.pollutionExposure || 'N/A'}</td>
                  <td className="py-3 px-4 text-slate-400">{district.vulnerability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
