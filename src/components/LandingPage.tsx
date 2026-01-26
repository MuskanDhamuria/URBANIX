import React from 'react';
import { Sparkles, TrendingUp, MapPin, GitBranch, Zap, Database, BarChart3, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

type LandingPageProps = {
  onGetStarted: () => void;
};

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: TrendingUp,
      title: 'Liveability Analytics',
      description: 'ML-weighted composite scores with PCA-inspired feature engineering and temporal analysis',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MapPin,
      title: 'Environmental Risk Mapping',
      description: 'Geospatial hotspot detection with vulnerability overlays and district-level risk scoring',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: GitBranch,
      title: 'Policy Simulation',
      description: 'Statistical forecasting and system dynamics models for impact assessment',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Sparkles,
      title: 'AI Decision Layer',
      description: 'Autonomous policy optimization using reinforcement learning and Bayesian methods',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const capabilities = [
    'Machine learning-based index weighting',
    'District-level heatmaps and rankings',
    'Multi-objective optimization',
    'Pareto-optimal solution identification',
    'Before/after policy comparisons',
    'Real-time scenario modeling',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      
      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8 animate-fade-in">
            <Cpu className="size-4 text-purple-400" />
            <span className="text-purple-300 text-sm">Brought to you by Myrm</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-fade-in">
            URBANIX.
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto animate-fade-in delay-200">
            Quantify, compare, and optimize urban liveability across space and time using
            advanced ML models and geospatial analytics
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-300">
            <button
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-medium overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Get Started
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { label: 'Data Points', value: '100K+' },
              { label: 'ML Models', value: '12+' },
              { label: 'Indicators', value: '25+' },
              { label: 'Simulations/min', value: '500+' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="p-6 bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-xl animate-fade-in"
                style={{ animationDelay: `${400 + i * 100}ms` }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-4 bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
              Comprehensive Analytics Modules
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Four integrated modules working together to provide complete urban insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative p-8 bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl hover:border-slate-600 transition-all hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"
                    style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                  />
                  
                  <div className="relative">
                    <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-xl mb-4`}>
                      <Icon className="size-8 text-white" />
                    </div>
                    <h3 className="text-2xl text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="relative py-32 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl mb-6 bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
                Advanced Capabilities
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                Leveraging cutting-edge machine learning and optimization techniques for urban planning excellence
              </p>
              <div className="space-y-4">
                {capabilities.map((capability) => (
                  <div key={capability} className="flex items-start gap-3">
                    <CheckCircle2 className="size-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-slate-300 text-lg">{capability}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl" />
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Database className="size-8 text-purple-400" />
                    <div>
                      <div className="text-white">Excel Data Import</div>
                      <div className="text-slate-400">Supports .xlsx and .xls formats</div>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                  <div className="flex items-center gap-4">
                    <BarChart3 className="size-8 text-blue-400" />
                    <div>
                      <div className="text-white">Real-time Visualization</div>
                      <div className="text-slate-400">Interactive charts and heatmaps</div>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                  <div className="flex items-center gap-4">
                    <Zap className="size-8 text-yellow-400" />
                    <div>
                      <div className="text-white">Instant Simulation</div>
                      <div className="text-slate-400">Policy impact in milliseconds</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Ready to Transform Urban Planning?
          </h2>
          <p className="text-xl text-slate-400 mb-12">
            Start analyzing your urban data with AI-powered insights today
          </p>
          <button
            onClick={onGetStarted}
            className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-lg font-medium overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2">
              Launch Platform
              <ArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-slate-500">
          <p>© 2026 Myrm</p>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
