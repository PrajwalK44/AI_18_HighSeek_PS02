import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { dataStore } from '../store/data';

export const DataManagement: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = dataStore.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'erp_sentinel_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        dataStore.importData(content);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Data Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Export Data</h2>
          <p className="text-gray-600 mb-4">
            Download all your FAQs, user data, and system configurations in JSON format.
          </p>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Import Data</h2>
          <p className="text-gray-600 mb-4">
            Upload a previously exported JSON file to restore your data.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </button>
        </div>
      </div>
    </div>
  );
};