import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { Download, TrendingUp, MapPin, Activity } from 'lucide-react';
import { api } from '../services/api';
import type { LiveabilityMetrics, TimeSeriesData } from '../types';

export function LiveabilityDashboard() {
  const [metrics, setMetrics] = useState<LiveabilityMetrics[]>([]);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<LiveabilityMetrics | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [metricsResponse, timeSeriesResponse] = await Promise.all([
        api.getLiveabilityMetrics(),
        api.getTimeSeriesData('composite-liveability'),
      ]);
      
      setMetrics(metricsResponse.data);
      setTimeSeries(timeSeriesResponse.data);
      
      if (metricsResponse.data.length > 0) {
        setSelectedDistrict(metricsResponse.data[0]);
      }
    } catch (err) {
      setError('Failed to load liveability data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    // Generate CSV report
    const headers = ['District', 'Air Quality', 'Mobility', 'Green Space', 'Population Density', 'Health', 'Composite Score'];
    const rows = metrics.map(m => [
      m.districtName,
      m.airQuality.toFixed(1),
      m.mobilityEfficiency.toFixed(1),
      m.greenSpaceAccess.toFixed(1),
      m.populationDensity.toFixed(1),
      m.healthMetrics.toFixed(1),
      m.compositeScore.toFixed(1),
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liveability-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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

  // Sort districts by composite score for ranking
  const rankedDistricts = [...metrics].sort((a, b) => b.compositeScore - a.compositeScore);

  // Prepare data for charts
  const barChartData = metrics.map(m => ({
    name: m.districtName.length > 15 ? m.districtName.substring(0, 12) + '...' : m.districtName,
    fullName: m.districtName,
    'Air Quality': m.airQuality,
    'Mobility': m.mobilityEfficiency,
    'Green Space': m.greenSpaceAccess,
    'Health': m.healthMetrics,
  }));

  const radarData = selectedDistrict ? [
    { indicator: 'Air Quality', value: selectedDistrict.airQuality },
    { indicator: 'Mobility', value: selectedDistrict.mobilityEfficiency },
    { indicator: 'Green Space', value: selectedDistrict.greenSpaceAccess },
    { indicator: 'Health', value: selectedDistrict.healthMetrics },
    { indicator: 'Pop. Density', value: 100 - selectedDistrict.populationDensity }, // Inverted for better readability
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Urban Liveability Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive metrics across {metrics.length} districts
          </p>
        </div>
        <Button onClick={handleDownloadReport} className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <Download className="size-4" />
          Download Report
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Average Liveability</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="size-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {(metrics.reduce((sum, m) => sum + m.compositeScore, 0) / metrics.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Composite score across all districts</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Best Performing</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <MapPin className="size-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{rankedDistricts[0]?.districtName.split(' ')[0]}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Score: {rankedDistricts[0]?.compositeScore.toFixed(1)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Air Quality Avg</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Activity className="size-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {(metrics.reduce((sum, m) => sum + m.airQuality, 0) / metrics.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">100-point scale</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Green Space Avg</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Activity className="size-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {(metrics.reduce((sum, m) => sum + m.greenSpaceAccess, 0) / metrics.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Access score</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-Indicator Bar Chart */}
        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-semibold">District Comparison</CardTitle>
            <CardDescription>Multiple indicators across districts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card/95 backdrop-blur border border-border/40 rounded-lg p-3 shadow-xl">
                        <p className="font-semibold mb-2">{payload[0].payload.fullName}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {Number(entry.value).toFixed(1)}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }} />
                <Legend />
                <Bar dataKey="Air Quality" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Mobility" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Green Space" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Health" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart for Selected District */}
        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-semibold">District Deep Dive</CardTitle>
            <CardDescription>
              <select 
                value={selectedDistrict?.districtId || ''} 
                onChange={(e) => {
                  const district = metrics.find(m => m.districtId === e.target.value);
                  setSelectedDistrict(district || null);
                }}
                className="mt-2 px-3 py-1.5 border border-border/40 rounded-md bg-card/50 backdrop-blur text-foreground"
              >
                {metrics.map(m => (
                  <option key={m.districtId} value={m.districtId}>{m.districtName}</option>
                ))}
              </select>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                <PolarAngleAxis dataKey="indicator" stroke="#94a3b8" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
                <Radar name={selectedDistrict?.districtName} dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(20, 24, 36, 0.95)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '0.5rem' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart and Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Series Trend */}
        <Card className="lg:col-span-2 border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-semibold">Liveability Trend</CardTitle>
            <CardDescription>Composite score over time (city-wide average)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis domain={[40, 90]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(20, 24, 36, 0.95)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '0.5rem' }} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} name="Liveability Score" dot={{ fill: '#8b5cf6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* District Rankings */}
        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-semibold">District Rankings</CardTitle>
            <CardDescription>By composite score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {rankedDistricts.map((district, index) => (
                <div key={district.districtId} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border border-border/20">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/20' :
                      index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-lg shadow-slate-400/20' :
                      index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-600/20' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">{district.districtName}</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{district.compositeScore.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}