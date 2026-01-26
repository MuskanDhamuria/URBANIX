// API Service Layer
// This module provides integration points with external APIs
// Replace placeholder endpoints with real API URLs and add authentication

import type {
  District,
  LiveabilityMetrics,
  PolicyScenario,
  ScenarioImpact,
  EnvironmentalRisk,
  TimeSeriesData,
  APIResponse
} from '../types';

// API Configuration
const API_CONFIG = {
  BASE_URL: 'YOUR_API_BASE_URL_HERE', // Replace with actual API endpoint
  API_KEY: 'YOUR_API_KEY_HERE', // Replace with actual API key
  TIMEOUT: 10000,
};

// Mock data generators for demonstration
// Replace these with actual API calls

const generateMockDistricts = (): District[] => {
  const districts = [
    'Central Business District', 'North Harbor', 'East Valley', 
    'West Park', 'South Industrial', 'Green Hills', 
    'Riverside', 'Old Town', 'Tech Quarter', 'Marina Bay'
  ];
  
  return districts.map((name, index) => ({
    id: `district-${index + 1}`,
    name,
    coordinates: {
      lat: 40.7128 + (Math.random() - 0.5) * 0.2,
      lng: -74.0060 + (Math.random() - 0.5) * 0.2,
    },
    population: Math.floor(50000 + Math.random() * 150000),
  }));
};

const generateMockLiveabilityMetrics = (): LiveabilityMetrics[] => {
  const districts = generateMockDistricts();
  
  return districts.map(district => {
    const airQuality = 50 + Math.random() * 40;
    const mobilityEfficiency = 45 + Math.random() * 45;
    const greenSpaceAccess = 30 + Math.random() * 60;
    const populationDensity = 40 + Math.random() * 50;
    const healthMetrics = 50 + Math.random() * 40;
    
    return {
      districtId: district.id,
      districtName: district.name,
      airQuality,
      mobilityEfficiency,
      greenSpaceAccess,
      populationDensity,
      healthMetrics,
      compositeScore: (airQuality + mobilityEfficiency + greenSpaceAccess + 
                       (100 - populationDensity) + healthMetrics) / 5,
    };
  });
};

const generateMockEnvironmentalRisks = (): EnvironmentalRisk[] => {
  const districts = generateMockDistricts();
  
  return districts.map(district => {
    const heatIsland = Math.random() * 5;
    const floodRisk = Math.random() * 80;
    const pollutionExposure = 20 + Math.random() * 60;
    
    return {
      districtId: district.id,
      districtName: district.name,
      heatIsland,
      floodRisk,
      pollutionExposure,
      vulnerabilityScore: (heatIsland * 10 + floodRisk + pollutionExposure) / 3,
    };
  });
};

const generateMockTimeSeries = (metric: string): TimeSeriesData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    date: `${month} 2025`,
    value: 50 + Math.random() * 30,
    metric,
  }));
};

// API Functions
// In production, replace mock data with actual fetch calls

export const api = {
  // Fetch all districts
  async getDistricts(): Promise<APIResponse<District[]>> {
    // Production implementation:
    // const response = await fetch(`${API_CONFIG.BASE_URL}/districts`, {
    //   headers: { 'Authorization': `Bearer ${API_CONFIG.API_KEY}` }
    // });
    // return response.json();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: generateMockDistricts(),
          timestamp: new Date().toISOString(),
          source: 'Mock Data Generator',
        });
      }, 500);
    });
  },

  // Fetch liveability metrics for all districts
  async getLiveabilityMetrics(): Promise<APIResponse<LiveabilityMetrics[]>> {
    // Production implementation:
    // const response = await fetch(`${API_CONFIG.BASE_URL}/liveability/metrics`, {
    //   headers: { 'Authorization': `Bearer ${API_CONFIG.API_KEY}` }
    // });
    // return response.json();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: generateMockLiveabilityMetrics(),
          timestamp: new Date().toISOString(),
          source: 'Liveability Analytics API',
        });
      }, 500);
    });
  },

  // Fetch environmental risk data
  async getEnvironmentalRisks(): Promise<APIResponse<EnvironmentalRisk[]>> {
    // Production implementation:
    // const response = await fetch(`${API_CONFIG.BASE_URL}/environmental/risks`, {
    //   headers: { 'Authorization': `Bearer ${API_CONFIG.API_KEY}` }
    // });
    // return response.json();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: generateMockEnvironmentalRisks(),
          timestamp: new Date().toISOString(),
          source: 'Environmental Risk API',
        });
      }, 500);
    });
  },

  // Simulate policy scenario impact
  async simulatePolicyScenario(scenario: PolicyScenario): Promise<APIResponse<ScenarioImpact>> {
    // Production implementation:
    // const response = await fetch(`${API_CONFIG.BASE_URL}/simulation/scenario`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(scenario),
    // });
    // return response.json();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const { parameters } = scenario;
        
        // Simple simulation logic based on parameters
        const emissionsReduction = -(parameters.publicTransportInvestment * 0.3 + 
                                     parameters.greenSpaceExpansion * 0.02 + 
                                     parameters.trafficRestrictions * 0.5);
        
        const travelTimeChange = -(parameters.publicTransportInvestment * 0.2 - 
                                   parameters.trafficRestrictions * 0.3);
        
        const heatReduction = -(parameters.greenSpaceExpansion * 0.05 + 
                               parameters.trafficRestrictions * 0.1);
        
        const floodRiskChange = -(parameters.greenSpaceExpansion * 0.08);
        
        const liveabilityImprovement = 
          (Math.abs(emissionsReduction) + Math.abs(heatReduction) + Math.abs(floodRiskChange)) / 3;
        
        resolve({
          data: {
            emissions: emissionsReduction,
            travelTime: travelTimeChange,
            heatExposure: heatReduction,
            floodRisk: floodRiskChange,
            liveabilityScore: 65 + liveabilityImprovement,
          },
          timestamp: new Date().toISOString(),
          source: 'Policy Simulation Engine',
        });
      }, 800);
    });
  },

  // Fetch time series data for trend analysis
  async getTimeSeriesData(metric: string): Promise<APIResponse<TimeSeriesData[]>> {
    // Production implementation:
    // const response = await fetch(`${API_CONFIG.BASE_URL}/timeseries/${metric}`, {
    //   headers: { 'Authorization': `Bearer ${API_CONFIG.API_KEY}` }
    // });
    // return response.json();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: generateMockTimeSeries(metric),
          timestamp: new Date().toISOString(),
          source: 'Time Series Database',
        });
      }, 500);
    });
  },
};
