import React, { useEffect, useRef, useState } from 'react';
import { useTournament, Match, Player } from '../context/TournamentContext';
import { Trophy } from 'lucide-react';

export const BracketView: React.FC = () => {
  const { tournament, updateMatch } = useTournament();
  const { matches, players, totalRounds } = tournament;
  const bracketRef = useRef<HTMLDivElement>(null);
  const [showLoserBracket, setShowLoserBracket] = useState(true);

  const getPlayer = (id: string | null): Player | undefined => {
    if (!id) return undefined;
    return players.find(p => p.id === id);
  };

  const winnerMatches = matches
    .filter(match => !match.isLoserBracket && !match.isFinalMatch)
    .reduce((acc, match) => {
      const round = acc[match.round - 1] || [];
      round.push(match);
      acc[match.round - 1] = round.sort((a, b) => a.position - b.position);
      return acc;
    }, [] as Match[][]);

  const loserMatches = matches
    .filter(match => match.isLoserBracket)
    .reduce((acc, match) => {
      const round = acc[match.round - 1] || [];
      round.push(match);
      acc[match.round - 1] = round.sort((a, b) => a.position - b.position);
      return acc;
    }, [] as Match[][]);

  const finalMatch = matches.find(match => match.isFinalMatch);

  const exportBracket = () => {
    window.print();
  };

  const bracketWidth = totalRounds * 240;

  useEffect(() => {
    const matchElements = document.querySelectorAll('.match-card');
    matchElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('opacity-100', 'translate-y-0');
      }, i * 50);
    });
  }, [matches]);

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md">
          <Trophy className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Bracket Generated</h2>
          <p className="text-gray-600 mb-6">
            Add players in the Players tab and then generate a bracket to start your tournament.
          </p>
          <button
            onClick={() => window.location.hash = '#players'}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Add Players
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tournament Bracket</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowLoserBracket(!showLoserBracket)}
            className={`px-4 py-2 rounded-md transition-colors ${
              showLoserBracket 
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {showLoserBracket ? 'Hide Loser Bracket' : 'Show Loser Bracket'}
          </button>
          <button
            onClick={exportBracket}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Export/Print
          </button>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Winners Bracket */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Winners Bracket</h3>
          <div 
            ref={bracketRef}
            className="overflow-x-auto pb-6"
          >
            <div 
              className="flex space-x-8 min-w-min"
              style={{ width: `${bracketWidth}px` }}
            >
              {winnerMatches.map((roundMatches, roundIndex) => (
                <div key={`winner-round-${roundIndex + 1}`} className="flex-1 flex flex-col space-y-4">
                  <div className="text-center bg-green-100 py-2 rounded-md font-medium shadow-sm">
                    Round {roundIndex + 1}
                  </div>
                  <div className="flex flex-col space-y-8 justify-around h-full">
                    {roundMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        player1={getPlayer(match.player1Id)}
                        player2={getPlayer(match.player2Id)}
                        winner={getPlayer(match.winnerId)}
                        onUpdateMatch={updateMatch}
                        isFinal={false}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final Match */}
        {finalMatch && finalMatch.player1Id && finalMatch.player2Id && (
          <div className="my-8">
            <h3 className="text-xl font-semibold mb-4 text-center">Championship Match</h3>
            <div className="flex justify-center">
              <MatchCard
                key={finalMatch.id}
                match={finalMatch}
                player1={getPlayer(finalMatch.player1Id)}
                player2={getPlayer(finalMatch.player2Id)}
                winner={getPlayer(finalMatch.winnerId)}
                onUpdateMatch={updateMatch}
                isFinal={true}
              />
            </div>
          </div>
        )}

        {/* Losers Bracket */}
        {showLoserBracket && loserMatches.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Losers Bracket</h3>
            <div 
              className="overflow-x-auto pb-6"
            >
              <div 
                className="flex space-x-8 min-w-min"
                style={{ width: `${bracketWidth * 1.5}px` }}
              >
                {loserMatches.map((roundMatches, roundIndex) => (
                  <div key={`loser-round-${roundIndex + 1}`} className="flex-1 flex flex-col space-y-4">
                    <div className="text-center bg-red-100 py-2 rounded-md font-medium shadow-sm">
                      Round {roundIndex + 1}
                    </div>
                    <div className="flex flex-col space-y-8 justify-around h-full">
                      {roundMatches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          player1={getPlayer(match.player1Id)}
                          player2={getPlayer(match.player2Id)}
                          winner={getPlayer(match.winnerId)}
                          onUpdateMatch={updateMatch}
                          isFinal={false}
                          isLoserBracket={true}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MatchCardProps {
  match: Match;
  player1?: Player;
  player2?: Player;
  winner?: Player;
  onUpdateMatch: (id: string, data: Partial<Match>) => void;
  isFinal: boolean;
  isLoserBracket?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  player1,
  player2,
  winner,
  onUpdateMatch,
  isFinal,
  isLoserBracket
}) => {
  const handleWinner = (playerId: string | null) => {
    if (playerId === match.winnerId) {
      onUpdateMatch(match.id, { winnerId: null });
    } else {
      onUpdateMatch(match.id, { winnerId: playerId });
    }
  };

  const handleScoreChange = (player: 'player1' | 'player2', score: string) => {
    const numScore = parseInt(score, 10);
    if (isNaN(numScore)) return;
    
    if (player === 'player1') {
      onUpdateMatch(match.id, { player1Score: Math.max(0, numScore) });
    } else {
      onUpdateMatch(match.id, { player2Score: Math.max(0, numScore) });
    }
  };

  return (
    <div 
      className={`match-card bg-white rounded-lg shadow-md p-4 w-52 opacity-0 translate-y-4 transition-all duration-300 ease-out ${
        isLoserBracket ? 'border-l-4 border-red-500' : ''
      } ${isFinal ? 'border-2 border-amber-500' : ''}`}
    >
      {isFinal && (
        <div className="text-center text-amber-600 font-semibold mb-2 flex justify-center items-center">
          <Trophy className="w-4 h-4 mr-1" /> Championship Match
        </div>
      )}
      
      <PlayerSlot
        player={player1}
        score={match.player1Score}
        isWinner={match.winnerId === player1?.id}
        onSelect={() => player1 && handleWinner(player1.id)}
        onScoreChange={(score) => handleScoreChange('player1', score)}
        position="top"
      />
      
      <div className="my-2 border-t border-gray-200"></div>
      
      <PlayerSlot
        player={player2}
        score={match.player2Score}
        isWinner={match.winnerId === player2?.id}
        onSelect={() => player2 && handleWinner(player2.id)}
        onScoreChange={(score) => handleScoreChange('player2', score)}
        position="bottom"
      />
    </div>
  );
};

interface PlayerSlotProps {
  player?: Player;
  score?: number;
  isWinner: boolean;
  onSelect: () => void;
  onScoreChange: (score: string) => void;
  position: 'top' | 'bottom';
}

const PlayerSlot: React.FC<PlayerSlotProps> = ({
  player,
  score,
  isWinner,
  onSelect,
  onScoreChange,
  position
}) => {
  if (!player) {
    return (
      <div className="flex justify-between items-center h-10 px-2 py-1 rounded bg-gray-100 text-gray-400 italic">
        <span>TBD</span>
        <span className="text-xs">-</span>
      </div>
    );
  }

  return (
    <div 
      className={`flex justify-between items-center h-10 px-2 py-1 rounded cursor-pointer transition-colors ${
        isWinner 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-50 hover:bg-gray-100'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center">
        <span className="text-sm font-medium truncate max-w-[100px]">
          {isWinner && <span className="text-green-600 mr-1">✓</span>}
          {player.name}
        </span>
      </div>
      <input
        type="number"
        value={score !== undefined ? score : ''}
        onChange={(e) => onScoreChange(e.target.value)}
        min="0"
        className="w-10 text-center bg-white border rounded p-1 text-xs"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};