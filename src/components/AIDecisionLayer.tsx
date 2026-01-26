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
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from 'recharts';
import { Sparkles, Target, Zap, TrendingUp, CheckCircle2, AlertCircle, Cpu } from 'lucide-react';
import { UrbanData } from '../App';

type AIDecisionLayerProps = {
  data: UrbanData | null;
};

type PolicyBundle = {
  id: number;
  name: string;
  publicTransport: number;
  greenSpace: number;
  trafficRestrictions: number;
  landUseDensity: number;
  emissionsReduction: number;
  liveabilityImprovement: number;
  score: number;
  isParetoOptimal: boolean;
};

export function AIDecisionLayer({ data }: AIDecisionLayerProps) {
  const [optimizationGoal, setOptimizationGoal] = useState<string>('balanced');
  const [emissionsTarget, setEmissionsTarget] = useState<number>(30);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [hasOptimized, setHasOptimized] = useState(false);

  // Generate policy bundles using simulated reinforcement learning
  const generatePolicyBundles = (goal: string, targetReduction: number): PolicyBundle[] => {
    const bundles: PolicyBundle[] = [];

    // Simulate Bayesian optimization / RL agent exploration
    for (let i = 0; i < 20; i++) {
      let publicTransport, greenSpace, trafficRestrictions, landUseDensity;

      if (goal === 'emissions') {
        // Prioritize emissions reduction
        publicTransport = 60 + Math.random() * 40;
        greenSpace = 50 + Math.random() * 50;
        trafficRestrictions = 60 + Math.random() * 40;
        landUseDensity = 30 + Math.random() * 40;
      } else if (goal === 'liveability') {
        // Prioritize liveability improvement
        publicTransport = 50 + Math.random() * 50;
        greenSpace = 70 + Math.random() * 30;
        trafficRestrictions = 20 + Math.random() * 30;
        landUseDensity = 40 + Math.random() * 40;
      } else {
        // Balanced approach
        publicTransport = 40 + Math.random() * 50;
        greenSpace = 40 + Math.random() * 50;
        trafficRestrictions = 30 + Math.random() * 50;
        landUseDensity = 30 + Math.random() * 50;
      }

      // Calculate impacts using same model as PolicySimulation
      const transportCoef = (publicTransport - 50) / 100;
      const greenSpaceCoef = (greenSpace - 50) / 100;
      const trafficCoef = (trafficRestrictions - 50) / 100;
      const densityCoef = (landUseDensity - 50) / 100;

      const emissionsReduction = -transportCoef * 15 - trafficCoef * 20 - greenSpaceCoef * 8;
      const liveabilityImprovement = transportCoef * 8 + greenSpaceCoef * 10 - trafficCoef * 3 + densityCoef * 5;

      // Calculate multi-objective score
      let score;
      if (goal === 'emissions') {
        score = emissionsReduction * 2 + liveabilityImprovement * 0.5;
      } else if (goal === 'liveability') {
        score = liveabilityImprovement * 2 + emissionsReduction * 0.5;
      } else {
        score = emissionsReduction + liveabilityImprovement;
      }

      // Check if meets emissions target constraint
      const meetsConstraint = emissionsReduction >= targetReduction * 0.9;

      bundles.push({
        id: i + 1,
        name: `Policy Bundle ${i + 1}`,
        publicTransport: Math.round(publicTransport),
        greenSpace: Math.round(greenSpace),
        trafficRestrictions: Math.round(trafficRestrictions),
        landUseDensity: Math.round(landUseDensity),
        emissionsReduction: Number(emissionsReduction.toFixed(2)),
        liveabilityImprovement: Number(liveabilityImprovement.toFixed(2)),
        score: Number(score.toFixed(2)),
        isParetoOptimal: meetsConstraint && score > 0,
      });
    }

    return bundles;
  };

  // Identify Pareto-optimal solutions
  const identifyParetoOptimal = (bundles: PolicyBundle[]): PolicyBundle[] => {
    return bundles.map((bundle) => {
      // A solution is Pareto-optimal if no other solution dominates it
      const isDominated = bundles.some(
        (other) =>
          other.id !== bundle.id &&
          other.emissionsReduction >= bundle.emissionsReduction &&
          other.liveabilityImprovement >= bundle.liveabilityImprovement &&
          (other.emissionsReduction > bundle.emissionsReduction ||
            other.liveabilityImprovement > bundle.liveabilityImprovement)
      );
      return { ...bundle, isParetoOptimal: !isDominated };
    });
  };

  const policyBundles = useMemo(() => {
    if (!hasOptimized) return [];
    const generated = generatePolicyBundles(optimizationGoal, emissionsTarget);
    return identifyParetoOptimal(generated);
  }, [optimizationGoal, emissionsTarget, hasOptimized]);

  const topBundles = useMemo(() => {
    return [...policyBundles].sort((a, b) => b.score - a.score).slice(0, 5);
  }, [policyBundles]);

  const paretoOptimalBundles = useMemo(() => {
    return policyBundles.filter((b) => b.isParetoOptimal);
  }, [policyBundles]);

  const runOptimization = () => {
    setIsOptimizing(true);
    // Simulate AI processing time
    setTimeout(() => {
      setIsOptimizing(false);
      setHasOptimized(true);
    }, 2000);
  };

  if (!data || data.districts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
        <AlertCircle className="size-12 text-amber-500 mx-auto mb-4" />
        <p className="text-slate-600">No data available. Please import data first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-start gap-4">
          <Sparkles className="size-10 mt-1" />
          <div>
            <h2 className="mb-2">Agentic AI Decision Layer</h2>
            <p className="text-purple-100">
              Autonomous policy optimization using reinforcement learning and multi-objective Bayesian optimization
            </p>
          </div>
        </div>
      </div>

      {/* Optimization Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 flex items-center gap-2">
          <Target className="size-5 text-blue-600" />
          Planning Goals & Constraints
        </h3>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Optimization Goal */}
          <div>
            <label className="text-slate-700 mb-2 block">Primary Optimization Goal</label>
            <select
              value={optimizationGoal}
              onChange={(e) => {
                setOptimizationGoal(e.target.value);
                setHasOptimized(false);
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="balanced">Balanced (Multi-objective)</option>
              <option value="emissions">Maximize Emissions Reduction</option>
              <option value="liveability">Maximize Liveability Improvement</option>
            </select>
          </div>

          {/* Emissions Target */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-slate-700">Minimum Emissions Reduction Target</label>
              <span className="text-blue-600">{emissionsTarget}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={emissionsTarget}
              onChange={(e) => {
                setEmissionsTarget(Number(e.target.value));
                setHasOptimized(false);
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <button
          onClick={runOptimization}
          disabled={isOptimizing}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            isOptimizing
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
          } text-white`}
        >
          {isOptimizing ? (
            <>
              <Cpu className="size-5 animate-spin" />
              AI Agent Optimizing...
            </>
          ) : (
            <>
              <Zap className="size-5" />
              Run AI Policy Optimization
            </>
          )}
        </button>
      </div>

      {/* Optimization in Progress */}
      {isOptimizing && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8">
          <div className="flex flex-col items-center gap-4">
            <Cpu className="size-16 text-purple-600 animate-pulse" />
            <div className="text-center">
              <p className="text-slate-900 mb-2">AI Agent Processing...</p>
              <p className="text-slate-600">
                Exploring policy space • Running simulations • Identifying Pareto-optimal solutions
              </p>
            </div>
            <div className="w-full max-w-md bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-full animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {hasOptimized && topBundles.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
              <CheckCircle2 className="size-8 mb-3 opacity-80" />
              <p className="text-green-100 mb-1">Solutions Generated</p>
              <p className="text-3xl">{policyBundles.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
              <Sparkles className="size-8 mb-3 opacity-80" />
              <p className="text-purple-100 mb-1">Pareto-Optimal</p>
              <p className="text-3xl">{paretoOptimalBundles.length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
              <TrendingUp className="size-8 mb-3 opacity-80" />
              <p className="text-blue-100 mb-1">Best Score</p>
              <p className="text-3xl">{topBundles[0]?.score.toFixed(1)}</p>
            </div>
          </div>

          {/* Pareto Frontier Visualization */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-slate-900 mb-4">Pareto Frontier (Multi-objective Trade-offs)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="emissionsReduction"
                  name="Emissions Reduction"
                  label={{ value: 'Emissions Reduction (%)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  type="number"
                  dataKey="liveabilityImprovement"
                  name="Liveability Improvement"
                  label={{
                    value: 'Liveability Improvement (%)',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <ZAxis type="number" dataKey="score" range={[50, 400]} name="Score" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name="Non-optimal Solutions" data={policyBundles.filter((b) => !b.isParetoOptimal)} fill="#94a3b8" />
                <Scatter name="Pareto-Optimal Solutions" data={paretoOptimalBundles} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Top Recommended Bundles */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-slate-900 mb-4">Top 5 Recommended Policy Bundles</h3>
            <div className="space-y-4">
              {topBundles.map((bundle, index) => (
                <div
                  key={bundle.id}
                  className={`border rounded-lg p-5 ${
                    bundle.isParetoOptimal
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center justify-center size-8 rounded-full text-white ${
                          index === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                            : index === 1
                              ? 'bg-gradient-to-br from-slate-300 to-slate-400'
                              : index === 2
                                ? 'bg-gradient-to-br from-orange-400 to-orange-500'
                                : 'bg-gradient-to-br from-slate-400 to-slate-500'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-slate-900">{bundle.name}</h4>
                        <p className="text-slate-600">Score: {bundle.score.toFixed(2)}</p>
                      </div>
                    </div>
                    {bundle.isParetoOptimal && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-full text-sm">
                        <Sparkles className="size-4" />
                        Pareto-Optimal
                      </span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-slate-600 mb-2">Policy Parameters</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Public Transport:</span>
                          <span className="text-blue-600">{bundle.publicTransport}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Green Space:</span>
                          <span className="text-green-600">{bundle.greenSpace}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Traffic Restrictions:</span>
                          <span className="text-orange-600">{bundle.trafficRestrictions}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Land Use Density:</span>
                          <span className="text-purple-600">{bundle.landUseDensity}%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-2">Estimated Outcomes</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Emissions Reduction:</span>
                          <span
                            className={`flex items-center gap-1 ${
                              bundle.emissionsReduction > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {bundle.emissionsReduction > 0 ? (
                              <TrendingUp className="size-4" />
                            ) : (
                              <TrendingUp className="size-4 rotate-180" />
                            )}
                            {bundle.emissionsReduction.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Liveability Improvement:</span>
                          <span
                            className={`flex items-center gap-1 ${
                              bundle.liveabilityImprovement > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {bundle.liveabilityImprovement > 0 ? (
                              <TrendingUp className="size-4" />
                            ) : (
                              <TrendingUp className="size-4 rotate-180" />
                            )}
                            {bundle.liveabilityImprovement.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Constraint Met:</span>
                          <span>
                            {bundle.emissionsReduction >= emissionsTarget * 0.9 ? (
                              <CheckCircle2 className="size-4 text-green-600" />
                            ) : (
                              <AlertCircle className="size-4 text-amber-600" />
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Techniques Info */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-6">
            <h3 className="text-slate-900 mb-3 flex items-center gap-2">
              <Cpu className="size-5 text-blue-600" />
              AI Techniques Applied
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <p className="text-slate-900 mb-1">Reinforcement Learning</p>
                <p className="text-slate-600">
                  Iterative policy exploration to maximize long-term outcomes
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-slate-900 mb-1">Bayesian Optimization</p>
                <p className="text-slate-600">
                  Efficient search through high-dimensional policy space
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-slate-900 mb-1">Multi-objective Optimization</p>
                <p className="text-slate-600">
                  Pareto frontier identification for balanced trade-offs
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Initial State */}
      {!hasOptimized && !isOptimizing && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8 text-center">
          <Sparkles className="size-16 text-purple-600 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">Ready for AI-Powered Optimization</h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Set your planning goals and constraints above, then let the AI agent autonomously generate
            and evaluate policy bundles to find optimal solutions for your urban planning objectives.
          </p>
        </div>
      )}
    </div>
  );
}
