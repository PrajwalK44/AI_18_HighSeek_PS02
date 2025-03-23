import React, { useRef } from 'react';
import { Download, Upload, Database } from 'lucide-react';
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6 animate-fade-in flex items-center">
        <Database className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary" />
        Data Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-fade-in">
        <div className="bg-card border border-border p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Export Data</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Download all your FAQs, user data, and system configurations in JSON format.
          </p>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>

        <div className="bg-card border border-border p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Import Data</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Upload a previously exported JSON file to restore your data.
            <span className="block mt-2 text-xs text-destructive">
              Warning: This will overwrite your current data.
            </span>
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
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </button>
        </div>
      </div>
    </div>
  );
};