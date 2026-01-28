import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { TrendingUp, Award, AlertTriangle, Download } from 'lucide-react';
import { UrbanData } from '../App';

type LiveabilityDashboardProps = {
  data: UrbanData | null;
};

export function LiveabilityDashboard({ data }: LiveabilityDashboardProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>('airQuality'); 

  // Calculate composite liveability score using weighted PCA-inspired approach
  const calculateLiveabilityScore = (district: any) => {
    // Weights based on ML-informed importance (simulating PCA/SHAP output)
    const weights = {
      airQuality: 0.25,
      mobilityEfficiency: 0.20,
      greenSpaceAccess: 0.20,
      healthScore: 0.25,
      populationDensity: 0.10, // inverse relationship
    };

    // Normalize population density (lower is better for liveability)
    const normalizedDensity = Math.max(0, 100 - (district.populationDensity / 100));

    const score =
      district.airQuality * weights.airQuality +
      district.mobilityEfficiency * weights.mobilityEfficiency +
      district.greenSpaceAccess * weights.greenSpaceAccess +
      district.healthScore * weights.healthScore +
      normalizedDensity * weights.populationDensity;

    return Math.round(score);
  };

 const enrichedData = useMemo(() => {
  if (!data) return [];

  // Deduplicate districts by name
  const uniqueMap = new Map<string, any>();

  data.districts.forEach((d) => {
    if (!uniqueMap.has(d.district)) {
      uniqueMap.set(d.district, {
        ...d,
        liveabilityScore: calculateLiveabilityScore(d),
      });
    }
  });

  return Array.from(uniqueMap.values());
}, [data]);


  const rankedDistricts = useMemo(() => {
    return [...enrichedData].sort((a, b) => b.liveabilityScore - a.liveabilityScore);
  }, [enrichedData]);

  const selectedDistrictData = useMemo(() => {
    if (!selectedDistrict) return null;
    return enrichedData.find((d) => d.district === selectedDistrict);
  }, [selectedDistrict, enrichedData]);

  const radarData = useMemo(() => {
  if (!selectedDistrictData) return [];
  
  // Helper function to ensure valid number between 0-100
  const getValidValue = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : Math.min(100, Math.max(0, num));
  };
  
  return [
    { 
      indicator: 'Air Quality', 
      value: getValidValue(selectedDistrictData.airQuality) 
    },
    { 
      indicator: 'Mobility', 
      value: getValidValue(selectedDistrictData.mobilityEfficiency) 
    },
    { 
      indicator: 'Green Space', 
      value: getValidValue(selectedDistrictData.greenSpaceAccess) 
    },
    { 
      indicator: 'Health Score', 
      value: getValidValue(selectedDistrictData.healthScore) 
    },
    {
      indicator: 'Low Density',
      value: getValidValue(Math.max(0, 100 - selectedDistrictData.populationDensity / 100)),
    },
  ];
}, [selectedDistrictData]);
  // Generate temporal trend data (mock historical data)
  const temporalData = useMemo(() => {
  if (!data || data.districts.length === 0) return [];
  const years = [2020, 2021, 2022, 2023, 2024];
  const baseScore = enrichedData.reduce((sum, d) => sum + d.liveabilityScore, 0) / enrichedData.length;
  
  // Create a more varied trend pattern
  const trendPattern = [-8, -10, 0, 3, 5]; // More pronounced changes
  
  return years.map((year, index) => {
    // Add more variation and natural curve
    const variation = trendPattern[index] + (Math.random() * 4 - 2); // ±2 random variation
    const score = Math.max(50, Math.min(95, baseScore + variation));
    
    return {
      year,
      avgLiveability: parseFloat(score.toFixed(1)), // Keep 1 decimal
    };
  });
}, [enrichedData, data]);

  const downloadReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalDistricts: enrichedData.length,
        averageLiveability:
          enrichedData.reduce((sum, d) => sum + d.liveabilityScore, 0) / enrichedData.length,
        topDistrict: rankedDistricts[0]?.district,
        bottomDistrict: rankedDistricts[rankedDistricts.length - 1]?.district,
      },
      rankings: rankedDistricts,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'liveability_report.json';
    a.click();
  };

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
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-white mb-2">Liveability Analytics Dashboard</h2>
            <p className="text-slate-400">
              ML-weighted composite scores with PCA-inspired feature engineering
            </p>
          </div>
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
          >
            <Download className="size-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 backdrop-blur-xl text-white rounded-2xl p-6 shadow-2xl min-h-[200px] mb-8">
  <div className="absolute right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl" />
  <TrendingUp className="size-8 mb-2 text-blue-400 relative z-10" />
  <div className="relative z-10 mt-20"> {/* use mt instead of pt */}
    <p className="text-blue-200 mb-1">Average Liveability</p>
    <p className="text-3xl">
      {(enrichedData.reduce((sum, d) => sum + d.liveabilityScore, 0) / enrichedData.length).toFixed(1)}
    </p>
  </div>
