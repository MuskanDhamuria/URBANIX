// Core data types for the Urban Liveability & Environmental Analytics Platform

export interface District {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  population: number;
}

export interface LiveabilityMetrics {
  districtId: string;
  districtName: string;
  airQuality: number; // 0-100 scale
  mobilityEfficiency: number;
  greenSpaceAccess: number;
  populationDensity: number;
  healthMetrics: number;
  compositeScore: number;
}

export interface PolicyScenario {
  id: string;
  name: string;
  parameters: {
    publicTransportInvestment: number; // percentage increase
    greenSpaceExpansion: number; // hectares
    trafficRestrictions: number; // 0-100 scale
    landUseDensity: number; // percentage change
  };
}

export interface ScenarioImpact {
  emissions: number; // percentage change
  travelTime: number; // percentage change
  heatExposure: number; // percentage change
  floodRisk: number; // percentage change
  liveabilityScore: number; // new composite score
}

export interface EnvironmentalRisk {
  districtId: string;
  districtName: string;
  heatIsland: number; // temperature increase in °C
  floodRisk: number; // 0-100 risk score
  pollutionExposure: number; // PM2.5 concentration
  vulnerabilityScore: number; // composite risk score
}

export interface TimeSeriesData {
  date: string;
  value: number;
  metric: string;
}

export interface APIResponse<T> {
  data: T;
  timestamp: string;
  source: string;
}
