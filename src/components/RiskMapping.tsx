import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertTriangle, Droplets, Thermometer, Wind, MapPin, Filter } from 'lucide-react';
import { api } from '../services/api';
import type { EnvironmentalRisk } from '../types';

type RiskCategory = 'all' | 'heat' | 'flood' | 'pollution';

export function RiskMapping() {
  const [risks, setRisks] = useState<EnvironmentalRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<EnvironmentalRisk | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getEnvironmentalRisks();
      setRisks(response.data);
      
      if (response.data.length > 0) {
        setSelectedDistrict(response.data[0]);
      }
    } catch (err) {
      setError('Failed to load environmental risk data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (score: number): { level: string; color: string } => {
    if (score >= 70) return { level: 'Critical', color: 'bg-red-600' };
    if (score >= 50) return { level: 'High', color: 'bg-orange-500' };
    if (score >= 30) return { level: 'Moderate', color: 'bg-yellow-500' };
    return { level: 'Low', color: 'bg-green-600' };
  };

  const getFilteredRisks = (): EnvironmentalRisk[] => {
    let filtered = [...risks];
    
    // Sort based on selected category
    switch (selectedCategory) {
      case 'heat':
        filtered.sort((a, b) => b.heatIsland - a.heatIsland);
        break;
      case 'flood':
        filtered.sort((a, b) => b.floodRisk - a.floodRisk);
        break;
      case 'pollution':
        filtered.sort((a, b) => b.pollutionExposure - a.pollutionExposure);
        break;
      default:
        filtered.sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore);
    }
    
    return filtered;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const filteredRisks = getFilteredRisks();
  const avgVulnerability = risks.reduce((sum, r) => sum + r.vulnerabilityScore, 0) / risks.length;
  const criticalDistricts = risks.filter(r => r.vulnerabilityScore >= 70).length;
  const avgHeatIsland = risks.reduce((sum, r) => sum + r.heatIsland, 0) / risks.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Environmental Risk Mapping</h2>
          <p className="text-muted-foreground">
            Geospatial analysis of environmental stressors and vulnerability
          </p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Avg Vulnerability</CardTitle>
            <div className="p-2 rounded-lg bg-orange-500/10">
              <AlertTriangle className="size-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{avgVulnerability.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">Composite risk score</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Critical Districts</CardTitle>
            <div className="p-2 rounded-lg bg-red-500/10">
              <MapPin className="size-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{criticalDistricts}</div>
            <p className="text-xs text-muted-foreground mt-1">Score ≥ 70</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Avg Heat Island</CardTitle>
            <div className="p-2 rounded-lg bg-orange-600/10">
              <Thermometer className="size-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">+{avgHeatIsland.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground mt-1">Above ambient</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Data Sources</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Wind className="size-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">4</div>
            <p className="text-xs text-muted-foreground mt-1">Satellite, climate, land-use</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Placeholder */}
        <Card className="lg:col-span-2 border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-semibold">District Risk Map</CardTitle>
            <CardDescription>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Button 
                  variant={selectedCategory === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="gap-1"
                >
                  <Filter className="size-3" />
                  All Risks
                </Button>
                <Button 
                  variant={selectedCategory === 'heat' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedCategory('heat')}
                  className="gap-1"
                >
                  <Thermometer className="size-3" />
                  Heat
                </Button>
                <Button 
                  variant={selectedCategory === 'flood' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedCategory('flood')}
                  className="gap-1"
                >
                  <Droplets className="size-3" />
                  Flood
                </Button>
                <Button 
                  variant={selectedCategory === 'pollution' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedCategory('pollution')}
                  className="gap-1"
                >
                  <Wind className="size-3" />
                  Pollution
                </Button>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Visual Map Grid */}
            <div className="grid grid-cols-5 gap-2 mb-6 p-4 rounded-xl bg-muted/20 border border-border/20">
              {filteredRisks.map((risk) => {
                let intensity = 0;
                switch (selectedCategory) {
                  case 'heat':
                    intensity = risk.heatIsland * 20;
                    break;
                  case 'flood':
                    intensity = risk.floodRisk;
                    break;
                  case 'pollution':
                    intensity = risk.pollutionExposure;
                    break;
                  default:
                    intensity = risk.vulnerabilityScore;
                }
                
                const getColor = (val: number) => {
                  if (val >= 70) return 'bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-600/30';
                  if (val >= 50) return 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20';
                  if (val >= 30) return 'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/20';
                  return 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20';
                };
                
                return (
                  <button
                    key={risk.districtId}
                    onClick={() => setSelectedDistrict(risk)}
                    className={`aspect-square rounded-lg ${getColor(intensity)} hover:ring-2 hover:ring-primary transition-all ${
                      selectedDistrict?.districtId === risk.districtId ? 'ring-2 ring-primary scale-110' : ''
                    }`}
                    title={`${risk.districtName}: ${intensity.toFixed(1)}`}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between border-t border-border/40 pt-4">
              <span className="text-sm font-semibold">Risk Level:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-green-600 shadow-sm" />
                  <span className="text-xs font-medium">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-sm" />
                  <span className="text-xs font-medium">Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm" />
                  <span className="text-xs font-medium">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-red-600 to-red-700 shadow-sm" />
                  <span className="text-xs font-medium">Critical</span>
                </div>
              </div>
            </div>

            {/* Selected District Info */}
            {selectedDistrict && (
              <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/40 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg">{selectedDistrict.districtName}</h4>
                  <Badge className={`${getRiskLevel(selectedDistrict.vulnerabilityScore).color} text-white border-0 px-3 py-1`}>
                    {getRiskLevel(selectedDistrict.vulnerabilityScore).level}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-card/50 backdrop-blur border border-border/20">
                    <span className="text-muted-foreground block mb-1">Heat Island</span>
                    <span className="font-bold text-lg">+{selectedDistrict.heatIsland.toFixed(1)}°C</span>
                  </div>
                  <div className="p-3 rounded-lg bg-card/50 backdrop-blur border border-border/20">
                    <span className="text-muted-foreground block mb-1">Flood Risk</span>
                    <span className="font-bold text-lg">{selectedDistrict.floodRisk.toFixed(1)}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-card/50 backdrop-blur border border-border/20">
                    <span className="text-muted-foreground block mb-1">Pollution</span>
                    <span className="font-bold text-lg">{selectedDistrict.pollutionExposure.toFixed(1)} PM2.5</span>
                  </div>
                  <div className="p-3 rounded-lg bg-card/50 backdrop-blur border border-border/20">
                    <span className="text-muted-foreground block mb-1">Vulnerability</span>
                    <span className="font-bold text-lg">{selectedDistrict.vulnerabilityScore.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* District List with Risk Scores */}
        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-semibold">District Rankings</CardTitle>
            <CardDescription>
              Sorted by {selectedCategory === 'all' ? 'overall vulnerability' : `${selectedCategory} risk`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredRisks.map((risk, index) => {
                let score = risk.vulnerabilityScore;
                let icon = <AlertTriangle className="size-4" />;
                
                switch (selectedCategory) {
                  case 'heat':
                    score = risk.heatIsland * 20;
                    icon = <Thermometer className="size-4" />;
                    break;
                  case 'flood':
                    score = risk.floodRisk;
                    icon = <Droplets className="size-4" />;
                    break;
                  case 'pollution':
                    score = risk.pollutionExposure;
                    icon = <Wind className="size-4" />;
                    break;
                }
                
                const riskInfo = getRiskLevel(score);
                
                return (
                  <button
                    key={risk.districtId}
                    onClick={() => setSelectedDistrict(risk)}
                    className={`w-full p-3 rounded-lg border border-border/40 text-left transition-all hover:bg-muted/30 ${
                      selectedDistrict?.districtId === risk.districtId ? 'bg-muted/40 ring-2 ring-primary' : 'bg-card/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${riskInfo.color}/10`}>
                          {icon}
                        </div>
                        <span className="font-medium text-sm">{risk.districtName}</span>
                      </div>
                      <Badge variant="outline" className={`${riskInfo.color} text-white border-0 text-xs`}>
                        {riskInfo.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className={`${riskInfo.color} transition-all`}
                          style={{ width: `${Math.min(100, score)}%`, height: '100%' }}
                        />
                      </div>
                      <span className="text-xs font-bold">{score.toFixed(1)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Risk Analysis */}
      <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-semibold">Risk Category Breakdown</CardTitle>
          <CardDescription>Comparative analysis across all districts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="heat" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/30 border border-border/40">
              <TabsTrigger value="heat">Heat Islands</TabsTrigger>
              <TabsTrigger value="flood">Flood Risk</TabsTrigger>
              <TabsTrigger value="pollution">Pollution</TabsTrigger>
            </TabsList>
            
            <TabsContent value="heat" className="space-y-3 mt-4">
              {[...risks].sort((a, b) => b.heatIsland - a.heatIsland).slice(0, 5).map((risk) => (
                <div key={risk.districtId} className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-card/30 backdrop-blur hover:bg-card/50 transition-colors">
                  <span className="font-medium">{risk.districtName}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2.5 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600" 
                        style={{ width: `${Math.min(100, risk.heatIsland * 20)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-16 text-right">+{risk.heatIsland.toFixed(1)}°C</span>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="flood" className="space-y-3 mt-4">
              {[...risks].sort((a, b) => b.floodRisk - a.floodRisk).slice(0, 5).map((risk) => (
                <div key={risk.districtId} className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-card/30 backdrop-blur hover:bg-card/50 transition-colors">
                  <span className="font-medium">{risk.districtName}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2.5 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600" 
                        style={{ width: `${risk.floodRisk}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-16 text-right">{risk.floodRisk.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="pollution" className="space-y-3 mt-4">
              {[...risks].sort((a, b) => b.pollutionExposure - a.pollutionExposure).slice(0, 5).map((risk) => (
                <div key={risk.districtId} className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-card/30 backdrop-blur hover:bg-card/50 transition-colors">
                  <span className="font-medium">{risk.districtName}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2.5 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600" 
                        style={{ width: `${risk.pollutionExposure}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-16 text-right">{risk.pollutionExposure.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}