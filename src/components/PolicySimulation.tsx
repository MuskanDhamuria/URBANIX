import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Play, RotateCcw, Save, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { api } from '../services/api';
import type { PolicyScenario, ScenarioImpact } from '../types';

export function PolicySimulation() {
  const [scenario, setScenario] = useState<PolicyScenario>({
    id: 'scenario-1',
    name: 'Custom Scenario',
    parameters: {
      publicTransportInvestment: 10,
      greenSpaceExpansion: 50,
      trafficRestrictions: 30,
      landUseDensity: 0,
    },
  });

  const [baselineImpact] = useState<ScenarioImpact>({
    emissions: 0,
    travelTime: 0,
    heatExposure: 0,
    floodRisk: 0,
    liveabilityScore: 65,
  });

  const [simulatedImpact, setSimulatedImpact] = useState<ScenarioImpact | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParameterChange = (parameter: keyof typeof scenario.parameters, value: number[]) => {
    setScenario(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [parameter]: value[0],
      },
    }));
  };

  const runSimulation = async () => {
    try {
      setIsSimulating(true);
      setError(null);
      
      const response = await api.simulatePolicyScenario(scenario);
      setSimulatedImpact(response.data);
    } catch (err) {
      setError('Simulation failed. Please try again.');
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const resetParameters = () => {
    setScenario({
      ...scenario,
      parameters: {
        publicTransportInvestment: 10,
        greenSpaceExpansion: 50,
        trafficRestrictions: 30,
        landUseDensity: 0,
      },
    });
    setSimulatedImpact(null);
  };

  const saveScenario = () => {
    // In production, this would save to a backend
    const scenarioData = JSON.stringify(scenario, null, 2);
    const blob = new Blob([scenarioData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `policy-scenario-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Prepare comparison data
  const comparisonData = simulatedImpact ? [
    {
      metric: 'Emissions',
      baseline: 100,
      simulated: 100 + simulatedImpact.emissions,
      change: simulatedImpact.emissions,
    },
    {
      metric: 'Travel Time',
      baseline: 100,
      simulated: 100 + simulatedImpact.travelTime,
      change: simulatedImpact.travelTime,
    },
    {
      metric: 'Heat Exposure',
      baseline: 100,
      simulated: 100 + simulatedImpact.heatExposure,
      change: simulatedImpact.heatExposure,
    },
    {
      metric: 'Flood Risk',
      baseline: 100,
      simulated: 100 + simulatedImpact.floodRisk,
      change: simulatedImpact.floodRisk,
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Policy Scenario Simulation</h2>
          <p className="text-muted-foreground">
            Test the impact of policy decisions on urban liveability and environmental outcomes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveScenario} className="gap-2 border-border/40 bg-card/50 hover:bg-card">
            <Save className="size-4" />
            Save Scenario
          </Button>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="border-border/40 bg-primary/5 backdrop-blur">
        <Info className="size-4 text-primary" />
        <AlertDescription className="text-foreground/90">
          Adjust policy parameters below and click "Run Simulation" to see projected impacts. 
          Results are based on statistical models and system dynamics analysis.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive" className="border-destructive/40">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parameter Controls */}
        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-semibold">Policy Parameters</CardTitle>
            <CardDescription>Adjust inputs to test different scenarios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Public Transport Investment */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="transport" className="font-semibold">Public Transport Investment</Label>
                <span className="text-sm font-bold text-primary px-3 py-1 rounded-md bg-primary/10">
                  +{scenario.parameters.publicTransportInvestment}%
                </span>
              </div>
              <Slider
                id="transport"
                value={[scenario.parameters.publicTransportInvestment]}
                onValueChange={(value) => handleParameterChange('publicTransportInvestment', value)}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Percentage increase in public transport infrastructure and services
              </p>
            </div>

            {/* Green Space Expansion */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="greenspace" className="font-semibold">Green Space Expansion</Label>
                <span className="text-sm font-bold text-emerald-500 px-3 py-1 rounded-md bg-emerald-500/10">
                  {scenario.parameters.greenSpaceExpansion} ha
                </span>
              </div>
              <Slider
                id="greenspace"
                value={[scenario.parameters.greenSpaceExpansion]}
                onValueChange={(value) => handleParameterChange('greenSpaceExpansion', value)}
                min={0}
                max={500}
                step={10}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Additional green space and parks to be developed
              </p>
            </div>

            {/* Traffic Restrictions */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="traffic" className="font-semibold">Traffic Restrictions</Label>
                <span className="text-sm font-bold text-orange-500 px-3 py-1 rounded-md bg-orange-500/10">
                  Level {scenario.parameters.trafficRestrictions}
                </span>
              </div>
              <Slider
                id="traffic"
                value={[scenario.parameters.trafficRestrictions]}
                onValueChange={(value) => handleParameterChange('trafficRestrictions', value)}
                min={0}
                max={100}
                step={10}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Intensity of traffic restrictions in urban core (0 = none, 100 = strict)
              </p>
            </div>

            {/* Land Use Density */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="density" className="font-semibold">Land Use Density</Label>
                <span className="text-sm font-bold text-blue-500 px-3 py-1 rounded-md bg-blue-500/10">
                  {scenario.parameters.landUseDensity > 0 ? '+' : ''}{scenario.parameters.landUseDensity}%
                </span>
              </div>
              <Slider
                id="density"
                value={[scenario.parameters.landUseDensity]}
                onValueChange={(value) => handleParameterChange('landUseDensity', value)}
                min={-30}
                max={30}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Change in residential/commercial density (negative = decrease, positive = increase)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={runSimulation} disabled={isSimulating} className="flex-1 gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Play className="size-4" />
                {isSimulating ? 'Simulating...' : 'Run Simulation'}
              </Button>
              <Button onClick={resetParameters} variant="outline" className="gap-2 border-border/40 bg-card/50 hover:bg-card">
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-semibold">Simulation Results</CardTitle>
            <CardDescription>
              {simulatedImpact ? 'Projected impacts on key metrics' : 'Run a simulation to see results'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSimulating ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : simulatedImpact ? (
              <div className="space-y-6">
                {/* Liveability Score Impact */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 backdrop-blur">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-foreground">Overall Liveability Score</span>
                    {simulatedImpact.liveabilityScore > baselineImpact.liveabilityScore ? (
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <TrendingUp className="size-5 text-green-500" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-red-500/20">
                        <TrendingDown className="size-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold tracking-tight text-foreground">{simulatedImpact.liveabilityScore.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      (baseline: {baselineImpact.liveabilityScore.toFixed(1)})
                    </span>
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground font-medium">
                    Change: {(simulatedImpact.liveabilityScore - baselineImpact.liveabilityScore) > 0 ? '+' : ''}{(simulatedImpact.liveabilityScore - baselineImpact.liveabilityScore).toFixed(1)} points
                  </p>
                </div>

                {/* Individual Impact Metrics */}
                <div className="space-y-3">
                  {comparisonData.map((item) => (
                    <div key={item.metric} className="p-4 rounded-lg border border-border/40 bg-card/30 backdrop-blur hover:bg-card/50 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm text-foreground">{item.metric}</span>
                        <span className={`text-sm font-bold px-2.5 py-1 rounded-md ${
                          item.change < 0 ? 'text-green-500 bg-green-500/10' : item.change > 0 ? 'text-red-500 bg-red-500/10' : 'text-gray-500 bg-gray-500/10'
                        }`}>
                          {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${item.change < 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : item.change > 0 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gray-500'}`}
                          style={{ width: `${Math.min(100, Math.abs(item.change) * 2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <div className="mb-4 p-4 rounded-2xl bg-muted/30 inline-block">
                    <Play className="size-12 opacity-40" />
                  </div>
                  <p className="font-medium">Adjust parameters and run a simulation</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Before/After Comparison Chart */}
      {simulatedImpact && (
        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-semibold">Before/After Comparison</CardTitle>
            <CardDescription>Visual comparison of baseline vs. simulated scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="metric" stroke="#94a3b8" />
                <YAxis label={{ value: 'Index (baseline = 100)', angle: -90, position: 'insideLeft' }} stroke="#94a3b8" />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card/95 backdrop-blur border border-border/40 rounded-lg p-3 shadow-xl">
                        <p className="font-semibold mb-2">{data.metric}</p>
                        <p className="text-sm">Baseline: {data.baseline}</p>
                        <p className="text-sm">Simulated: {data.simulated.toFixed(1)}</p>
                        <p className={`text-sm font-semibold ${data.change < 0 ? 'text-green-500' : 'text-red-500'}`}>
                          Change: {data.change > 0 ? '+' : ''}{data.change.toFixed(1)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Legend />
                <Bar dataKey="baseline" fill="#94a3b8" name="Baseline" radius={[4, 4, 0, 0]} />
                <Bar dataKey="simulated" name="Simulated" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.change < 0 ? '#10b981' : entry.change > 0 ? '#ef4444' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}