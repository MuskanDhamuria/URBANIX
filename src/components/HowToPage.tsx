import React from 'react';
import { FileSpreadsheet, Table, AlertCircle, CheckCircle2, Download } from 'lucide-react';

export function HowToPage() {
  const requiredColumns = [
    { name: 'district', type: 'Text', description: 'Name or identifier of the district/area', example: 'Downtown, North Suburbs', required: true },
    { name: 'air_quality', type: 'Number (0-100)', description: 'Air quality index score (higher is better)', example: '75, 82', required: true },
    { name: 'mobility_efficiency', type: 'Number (0-100)', description: 'Transportation and mobility efficiency score', example: '80, 65', required: true },
    { name: 'green_space_access', type: 'Number (0-100)', description: 'Accessibility score for parks and green spaces', example: '65, 88', required: true },
    { name: 'population_density', type: 'Number', description: 'Population per square kilometer', example: '8500, 3200', required: true },
    { name: 'health_score', type: 'Number (0-100)', description: 'Composite health metrics score', example: '78, 85', required: true },
    { name: 'heat_island_intensity', type: 'Number', description: 'Urban heat island effect intensity (°C above rural baseline)', example: '3.2, 1.8', required: false },
    { name: 'flood_risk', type: 'Number (0-10)', description: 'Flood risk severity score', example: '2.1, 4.5', required: false },
    { name: 'pollution_exposure', type: 'Number (0-100)', description: 'Population exposure to pollution (higher is worse)', example: '45, 32', required: false },
    { name: 'year', type: 'Number (YYYY)', description: 'Year of data collection for temporal analysis', example: '2024, 2023', required: false },
  ];

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
        <div className="flex items-start gap-4">
          <FileSpreadsheet className="size-8 text-purple-400 mt-1" />
          <div>
            <h2 className="text-white mb-2">Excel Data Import Guide</h2>
            <p className="text-slate-400">
              This guide explains how to prepare your urban analytics data for import into the platform. Follow the column naming conventions below to ensure successful data processing.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 backdrop-blur-xl rounded-2xl p-6">
        <h3 className="text-white mb-4">Quick Start</h3>
        <ol className="space-y-3 text-slate-300">
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center size-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm">1</span>
            <span>Download the Excel template from the <strong>Data Import</strong> page</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center size-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm">2</span>
            <span>Fill in your district data following the column specifications below</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center size-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm">3</span>
            <span>Save as .xlsx or .xls format</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center size-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm">4</span>
            <span>Upload your file through the Data Import page</span>
          </li>
        </ol>
      </div>

      {/* Column Specifications */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 overflow-hidden">
        <h3 className="text-white mb-4 flex items-center gap-2">
          <Table className="size-5 text-blue-400" />
          Column Specifications
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-300">Column Name</th>
                <th className="text-left py-3 px-4 text-slate-300">Type</th>
                <th className="text-left py-3 px-4 text-slate-300">Description</th>
                <th className="text-left py-3 px-4 text-slate-300">Example</th>
                <th className="text-left py-3 px-4 text-slate-300">Required</th>
              </tr>
            </thead>
            <tbody>
              {requiredColumns.map((col, index) => (
                <tr key={col.name} className={`border-b border-slate-800 ${index % 2 === 0 ? 'bg-slate-900/30' : 'bg-transparent'}`}>
                  <td className="py-3 px-4">
                    <code className="px-2 py-1 bg-slate-950 text-purple-400 rounded text-sm border border-slate-700">{col.name}</code>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{col.type}</td>
                  <td className="py-3 px-4 text-slate-400">{col.description}</td>
                  <td className="py-3 px-4 text-slate-500">{col.example}</td>
                  <td className="py-3 px-4">
                    {col.required ? (
                      <span className="flex items-center gap-1 text-red-400">
                        <AlertCircle className="size-4" />
                        Required
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-400">
                        <CheckCircle2 className="size-4" />
                        Optional
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alternative Column Names */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
        <h3 className="text-white mb-4">Alternative Column Names</h3>
        <p className="text-slate-400 mb-4">The platform accepts both snake_case and camelCase naming conventions:</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
            <p className="text-slate-300 mb-2">Snake Case (Recommended)</p>
            <code className="text-sm text-purple-400">air_quality, mobility_efficiency, green_space_access</code>
          </div>
          <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
            <p className="text-slate-300 mb-2">Camel Case (Also Accepted)</p>
            <code className="text-sm text-blue-400">airQuality, mobilityEfficiency, greenSpaceAccess</code>
          </div>
        </div>
      </div>

      {/* Data Quality Tips */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
        <h3 className="text-white mb-4">Data Quality Tips</h3>
        <ul className="space-y-3 text-slate-400">
          <li className="flex gap-3">
            <CheckCircle2 className="size-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Ensure all numeric values are within the specified ranges</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="size-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Avoid empty cells in required columns - use 0 if no data available</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="size-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Use consistent district names across all rows for temporal analysis</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="size-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Include year column for time-series analysis and trend visualization</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="size-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Remove any header formatting or merged cells - use simple table format only</span>
          </li>
        </ul>
      </div>

      {/* Example Preview */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 overflow-hidden">
        <h3 className="text-white mb-4">Example Data Structure</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-slate-700">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="border border-slate-700 px-3 py-2 text-left text-slate-300">district</th>
                <th className="border border-slate-700 px-3 py-2 text-left text-slate-300">air_quality</th>
                <th className="border border-slate-700 px-3 py-2 text-left text-slate-300">mobility_efficiency</th>
                <th className="border border-slate-700 px-3 py-2 text-left text-slate-300">green_space_access</th>
                <th className="border border-slate-700 px-3 py-2 text-left text-slate-300">population_density</th>
                <th className="border border-slate-700 px-3 py-2 text-left text-slate-300">health_score</th>
                <th className="border border-slate-700 px-3 py-2 text-left text-slate-300">year</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-900/30">
                <td className="border border-slate-700 px-3 py-2 text-slate-200">Downtown</td>
                <td className="border border-slate-700 px-3 py-2 text-slate-400">75</td>
                <td className="border border-slate-700 px-3 py-2 text-slate-400">80</td>
                <td className="border border-slate-700 px-3 py-2 text-slate-400">65</td>
                <td className="border border-slate-700 px-3 py-2 text-slate-400">8500</td>
                <td className="border border-slate-700 px-3 py-2 text-slate-400">78</td>
                <td className="border border-slate-700 px-3 py-2 text-slate-400">2024</td>
              </tr>
              <tr>
                <td className="border border-slate-700 px-3 py-2 text-slate-200">North Suburbs</td>
                <td className="border border-slate-700 px-3 py-2 text-slate-400">85</td>
                <td className="border border-slate-700 px-3 py-2 text-slate-400">70</td>
                <td className="border border-slate-700 px-3 py-2 text-slate-400">85</td>
                <td className="border border-slate-700 px-3 py-2 text-slate-400">3200</td>
                <td className="border border-slate-700 px-3 py-2 text-slate-400">82</td>
                <td className="border border-slate-700 px-3 py-2 text-slate-400">2024</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