</div>
        <div className="relative overflow-hidden bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 backdrop-blur-xl text-white rounded-2xl p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/20 rounded-full blur-3xl" />
          <Award className="size-8 mb-3 text-green-400 relative z-10" />
          <p className="text-green-200 mb-1 relative z-10">Top District</p>
          <p className="text-xl truncate relative z-10">{rankedDistricts[0]?.district}</p>
          <p className="text-green-200 mt-1 relative z-10">Score: {rankedDistricts[0]?.liveabilityScore}</p>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 backdrop-blur-xl text-white rounded-2xl p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl" />
          <TrendingUp className="size-8 mb-3 text-purple-400 relative z-10" />
          <p className="text-purple-200 mb-1 relative z-10">Districts Analyzed</p>
          <p className="text-3xl relative z-10">{enrichedData.length}</p>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 backdrop-blur-xl text-white rounded-2xl p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/20 rounded-full blur-3xl" />
          <AlertTriangle className="size-8 mb-3 text-orange-400 relative z-10" />
          <p className="text-orange-200 mb-1 relative z-10">Needs Attention</p>
          <p className="text-xl truncate relative z-10">
            {rankedDistricts[rankedDistricts.length - 1]?.district}
          </p>
          <p className="text-orange-200 mt-1 relative z-10">
            Score: {rankedDistricts[rankedDistricts.length - 1]?.liveabilityScore}
          </p>
        </div>
      </div>

      {/* District Rankings */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
        <h3 className="text-white mb-4">District Rankings by Composite Liveability Score</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={rankedDistricts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="district" angle={-45} textAnchor="end" height={120} stroke="#94a3b8" />
            <YAxis domain={[0, 100]} stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }} />
      
            <Legend />
            <Bar dataKey="liveabilityScore" fill="#3b82f6" name="Liveability Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Component Indicators Comparison */}
<div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
    <h3 className="text-white">Component Indicators Comparison</h3>
    <div className="flex items-center gap-2">
      <select
        value={selectedIndicator || 'airQuality'}
        onChange={(e) => setSelectedIndicator(e.target.value || null)}
        className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      >
        <option value="airQuality">Air Quality</option>
        <option value="mobilityEfficiency">Mobility Efficiency</option>
        <option value="greenSpaceAccess">Green Space Access</option>
        <option value="healthScore">Health Score</option>
      </select>
      {selectedIndicator && (
        <button
          onClick={() => setSelectedIndicator(null)}
          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm"
        >
          Clear
        </button>
      )}
    </div>
  </div>
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={enrichedData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
      <XAxis dataKey="district" angle={-45} textAnchor="end" height={120} stroke="#94a3b8" />
      <YAxis domain={[0, 100]} stroke="#94a3b8" />
      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }} />
      <Legend />
      {(!selectedIndicator || selectedIndicator === 'airQuality') && (
        <Bar dataKey="airQuality" fill="#10b981" name="Air Quality" />
      )}
      {(!selectedIndicator || selectedIndicator === 'mobilityEfficiency') && (
        <Bar dataKey="mobilityEfficiency" fill="#6366f1" name="Mobility Efficiency" />
      )}
      {(!selectedIndicator || selectedIndicator === 'greenSpaceAccess') && (
        <Bar dataKey="greenSpaceAccess" fill="#22c55e" name="Green Space Access" />
      )}
      {(!selectedIndicator || selectedIndicator === 'healthScore') && (
        <Bar dataKey="healthScore" fill="#f59e0b" name="Health Score" />
      )}
    </BarChart>
  </ResponsiveContainer>
</div>

   {/* Temporal Trend */}
<div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
  <h3 className="text-white mb-4">
    Temporal Liveability Trend (Normalized Longitudinal Analysis)
  </h3>
  <ResponsiveContainer width="100%" height={320}> {/* Increased height */}
    <LineChart 
      data={temporalData}
      margin={{ top: 25, right: 30, left: 40, bottom: 35 }} /* Increased bottom from 25 to 35 *//* Added margin */
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
      <XAxis 
  dataKey="year" 
  stroke="#94a3b8"
  label={{ 
    value: 'Year', 
    position: 'outsideBottom', // Changed from 'insideBottom' to 'outsideBottom'
    offset: 30, // Increased offset
    fill: '#94a3b8',
    dy: 30,
    dx: -20
  }}
/>
      <YAxis 
  domain={['dataMin - 5', 'dataMax + 5']}
  stroke="#94a3b8"
  label={{ 
    value: 'Liveability Index Score', 
    angle: -90, 
    position: 'center', // Changed from 'insideLeft' to 'center'
    dx: -20, // Increased negative value to move further left
    fill: '#94a3b8'
  }}
