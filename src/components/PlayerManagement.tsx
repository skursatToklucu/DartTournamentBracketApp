import React, { useState } from 'react';
import { useTournament, Player } from '../context/TournamentContext';
import { PlusCircle, X, MoveUp, MoveDown, Users } from 'lucide-react';

export const PlayerManagement: React.FC = () => {
  const { tournament, addPlayer, removePlayer, updatePlayer, generateBracket } = useTournament();
  const { players } = tournament;
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (id: string) => {
    removePlayer(id);
  };

  const moveSeed = (playerId: string, direction: 'up' | 'down') => {
    const playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return;
    
    const player = players[playerIndex];
    const targetIndex = direction === 'up' ? playerIndex - 1 : playerIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= players.length) return;
    
    const targetPlayer = players[targetIndex];
    
    // Swap seeds
    updatePlayer(player.id, { seed: targetPlayer.seed });
    updatePlayer(targetPlayer.id, { seed: player.seed });
  };

  const handleGenerateBracket = () => {
    generateBracket();
    // Navigate to bracket view
    window.location.hash = '#bracket';
  };

  const canGenerateBracket = players.length >= 2;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Player Management</h2>
        <button
          onClick={handleGenerateBracket}
          disabled={!canGenerateBracket}
          className={`px-4 py-2 rounded-md transition-colors ${
            canGenerateBracket
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Generate Bracket
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Player</h3>
        <form onSubmit={handleAddPlayer} className="flex space-x-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <PlusCircle className="w-5 h-5 mr-1" /> Add
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex items-center">
          <Users className="text-gray-600 w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold">
            Players ({players.length})
          </h3>
        </div>
        
        {players.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No players added yet. Add players to create a tournament.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {[...players]
              .sort((a, b) => a.seed - b.seed)
              .map((player, index) => (
                <PlayerListItem
                  key={player.id}
                  player={player}
                  onRemove={handleRemovePlayer}
                  onMoveSeed={moveSeed}
                  isFirst={index === 0}
                  isLast={index === players.length - 1}
                />
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

interface PlayerListItemProps {
  player: Player;
  onRemove: (id: string) => void;
  onMoveSeed: (id: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

const PlayerListItem: React.FC<PlayerListItemProps> = ({
  player,
  onRemove,
  onMoveSeed,
  isFirst,
  isLast
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(player.name);
  const { updatePlayer } = useTournament();

  const handleEdit = () => {
    if (isEditing && editName.trim()) {
      updatePlayer(player.id, { name: editName.trim() });
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    }
  };

  return (
    <li className="group flex items-center p-3 hover:bg-gray-50">
      <div className="w-8 text-gray-500 text-center">{player.seed}</div>
      
      <div className="flex-1 ml-3">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            autoFocus
          />
        ) : (
          <div 
            className="cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {player.name}
          </div>
        )}
      </div>
      
      <div className="flex space-x-1">
        <button
          onClick={() => onMoveSeed(player.id, 'up')}
          disabled={isFirst}
          className={`p-1 rounded-full transition-colors ${
            isFirst ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'
          }`}
          title="Move up"
        >
          <MoveUp className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onMoveSeed(player.id, 'down')}
          disabled={isLast}
          className={`p-1 rounded-full transition-colors ${
            isLast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'
          }`}
          title="Move down"
        >
          <MoveDown className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onRemove(player.id)}
          className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors"
          title="Remove player"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
};