import React, { useRef } from "react";
import {
  Download,
  Upload,
  Database,
  FileJson,
  Save,
  HardDrive,
} from "lucide-react";
import { dataStore } from "../store/data";

export const DataManagement: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = dataStore.exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "erp_sentinel_data.json";
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
        alert("Data imported successfully!");
      } catch (error) {
        alert("Error importing data. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="bg-card rounded-lg shadow-chat-lg overflow-hidden">
        <div className="p-3 sm:p-6 border-b border-border">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center">
            <Database className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2 text-primary" />
            Data Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Import and export your system data
          </p>
        </div>

        <div className="p-3 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            <div className="p-4 sm:p-6 bg-muted rounded-lg animate-fade-in">
              <div className="flex items-center mb-2 sm:mb-4">
                <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-primary" />
                <h2 className="text-base sm:text-lg font-medium text-foreground">
                  Export Data
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                Download all your FAQs, user data, and system configurations in
                JSON format.
              </p>
              <button
                onClick={handleExport}
                className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Export to JSON
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-muted rounded-lg animate-fade-in">
              <div className="flex items-center mb-2 sm:mb-4">
                <FileJson className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-primary" />
                <h2 className="text-base sm:text-lg font-medium text-foreground">
                  Import Data
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                Upload a previously exported JSON file to restore your data.
                <span className="block mt-1 sm:mt-2 text-[10px] sm:text-xs text-destructive">
                  Warning: This will overwrite your current data.
                </span>
              </p>
              <div className="flex items-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-xs sm:text-sm"
                >
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Select JSON File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImport}
                  accept=".json"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-10 p-4 sm:p-6 border border-border rounded-lg bg-card animate-slide-up">
            <div className="flex items-center mb-3 sm:mb-4">
              <HardDrive className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-primary" />
              <h2 className="text-base sm:text-lg font-medium text-foreground">
                Data Storage Information
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-muted rounded-lg">
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">
                  Total Users
                </div>
                <div className="text-lg sm:text-xl font-bold text-foreground">
                  {dataStore.getUsers().length}
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-muted rounded-lg">
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">
                  Data Size
                </div>
                <div className="text-lg sm:text-xl font-bold text-foreground">
                  {(dataStore.exportData().length / 1024).toFixed(2)} KB
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-muted rounded-lg">
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">
                  Last Modified
                </div>
                <div className="text-lg sm:text-xl font-bold text-foreground">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
