import React, { useState } from 'react';
import { useTournament, TournamentFormat } from '../context/TournamentContext';
import { Save, Trash2 } from 'lucide-react';

export const TournamentSettings: React.FC = () => {
  const { tournament, setTournament, clearTournament } = useTournament();
  const [name, setName] = useState(tournament.name);
  const [format, setFormat] = useState<TournamentFormat>(tournament.format);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTournament(prev => ({
      ...prev,
      name: name.trim() || 'Untitled Tournament',
      format,
      updatedAt: new Date()
    }));
  };

  const handleClearTournament = () => {
    if (window.confirm('Are you sure you want to clear this tournament? All data will be lost.')) {
      clearTournament();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tournament Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Tournament Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter tournament name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tournament Format
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormatOption
              id="single"
              name="Single Elimination"
              description="Players are eliminated after one loss"
              selected={format === 'single'}
              onSelect={() => setFormat('single')}
            />
            <FormatOption
              id="double"
              name="Double Elimination"
              description="Players are eliminated after two losses"
              selected={format === 'double'}
              onSelect={() => setFormat('double')}
            />
            <FormatOption
              id="roundRobin"
              name="Round Robin"
              description="Each player plays against every other player"
              selected={format === 'roundRobin'}
              onSelect={() => setFormat('roundRobin')}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            onClick={handleClearTournament}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear Tournament
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" /> Save Settings
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Tournament Information</h3>
        <div className="space-y-3">
          <InfoItem label="Created" value={formatDate(tournament.createdAt)} />
          <InfoItem label="Last Updated" value={formatDate(tournament.updatedAt)} />
          <InfoItem label="Total Players" value={tournament.players.length.toString()} />
          <InfoItem label="Total Rounds" value={tournament.totalRounds.toString()} />
          <InfoItem label="Current Round" value={tournament.currentRound.toString()} />
        </div>
      </div>
    </div>
  );
};

interface FormatOptionProps {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

const FormatOption: React.FC<FormatOptionProps> = ({
  id,
  name,
  description,
  selected,
  onSelect
}) => {
  return (
    <div
      className={`p-4 border rounded-md cursor-pointer transition-colors ${
        selected
          ? 'border-green-500 bg-green-50 ring-2 ring-green-500 ring-opacity-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start">
        <input
          type="radio"
          id={id}
          name="format"
          checked={selected}
          onChange={onSelect}
          className="mt-1"
        />
        <div className="ml-3">
          <label htmlFor={id} className="block text-sm font-medium">
            {name}
          </label>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};