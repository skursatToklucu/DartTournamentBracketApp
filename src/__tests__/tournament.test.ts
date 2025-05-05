import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { TournamentProvider, useTournament } from '../context/TournamentContext';

describe('Tournament Context', () => {
  it('should add a player', () => {
    const { result } = renderHook(() => useTournament(), {
      wrapper: TournamentProvider,
    });

    act(() => {
      result.current.addPlayer('John Doe');
    });

    expect(result.current.tournament.players).toHaveLength(1);
    expect(result.current.tournament.players[0].name).toBe('John Doe');
  });

  it('should remove a player', () => {
    const { result } = renderHook(() => useTournament(), {
      wrapper: TournamentProvider,
    });

    act(() => {
      result.current.addPlayer('John Doe');
      const playerId = result.current.tournament.players[0].id;
      result.current.removePlayer(playerId);
    });

    expect(result.current.tournament.players).toHaveLength(0);
  });

  it('should generate a bracket with 4 players', () => {
    const { result } = renderHook(() => useTournament(), {
      wrapper: TournamentProvider,
    });

    act(() => {
      result.current.addPlayer('Player 1');
      result.current.addPlayer('Player 2');
      result.current.addPlayer('Player 3');
      result.current.addPlayer('Player 4');
      result.current.generateBracket();
    });

    expect(result.current.tournament.matches.length).toBeGreaterThan(0);
    expect(result.current.tournament.totalRounds).toBe(2);
  });

  it('should update match results and advance winners', () => {
    const { result } = renderHook(() => useTournament(), {
      wrapper: TournamentProvider,
    });

    act(() => {
      result.current.addPlayer('Player 1');
      result.current.addPlayer('Player 2');
      result.current.generateBracket();
    });

    const firstMatch = result.current.tournament.matches[0];
    
    act(() => {
      result.current.updateMatch(firstMatch.id, {
        winnerId: firstMatch.player1Id,
        player1Score: 3,
        player2Score: 1,
      });
    });

    expect(result.current.tournament.matches[0].winnerId).toBe(firstMatch.player1Id);
    expect(result.current.tournament.matches[0].player1Score).toBe(3);
    expect(result.current.tournament.matches[0].player2Score).toBe(1);
  });

  it('should handle loser bracket advancement', () => {
    const { result } = renderHook(() => useTournament(), {
      wrapper: TournamentProvider,
    });

    act(() => {
      result.current.addPlayer('Player 1');
      result.current.addPlayer('Player 2');
      result.current.addPlayer('Player 3');
      result.current.addPlayer('Player 4');
      result.current.generateBracket();
    });

    const firstMatch = result.current.tournament.matches.find(m => !m.isLoserBracket && m.round === 1);
    if (!firstMatch) throw new Error('No first round match found');

    act(() => {
      result.current.updateMatch(firstMatch.id, {
        winnerId: firstMatch.player1Id,
      });
    });

    const loserMatch = result.current.tournament.matches.find(
      m => m.isLoserBracket && m.player1Id === firstMatch.player2Id
    );

    expect(loserMatch).toBeTruthy();
  });
});