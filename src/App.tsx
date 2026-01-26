import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card } from './components/ui/card';
import { BarChart3, Layers, Map, Activity } from 'lucide-react';
import { LiveabilityDashboard } from './components/LiveabilityDashboard';
import { PolicySimulation } from './components/PolicySimulation';
import { RiskMapping } from './components/RiskMapping';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
                <Activity className="size-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Urban Analytics Platform
                </h1>
                <p className="text-sm text-muted-foreground">
                  Advanced decision-support for sustainable urban planning
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-500">System Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card/50 backdrop-blur p-1 border border-border/40">
            <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="size-4" />
              Liveability Analytics
            </TabsTrigger>
            <TabsTrigger value="simulation" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Layers className="size-4" />
              Policy Simulation
            </TabsTrigger>
            <TabsTrigger value="risk" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Map className="size-4" />
              Risk Mapping
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <LiveabilityDashboard />
          </TabsContent>

          <TabsContent value="simulation">
            <PolicySimulation />
          </TabsContent>

          <TabsContent value="risk">
            <RiskMapping />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 py-8 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <p className="font-medium">
                Urban Liveability & Environmental Analytics Platform
              </p>
            </div>
            <div className="flex gap-6">
              <span>Sources: Satellite • Climate • Land-Use • Population</span>
              <span className="text-muted-foreground/70">Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}