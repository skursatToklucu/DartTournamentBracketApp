import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the types
export interface Player {
  id: string;
  name: string;
  seed: number;
}

export interface Match {
  id: string;
  round: number;
  position: number;
  player1Id: string | null;
  player2Id: string | null;
  winnerId: string | null;
  player1Score?: number;
  player2Score?: number;
  isLoserBracket: boolean;
  isFinalMatch?: boolean;
}

export type TournamentFormat = 'single' | 'double' | 'roundRobin';

export interface Tournament {
  id: string;
  name: string;
  format: TournamentFormat;
  players: Player[];
  matches: Match[];
  currentRound: number;
  totalRounds: number;
  createdAt: Date;
  updatedAt: Date;
  winnerBracketChampion: string | null;
  loserBracketChampion: string | null;
}

// Create a default tournament
const createDefaultTournament = (): Tournament => {
  return {
    id: crypto.randomUUID(),
    name: 'New Tournament',
    format: 'double',
    players: [],
    matches: [],
    currentRound: 0,
    totalRounds: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    winnerBracketChampion: null,
    loserBracketChampion: null
  };
};

// Context interface
interface TournamentContextType {
  tournament: Tournament;
  setTournament: React.Dispatch<React.SetStateAction<Tournament>>;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updatePlayer: (id: string, data: Partial<Player>) => void;
  generateBracket: () => void;
  updateMatch: (id: string, data: Partial<Match>) => void;
  clearTournament: () => void;
  saveTournament: () => void;
  loadTournament: (data: string) => void;
}

// Create the context
const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

