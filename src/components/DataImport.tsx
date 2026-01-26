import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { UrbanData } from '../App';

type DataImportProps = {
  onDataLoaded: (data: UrbanData) => void;
  currentData: UrbanData | null;
};

export function DataImport({ onDataLoaded, currentData }: DataImportProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const processExcelFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Transform data to match expected structure
          const districts = jsonData.map((row: any) => ({
            district: row.district || row.District || '',
            airQuality: parseFloat(row.air_quality || row.airQuality || 0),
            mobilityEfficiency: parseFloat(row.mobility_efficiency || row.mobilityEfficiency || 0),
            greenSpaceAccess: parseFloat(row.green_space_access || row.greenSpaceAccess || 0),
            populationDensity: parseFloat(row.population_density || row.populationDensity || 0),
            healthScore: parseFloat(row.health_score || row.healthScore || 0),
            heatIslandIntensity: parseFloat(row.heat_island_intensity || row.heatIslandIntensity || 0),
            floodRisk: parseFloat(row.flood_risk || row.floodRisk || 0),
            pollutionExposure: parseFloat(row.pollution_exposure || row.pollutionExposure || 0),
            year: parseInt(row.year || row.Year || new Date().getFullYear()),
          }));

          onDataLoaded({ districts });
          setUploadStatus('success');
          setErrorMessage('');
        } catch (error) {
          setUploadStatus('error');
          setErrorMessage('Failed to parse Excel file. Please check the format.');
        }
      };
      reader.readAsBinaryString(file);
    },
    [onDataLoaded]
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processExcelFile(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        processExcelFile(file);
      } else {
        setUploadStatus('error');
        setErrorMessage('Please upload an Excel file (.xlsx or .xls)');
      }
    },
    [processExcelFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        district: 'Downtown',
        air_quality: 75,
        mobility_efficiency: 80,
        green_space_access: 65,
        population_density: 8500,
        health_score: 78,
        heat_island_intensity: 3.2,
        flood_risk: 2.1,
        pollution_exposure: 45,
        year: 2024,
      },
      {
        district: 'Suburbs North',
        air_quality: 85,
        mobility_efficiency: 70,
        green_space_access: 85,
        population_density: 3200,
        health_score: 82,
        heat_island_intensity: 1.8,
        flood_risk: 1.5,
        pollution_exposure: 32,
        year: 2024,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Urban Data');
    XLSX.writeFile(wb, 'urban_data_template.xlsx');
  };

  const loadSampleData = () => {
    const sampleData: UrbanData = {
      districts: [
        {
          district: 'Central Business District',
          airQuality: 72,
          mobilityEfficiency: 85,
          greenSpaceAccess: 55,
          populationDensity: 9500,
          healthScore: 75,
          heatIslandIntensity: 3.8,
          floodRisk: 2.3,
          pollutionExposure: 52,
          year: 2024,
        },
        {
          district: 'North Residential',
          airQuality: 88,
          mobilityEfficiency: 72,
          greenSpaceAccess: 82,
          populationDensity: 3500,
          healthScore: 84,
          heatIslandIntensity: 1.5,
          floodRisk: 1.2,
          pollutionExposure: 28,
          year: 2024,
        },
        {
          district: 'Industrial Zone',
          airQuality: 58,
          mobilityEfficiency: 68,
          greenSpaceAccess: 35,
          populationDensity: 2100,
          healthScore: 62,
          heatIslandIntensity: 4.5,
          floodRisk: 3.8,
          pollutionExposure: 72,
          year: 2024,
        },
        {
          district: 'West Suburbs',
          airQuality: 82,
          mobilityEfficiency: 65,
          greenSpaceAccess: 78,
          populationDensity: 2800,
          healthScore: 80,
          heatIslandIntensity: 2.1,
          floodRisk: 1.8,
          pollutionExposure: 35,
          year: 2024,
        },
        {
          district: 'Waterfront District',
          airQuality: 90,
          mobilityEfficiency: 78,
          greenSpaceAccess: 88,
          populationDensity: 4200,
          healthScore: 86,
          heatIslandIntensity: 1.2,
          floodRisk: 4.5,
          pollutionExposure: 25,
          year: 2024,
        },
        {
          district: 'South Commercial',
          airQuality: 68,
          mobilityEfficiency: 75,
          greenSpaceAccess: 48,
          populationDensity: 6500,
          healthScore: 70,
          heatIslandIntensity: 3.5,
          floodRisk: 2.8,
          pollutionExposure: 48,
          year: 2024,
        },
      ],
    };
    onDataLoaded(sampleData);
    setUploadStatus('success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
        <h2 className="text-white mb-4 flex items-center gap-2">
          <FileSpreadsheet className="size-5 text-purple-400" />
          Import Urban Analytics Data
        </h2>

        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-slate-600 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-900/80'
          }`}
        >
          <Upload className="size-12 mx-auto text-slate-500 mb-4" />
          <p className="text-slate-300 mb-2">
            Drag and drop your Excel file here, or click to browse
          </p>
          <p className="text-slate-500 mb-4">Supports .xlsx and .xls formats</p>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg cursor-pointer hover:from-purple-500 hover:to-blue-500 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
          >
            Select File
          </label>
        </div>

        {/* Status Messages */}
        {uploadStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
            <CheckCircle className="size-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-green-300">Data successfully imported!</p>
              <p className="text-green-400/80 mt-1">
                {currentData?.districts.length} districts loaded. You can now explore the analytics
                modules.
              </p>
            </div>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="size-5 text-red-400 mt-0.5" />
            <div>
              <p className="text-red-300">Import failed</p>
              <p className="text-red-400/80 mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all hover:scale-105"
          >
            <Download className="size-4" />
            Download Template
          </button>
          <button
            onClick={loadSampleData}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50"
          >
            <FileSpreadsheet className="size-4" />
            Load Sample Data
          </button>
        </div>
      </div>

      {/* Current Data Overview */}
      {currentData && (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
          <h3 className="text-white mb-4">Current Dataset Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl">
              <p className="text-blue-300">Districts</p>
              <p className="text-white text-2xl mt-1">{currentData.districts.length}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl">
              <p className="text-green-300">Avg Air Quality</p>
              <p className="text-white text-2xl mt-1">
                {(
                  currentData.districts.reduce((acc, d) => acc + d.airQuality, 0) /
                  currentData.districts.length
                ).toFixed(1)}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl">
              <p className="text-purple-300">Avg Mobility</p>
              <p className="text-white text-2xl mt-1">
                {(
                  currentData.districts.reduce((acc, d) => acc + d.mobilityEfficiency, 0) /
                  currentData.districts.length
                ).toFixed(1)}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl">
              <p className="text-orange-300">Avg Health Score</p>
              <p className="text-white text-2xl mt-1">
                {(
                  currentData.districts.reduce((acc, d) => acc + d.healthScore, 0) /
                  currentData.districts.length
                ).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}