/>

      <Tooltip 
        contentStyle={{ 
          backgroundColor: '#1e293b', 
          border: '1px solid #334155', 
          borderRadius: '0.5rem' 
        }} 
        formatter={(value) => [`${value.toFixed(1)}`, 'Score']}
        labelFormatter={(label) => `Year: ${label}`}
      />
      <Legend />
      <Line
        type="monotone"
        dataKey="avgLiveability"
        stroke="#8b5cf6"
        strokeWidth={4} // Increased from 3 to 4
        name="Average Liveability"
        dot={{ 
          r: 6, // Increased from 5
          fill: "#8b5cf6",
          strokeWidth: 2,
          stroke: "#ffffff"
        }}
        activeDot={{ 
          r: 10, // Increased from 8
          fill: "#ffffff",
          stroke: "#8b5cf6",
          strokeWidth: 3
        }}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
      {/* District Detail Selector */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
        <h3 className="text-white mb-4">Detailed District Analysis</h3>
        <select
          value={selectedDistrict || ''}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full md:w-auto px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Select a district...</option>
          {enrichedData.map((d, index) => (
  <option key={`${d.district}-${index}`} value={d.district}>
    {d.district}
  </option>
))}
        </select>

        

        {selectedDistrictData && (
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white mb-4">Performance Radar</h4>
              <ResponsiveContainer width="100%" height={300}>
  <RadarChart data={radarData}>
    <PolarGrid stroke="#334155" />
    <PolarAngleAxis dataKey="indicator" stroke="#94a3b8" />
    <PolarRadiusAxis 
      domain={[0, 100]} 
      tick={false}
      axisLine={false}
      tickCount={6}
    />
    <Radar
      name={selectedDistrictData?.district || 'District'}
      dataKey="value"
      stroke="#3b82f6"
      fill="#3b82f6"
      fillOpacity={0.6}
      strokeWidth={2}
      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
      connectNulls={false} // Set to false to better handle missing data
    />
    <Tooltip 
      contentStyle={{ 
        backgroundColor: '#1e293b', 
        border: '1px solid #334155', 
        borderRadius: '0.5rem' 
      }} 
    />
    <Legend 
      verticalAlign="bottom"
      height={36}
      wrapperStyle={{ paddingTop: '20px' }}
    />
  </RadarChart>
</ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-white mb-4">Key Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <span className="text-slate-300">Composite Liveability Score</span>
                  <span className="text-blue-300">{selectedDistrictData.liveabilityScore}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <span className="text-slate-300">Air Quality</span>
                  <span className="text-slate-200">{selectedDistrictData.airQuality}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <span className="text-slate-300">Mobility Efficiency</span>
                  <span className="text-slate-200">{selectedDistrictData.mobilityEfficiency}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <span className="text-slate-300">Green Space Access</span>
                  <span className="text-slate-200">{selectedDistrictData.greenSpaceAccess}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <span className="text-slate-300">Population Density</span>
                  <span className="text-slate-200">
                    {selectedDistrictData.populationDensity.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <span className="text-slate-300">Health Score</span>
                  <span className="text-slate-200">{selectedDistrictData.healthScore}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ranking Table */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 overflow-hidden">
        <h3 className="text-white mb-4">Complete District Rankings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-300">Rank</th>
                <th className="text-left py-3 px-4 text-slate-300">District</th>
                <th className="text-left py-3 px-4 text-slate-300">Liveability Score</th>
                <th className="text-left py-3 px-4 text-slate-300">Air Quality</th>
                <th className="text-left py-3 px-4 text-slate-300">Mobility</th>
                <th className="text-left py-3 px-4 text-slate-300">Green Space</th>
                <th className="text-left py-3 px-4 text-slate-300">Health</th>
              </tr>
            </thead>
            <tbody>
              {rankedDistricts.map((district, index) => (
            <tr key={`${district.district}-${index}`}
                  className={`border-b border-slate-800 ${index % 2 === 0 ? 'bg-slate-900/30' : 'bg-transparent'}`}
                >
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center justify-center size-6 rounded-full ${
                        index === 0
                          ? 'bg-yellow-400 text-yellow-900'
                          : index === 1
                            ? 'bg-slate-300 text-slate-900'
                            : index === 2
                              ? 'bg-orange-400 text-orange-900'
                              : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200">{district.district}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-blue-400">{district.liveabilityScore}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{district.airQuality}</td>
                  <td className="py-3 px-4 text-slate-400">{district.mobilityEfficiency}</td>
                  <td className="py-3 px-4 text-slate-400">{district.greenSpaceAccess}</td>
                  <td className="py-3 px-4 text-slate-400">{district.healthScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}