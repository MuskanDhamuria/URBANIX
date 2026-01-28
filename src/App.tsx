import React, { useState } from 'react';
import { FileSpreadsheet, TrendingUp, MapPin, GitBranch, Info, Upload, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import { DataImport } from './components/DataImport';
import { LiveabilityDashboard } from './components/LiveabilityDashboard';
import { RiskMapping } from './components/RiskMapping';
import { PolicySimulation } from './components/PolicySimulation';
import { AIDecisionLayer } from './components/AIDecisionLayer';
import { HowToPage } from './components/HowToPage';
import { LandingPage } from './components/LandingPage';
import { Chatbot } from './components/Chatbot';

export type UrbanData = {
  districts: Array<{
    district: string;
    airQuality: number;
    mobilityEfficiency: number;
    greenSpaceAccess: number;
    populationDensity: number;
    healthScore: number;
    heatIslandIntensity?: number;
    floodRisk?: number;
    pollutionExposure?: number;
    year?: number;
  }>;
};

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('import');
  const [urbanData, setUrbanData] = useState<UrbanData | null>(null);

  const tabs = [
    { id: 'import', label: 'Data Import', icon: Upload },
    { id: 'liveability', label: 'Liveability Analytics', icon: TrendingUp },
    { id: 'risk', label: 'Risk Mapping', icon: MapPin },
    { id: 'policy', label: 'Policy Simulation', icon: GitBranch },
    { id: 'ai', label: 'AI Decision Layer', icon: Sparkles },
    { id: 'chatbot', label: 'AI Chatbot', icon: MessageCircle },
    { id: 'howto', label: 'How To', icon: Info },
  ];

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      
      {/* Header */}
      <header className="relative bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-lg opacity-50" />
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                  <Sparkles className="size-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-white">URBANIX.</h1>
                <p className="text-slate-400 mt-1">
                  AI-powered urban planning insights
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLanding(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap relative group ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-purple-500/10 rounded-t-lg" />
                  )}
                  <Icon className="size-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'import' && (
          <DataImport onDataLoaded={setUrbanData} currentData={urbanData} />
        )}
        {activeTab === 'liveability' && <LiveabilityDashboard data={urbanData} />}
        {activeTab === 'risk' && <RiskMapping data={urbanData} />}
        {activeTab === 'policy' && <PolicySimulation data={urbanData} />}
        {activeTab === 'ai' && <AIDecisionLayer data={urbanData} />}
        {activeTab === 'chatbot' && <Chatbot data={urbanData} />}
        {activeTab === 'howto' && <HowToPage />}
      </main>
    </div>
  );
}
