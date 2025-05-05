import React, { useEffect, useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Save, Upload, Download } from 'lucide-react';

export const SaveLoad: React.FC = () => {
  const { tournament, saveTournament, loadTournament } = useTournament();
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);

  useEffect(() => {
    // Check if there's saved tournament data
    const savedData = localStorage.getItem('dartTournament');
    setHasSavedData(!!savedData);
  }, []);

  const handleSave = () => {
    saveTournament();
    setShowSaveSuccess(true);
    setHasSavedData(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleLoad = () => {
    const savedData = localStorage.getItem('dartTournament');
    if (savedData) {
      loadTournament(savedData);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(tournament, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${tournament.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        try {
          loadTournament(content);
        } catch (error) {
          console.error('Error importing tournament:', error);
          alert('Invalid tournament file format');
        }
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
      {showSaveSuccess && (
        <div className="animate-fade-in-out bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md">
          Tournament saved successfully!
        </div>
      )}
      
      <div className="flex space-x-2">
        <input 
          type="file" 
          id="import-file" 
          className="hidden" 
          accept=".json"
          onChange={handleImport}
        />
        
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Export Tournament"
        >
          <Download className="w-5 h-5" />
        </button>
        
        <label
          htmlFor="import-file"
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors cursor-pointer"
          title="Import Tournament"
        >
          <Upload className="w-5 h-5" />
        </label>
        
        {hasSavedData && (
          <button
            onClick={handleLoad}
            className="bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition-colors"
            title="Load Saved Tournament"
          >
            <div className="w-5 h-5 flex items-center justify-center">↺</div>
          </button>
        )}
        
        <button
          onClick={handleSave}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
          title="Save Tournament"
        >
          <Save className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};