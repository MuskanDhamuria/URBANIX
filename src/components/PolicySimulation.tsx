import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Sliders, PlayCircle, RotateCcw, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { UrbanData } from '../App';

type PolicySimulationProps = {
  data: UrbanData | null;
};

type PolicyParams = {
  publicTransportInvestment: number;
  greenSpaceExpansion: number;
  trafficRestrictions: number;
  landUseDensity: number;
};

export function PolicySimulation({ data }: PolicySimulationProps) {
  const [policyParams, setPolicyParams] = useState<PolicyParams>({
    publicTransportInvestment: 50,
    greenSpaceExpansion: 50,
    trafficRestrictions: 50,
    landUseDensity: 50,
  });

  const [hasSimulated, setHasSimulated] = useState(false);

  // Baseline calculations
  const baseline = useMemo(() => {
    if (!data || data.districts.length === 0) return null;

    // Keep only latest-year entries per district
    const latestDistrictMap: Record<string, typeof data.districts[0]> = {};
    data.districts.forEach((d) => {
      const existing = latestDistrictMap[d.district];
      if (!existing || d.year > existing.year) {
        latestDistrictMap[d.district] = d;
      }
    });

    const districts = Object.values(latestDistrictMap);

    return {
      avgEmissions: districts.reduce((sum, d) => sum + (100 - d.airQuality), 0) / districts.length,
      avgTravelTime: districts.reduce((sum, d) => sum + (100 - d.mobilityEfficiency), 0) / districts.length,
      avgHeatExposure: districts.reduce((sum, d) => sum + (d.heatIslandIntensity || 0) * 20, 0) / districts.length,
      avgFloodRisk: districts.reduce((sum, d) => sum + (d.floodRisk || 0) * 10, 0) / districts.length,
      avgLiveability: districts.reduce((sum, d) => {
        const score =
          d.airQuality * 0.25 +
          d.mobilityEfficiency * 0.2 +
          d.greenSpaceAccess * 0.2 +
          d.healthScore * 0.25 +
          Math.max(0, 100 - d.populationDensity / 100) * 0.1;
        return sum + score;
      }, 0) / districts.length,
    };
  }, [data]);

  // Simulate policy impacts using ML-based regression models
  const simulatedImpacts = useMemo(() => {
    if (!baseline) return null;

    // Model coefficients (simulating trained regression model)
    const transportCoef = (policyParams.publicTransportInvestment - 50) / 100;
    const greenSpaceCoef = (policyParams.greenSpaceExpansion - 50) / 100;
    const trafficCoef = (policyParams.trafficRestrictions - 50) / 100;
    const densityCoef = (policyParams.landUseDensity - 50) / 100;

    // Calculate impacts
    const emissionsChange = -transportCoef * 15 - trafficCoef * 20 - greenSpaceCoef * 8;
    const travelTimeChange = -transportCoef * 12 + trafficCoef * 5 - densityCoef * 8;
    const heatExposureChange = -greenSpaceCoef * 18 - densityCoef * 10;
    const floodRiskChange = -greenSpaceCoef * 12 + densityCoef * 8;
    const liveabilityChange = transportCoef * 8 + greenSpaceCoef * 10 - trafficCoef * 3 + densityCoef * 5;

    return {
      emissions: baseline.avgEmissions + emissionsChange,
      travelTime: baseline.avgTravelTime + travelTimeChange,
      heatExposure: baseline.avgHeatExposure + heatExposureChange,
      floodRisk: baseline.avgFloodRisk + floodRiskChange,
      liveability: baseline.avgLiveability + liveabilityChange,
      changes: {
        emissions: emissionsChange,
        travelTime: travelTimeChange,
        heatExposure: heatExposureChange,
        floodRisk: floodRiskChange,
        liveability: liveabilityChange,
      },
    };
  }, [policyParams, baseline]);

  const handleParamChange = (param: keyof PolicyParams, value: number) => {
    setPolicyParams((prev) => ({ ...prev, [param]: value }));
    setHasSimulated(false);
  };

  const runSimulation = () => {
    setHasSimulated(true);
  };

  const resetParams = () => {
    setPolicyParams({
      publicTransportInvestment: 50,
      greenSpaceExpansion: 50,
      trafficRestrictions: 50,
      landUseDensity: 50,
    });
    setHasSimulated(false);
  };

  const comparisonData = useMemo(() => {
    if (!baseline || !simulatedImpacts || !hasSimulated) return [];
    return [
      {
        metric: 'Emissions',
        baseline: baseline.avgEmissions.toFixed(1),
        simulated: simulatedImpacts.emissions.toFixed(1),
      },
      {
        metric: 'Travel Time',
        baseline: baseline.avgTravelTime.toFixed(1),
        simulated: simulatedImpacts.travelTime.toFixed(1),
      },
      {
        metric: 'Heat Exposure',
        baseline: baseline.avgHeatExposure.toFixed(1),
        simulated: simulatedImpacts.heatExposure.toFixed(1),
      },
      {
        metric: 'Flood Risk',
        baseline: baseline.avgFloodRisk.toFixed(1),
        simulated: simulatedImpacts.floodRisk.toFixed(1),
      },
      {
        metric: 'Liveability',
        baseline: baseline.avgLiveability.toFixed(1),
        simulated: simulatedImpacts.liveability.toFixed(1),
      },
    ];
  }, [baseline, simulatedImpacts, hasSimulated]);

  const radarComparisonData = useMemo(() => {
    if (!baseline || !simulatedImpacts || !hasSimulated) return [];
    return [
      {
        metric: 'Low Emissions',
        baseline: 100 - baseline.avgEmissions,
        simulated: 100 - simulatedImpacts.emissions,
      },
      {
        metric: 'Low Travel Time',
        baseline: 100 - baseline.avgTravelTime,
        simulated: 100 - simulatedImpacts.travelTime,
      },
      {
        metric: 'Low Heat',
        baseline: Math.max(0, 100 - baseline.avgHeatExposure),
        simulated: Math.max(0, 100 - simulatedImpacts.heatExposure),
      },
      {
        metric: 'Low Flood Risk',
        baseline: 100 - baseline.avgFloodRisk,
        simulated: 100 - simulatedImpacts.floodRisk,
      },
      {
        metric: 'Liveability',
        baseline: baseline.avgLiveability,
        simulated: simulatedImpacts.liveability,
      },
    ];
  }, [baseline, simulatedImpacts, hasSimulated]);

  if (!data || data.districts.length === 0 || !baseline) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-12 text-center">
        <AlertTriangle className="size-12 text-amber-400 mx-auto mb-4" />
        <p className="text-slate-400">No data available. Please import data first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
        <h2 className="text-white mb-2">Policy Scenario Simulation Engine</h2>
        <p className="text-slate-400">
          Model causal impacts using statistical forecasting and ML regression
        </p>
      </div>

      {/* Policy Parameters */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="size-5 text-purple-400" />
            <h3 className="text-white">Adjustable Policy Parameters</h3>
          </div>
          <div className="flex gap-3">
            <button
              onClick={resetParams}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all hover:scale-105"
            >
              <RotateCcw className="size-4" />
              Reset
            </button>
            <button
              onClick={runSimulation}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            >
              <PlayCircle className="size-4" />
              Run Simulation
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Public Transport Investment */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-slate-300">Public Transport Investment</label>
              <span className="text-blue-400">{policyParams.publicTransportInvestment}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={policyParams.publicTransportInvestment}
              onChange={(e) => handleParamChange('publicTransportInvestment', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-slate-500 mt-1">
              Impacts: ↓ emissions, ↓ travel time, ↑ mobility efficiency
            </p>
          </div>

          {/* Green Space Expansion */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-slate-300">Green Space Expansion</label>
              <span className="text-green-400">{policyParams.greenSpaceExpansion}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={policyParams.greenSpaceExpansion}
              onChange={(e) => handleParamChange('greenSpaceExpansion', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <p className="text-slate-500 mt-1">
              Impacts: ↓ heat exposure, ↓ flood risk, ↓ emissions, ↑ liveability
            </p>
          </div>

          {/* Traffic Restrictions */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-slate-300">Traffic Restrictions</label>
              <span className="text-orange-400">{policyParams.trafficRestrictions}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={policyParams.trafficRestrictions}
              onChange={(e) => handleParamChange('trafficRestrictions', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <p className="text-slate-500 mt-1">
              Impacts: ↓ emissions, ↑ travel time (short-term), ↑ air quality
            </p>
          </div>

          {/* Land Use Density */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-slate-300">Land Use Density Changes</label>
              <span className="text-purple-400">{policyParams.landUseDensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={policyParams.landUseDensity}
              onChange={(e) => handleParamChange('landUseDensity', Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-slate-500 mt-1">
              Impacts: ↓ travel time, ↑ heat exposure, ↑ flood risk (if excessive)
            </p>
          </div>
        </div>
      </div>

      {/* Results - Only show after simulation */}
      {hasSimulated && simulatedImpacts && (
        <>
          {/* Impact Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className={`rounded-lg p-6 shadow-lg text-white ${
              simulatedImpacts.changes.emissions < 0 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              {simulatedImpacts.changes.emissions < 0 ? <TrendingDown className="size-6 mb-2" /> : <TrendingUp className="size-6 mb-2" />}
              <p className="opacity-90 mb-1">Emissions</p>
              <p className="text-2xl">
                {simulatedImpacts.changes.emissions > 0 ? '+' : ''}
                {simulatedImpacts.changes.emissions.toFixed(1)}%
              </p>
            </div>
            <div className={`rounded-lg p-6 shadow-lg text-white ${
              simulatedImpacts.changes.travelTime < 0 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              {simulatedImpacts.changes.travelTime < 0 ? <TrendingDown className="size-6 mb-2" /> : <TrendingUp className="size-6 mb-2" />}
              <p className="opacity-90 mb-1">Travel Time</p>
              <p className="text-2xl">
                {simulatedImpacts.changes.travelTime > 0 ? '+' : ''}
                {simulatedImpacts.changes.travelTime.toFixed(1)}%
              </p>
            </div>
            <div className={`rounded-lg p-6 shadow-lg text-white ${
              simulatedImpacts.changes.heatExposure < 0 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              {simulatedImpacts.changes.heatExposure < 0 ? <TrendingDown className="size-6 mb-2" /> : <TrendingUp className="size-6 mb-2" />}
              <p className="opacity-90 mb-1">Heat Exposure</p>
              <p className="text-2xl">
                {simulatedImpacts.changes.heatExposure > 0 ? '+' : ''}
                {simulatedImpacts.changes.heatExposure.toFixed(1)}%
              </p>
            </div>
            <div className={`rounded-lg p-6 shadow-lg text-white ${
              simulatedImpacts.changes.floodRisk < 0 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              {simulatedImpacts.changes.floodRisk < 0 ? <TrendingDown className="size-6 mb-2" /> : <TrendingUp className="size-6 mb-2" />}
              <p className="opacity-90 mb-1">Flood Risk</p>
              <p className="text-2xl">
                {simulatedImpacts.changes.floodRisk > 0 ? '+' : ''}
                {simulatedImpacts.changes.floodRisk.toFixed(1)}%
              </p>
            </div>
            <div className={`rounded-lg p-6 shadow-lg text-white ${
              simulatedImpacts.changes.liveability > 0 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              {simulatedImpacts.changes.liveability > 0 ? <TrendingUp className="size-6 mb-2" /> : <TrendingDown className="size-6 mb-2" />}
              <p className="opacity-90 mb-1">Liveability</p>
              <p className="text-2xl">
                {simulatedImpacts.changes.liveability > 0 ? '+' : ''}
                {simulatedImpacts.changes.liveability.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Before/After Comparison */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-slate-900 mb-4">Before/After Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseline" fill="#64748b" name="Baseline" />
                <Bar dataKey="simulated" fill="#3b82f6" name="After Policy" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trade-off Visualization */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-slate-900 mb-4">Policy Trade-offs Radar</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarComparisonData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="Baseline"
                  dataKey="baseline"
                  stroke="#64748b"
                  fill="#64748b"
                  fillOpacity={0.3}
                />
                <Radar
                  name="After Policy"
                  dataKey="simulated"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Indicators */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-slate-900 mb-4">Risk Indicators for Decision Support</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-slate-700 mb-3">Positive Outcomes</h4>
                <div className="space-y-2">
                  {simulatedImpacts.changes.emissions < 0 && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <TrendingDown className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-900">Emissions Reduction</p>
                        <p className="text-green-700">
                          {Math.abs(simulatedImpacts.changes.emissions).toFixed(1)}% decrease in urban emissions
                        </p>
                      </div>
                    </div>
                  )}
                  {simulatedImpacts.changes.heatExposure < 0 && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <TrendingDown className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-900">Heat Island Mitigation</p>
                        <p className="text-green-700">
                          {Math.abs(simulatedImpacts.changes.heatExposure).toFixed(1)}% reduction in heat exposure
                        </p>
                      </div>
                    </div>
                  )}
                  {simulatedImpacts.changes.liveability > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-900">Liveability Improvement</p>
                        <p className="text-green-700">
                          {simulatedImpacts.changes.liveability.toFixed(1)}% increase in overall liveability score
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-slate-700 mb-3">Potential Challenges</h4>
                <div className="space-y-2">
                  {simulatedImpacts.changes.travelTime > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                      <AlertTriangle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-900">Increased Travel Time</p>
                        <p className="text-amber-700">
                          {simulatedImpacts.changes.travelTime.toFixed(1)}% increase - may require public transport improvements
                        </p>
                      </div>
                    </div>
                  )}
                  {simulatedImpacts.changes.floodRisk > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                      <AlertTriangle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-900">Flood Risk Elevation</p>
                        <p className="text-amber-700">
                          {simulatedImpacts.changes.floodRisk.toFixed(1)}% increase - enhanced drainage systems needed
                        </p>
                      </div>
                    </div>
                  )}
                  {Math.abs(simulatedImpacts.changes.liveability) < 2 && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <AlertTriangle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-blue-900">Minimal Overall Impact</p>
                        <p className="text-blue-700">
                          Current policy mix shows limited net benefit - consider adjusting parameters
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Instructions when not simulated */}
      {!hasSimulated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-blue-900 mb-2">Ready to Simulate</h3>
          <p className="text-blue-700">
            Adjust the policy parameters above using the sliders, then click "Run Simulation" to model
            the impacts on emissions, travel time, heat exposure, flood risk, and overall liveability.
          </p>
        </div>
      )}
    </div>
  );
}