// Provider component
export const TournamentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tournament, setTournament] = useState<Tournament>(createDefaultTournament());

  const addPlayer = (name: string) => {
    setTournament(prev => {
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name,
        seed: prev.players.length + 1,
      };
      return {
        ...prev,
        players: [...prev.players, newPlayer],
        updatedAt: new Date(),
      };
    });
  };

  const removePlayer = (id: string) => {
    setTournament(prev => ({
      ...prev,
      players: prev.players.filter(player => player.id !== id).map((player, index) => ({
        ...player,
        seed: index + 1
      })),
      updatedAt: new Date(),
    }));
  };

  const updatePlayer = (id: string, data: Partial<Player>) => {
    setTournament(prev => ({
      ...prev,
      players: prev.players.map(player => 
        player.id === id ? { ...player, ...data } : player
      ),
      updatedAt: new Date(),
    }));
  };

  const generateBracket = () => {
    const { players } = tournament;
    
    if (players.length < 2) return;
    
    const totalRounds = Math.ceil(Math.log2(players.length));
    const sortedPlayers = [...players].sort((a, b) => a.seed - b.seed);
    let matches: Match[] = [];
    
    // Winners Bracket - First round matches
    const firstRoundMatchCount = Math.pow(2, totalRounds - 1);
    
    for (let i = 0; i < firstRoundMatchCount; i++) {
      const player1Index = i;
      const player2Index = firstRoundMatchCount * 2 - 1 - i;
      
      const match: Match = {
        id: crypto.randomUUID(),
        round: 1,
        position: i + 1,
        player1Id: player1Index < sortedPlayers.length ? sortedPlayers[player1Index].id : null,
        player2Id: player2Index < sortedPlayers.length ? sortedPlayers[player2Index].id : null,
        winnerId: null,
        isLoserBracket: false,
        player1Score: 0,
        player2Score: 0
      };
      
      if (match.player1Id && !match.player2Id) {
        match.winnerId = match.player1Id;
      } else if (!match.player1Id && match.player2Id) {
        match.winnerId = match.player2Id;
      }
      
      matches.push(match);
    }
    
    // Winners Bracket - Subsequent rounds
    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = Math.pow(2, totalRounds - round);
      
      for (let i = 0; i < matchesInRound; i++) {
        const match: Match = {
          id: crypto.randomUUID(),
          round,
          position: i + 1,
          player1Id: null,
          player2Id: null,
          winnerId: null,
          isLoserBracket: false,
          player1Score: 0,
          player2Score: 0
        };
        matches.push(match);
      }
    }

    // Losers Bracket
    let loserMatchCount = Math.floor(players.length / 2);
    let currentRound = 1;

    while (loserMatchCount >= 1) {
      for (let i = 0; i < loserMatchCount; i++) {
        matches.push({
          id: crypto.randomUUID(),
          round: currentRound,
          position: i + 1,
          player1Id: null,
          player2Id: null,
          winnerId: null,
          isLoserBracket: true,
          player1Score: 0,
          player2Score: 0
        });
      }

      loserMatchCount = Math.floor(loserMatchCount / 2);
      currentRound++;
    }

    // Add final match placeholder
    matches.push({
      id: crypto.randomUUID(),
      round: totalRounds + 1,
      position: 1,
      player1Id: null,
      player2Id: null,
      winnerId: null,
      isLoserBracket: false,
      isFinalMatch: true,
      player1Score: 0,
      player2Score: 0
    });

    setTournament(prev => ({
      ...prev,
      matches,
      totalRounds,
      currentRound: 1,
      updatedAt: new Date(),
      winnerBracketChampion: null,
      loserBracketChampion: null
    }));
  };

  const updateMatch = (id: string, data: Partial<Match>) => {
    setTournament(prev => {
      const updatedMatches = prev.matches.map(match => {
        if (match.id === id) {
          // Ensure scores don't go below 0
          const updatedData = {
            ...data,
            player1Score: data.player1Score !== undefined ? Math.max(0, data.player1Score) : match.player1Score,
            player2Score: data.player2Score !== undefined ? Math.max(0, data.player2Score) : match.player2Score
          };
          return { ...match, ...updatedData };
        }
        return match;
      });

      const updatedMatch = updatedMatches.find(m => m.id === id);
      if (!updatedMatch || !updatedMatch.winnerId) {
        return { ...prev, matches: updatedMatches };
      }

      let winnerBracketChampion = prev.winnerBracketChampion;
      let loserBracketChampion = prev.loserBracketChampion;

      if (updatedMatch.isLoserBracket) {
        // Check if this is the final loser bracket match
        const isLastLoserMatch = !updatedMatches.some(
          m => m.isLoserBracket && 
              m.round > updatedMatch.round && 
              !m.winnerId
        );

        if (isLastLoserMatch) {
          loserBracketChampion = updatedMatch.winnerId;
          
          // If we have both champions, set up the final match
          if (winnerBracketChampion) {
            const finalMatch = updatedMatches.find(m => m.isFinalMatch);
            if (finalMatch) {
              finalMatch.player1Id = winnerBracketChampion;
              finalMatch.player2Id = loserBracketChampion;
            }
          }
        } else {
          // Handle regular loser bracket advancement
          const nextRound = updatedMatch.round + 1;
          const nextPosition = Math.ceil(updatedMatch.position / 2);
          
          const nextMatch = updatedMatches.find(
            m => m.isLoserBracket && 
                m.round === nextRound && 
                m.position === nextPosition
          );

          if (nextMatch) {
            if (!nextMatch.player1Id) {
              nextMatch.player1Id = updatedMatch.winnerId;
            } else {
              nextMatch.player2Id = updatedMatch.winnerId;
            }
          }
        }
      } else if (!updatedMatch.isFinalMatch) {
        // Handle winner bracket advancement
        const nextRound = updatedMatch.round + 1;
        const nextPosition = Math.ceil(updatedMatch.position / 2);
        
        const nextWinnerMatch = updatedMatches.find(
          m => !m.isLoserBracket && !m.isFinalMatch && m.round === nextRound && m.position === nextPosition
        );
        
        if (nextWinnerMatch) {
          if (updatedMatch.position % 2 !== 0) {
            nextWinnerMatch.player1Id = updatedMatch.winnerId;
          } else {
            nextWinnerMatch.player2Id = updatedMatch.winnerId;
          }
        } else {
          // This was the final winner bracket match
          winnerBracketChampion = updatedMatch.winnerId;
          
          // If we have both champions, set up the final match
          if (loserBracketChampion) {
            const finalMatch = updatedMatches.find(m => m.isFinalMatch);
            if (finalMatch) {
              finalMatch.player1Id = updatedMatch.winnerId;
              finalMatch.player2Id = loserBracketChampion;
            }
          }
        }

        // Move loser to loser bracket
        const loserId = updatedMatch.player1Id === updatedMatch.winnerId 
          ? updatedMatch.player2Id 
          : updatedMatch.player1Id;

        if (loserId) {
          const isAlreadyInLoserBracket = updatedMatches.some(
            m => m.isLoserBracket && (m.player1Id === loserId || m.player2Id === loserId)
          );

          if (!isAlreadyInLoserBracket) {
            const loserMatch = updatedMatches.find(
              m => m.isLoserBracket && 
                  m.round === updatedMatch.round &&
                  (!m.player1Id || !m.player2Id)
            );

            if (loserMatch) {
              if (!loserMatch.player1Id) {
                loserMatch.player1Id = loserId;
              } else if (!loserMatch.player2Id) {
                loserMatch.player2Id = loserId;
              }
            }
          }
        }
      }

      return {
        ...prev,
        matches: updatedMatches,
        winnerBracketChampion,
        loserBracketChampion,
        updatedAt: new Date(),
      };
    });
  };

  const clearTournament = () => {
    setTournament(createDefaultTournament());
  };

  const saveTournament = () => {
    const tournamentData = JSON.stringify(tournament);
    localStorage.setItem('dartTournament', tournamentData);
  };

  const loadTournament = (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      parsedData.createdAt = new Date(parsedData.createdAt);
      parsedData.updatedAt = new Date(parsedData.updatedAt);
      setTournament(parsedData);
    } catch (error) {
      console.error('Failed to load tournament data:', error);
    }
  };

  return (
    <TournamentContext.Provider
      value={{
        tournament,
        setTournament,
        addPlayer,
        removePlayer,
        updatePlayer,
        generateBracket,
        updateMatch,
        clearTournament,
        saveTournament,
        loadTournament,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};