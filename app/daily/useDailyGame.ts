'use client'
import { useState, useCallback } from 'react';
import { getDailyManga, checkDailyAnswer } from './actions';
import { DailyManga, DailyStatus, DailyGuessResult } from 'Mangaguesser';

// The daily mode tracks attempts per user, so every request must reuse the
// same session token the play mode stores. Reading it right before each
// request (instead of from state) avoids racing the initial fetch.
function storedToken(): string | null {
  const stored = localStorage.getItem('mangaSession');
  if (stored) return stored;

  const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('mangaguesser_token='))
      ?.split('=')[1];

  return cookieToken || null;
}

function saveToken(token: string | null) {
  if (token) {
    localStorage.setItem('mangaSession', token);
  }
}

export function useDailyGame() {
  const [daily, setDaily] = useState<DailyManga | null>(null);
  const [status, setStatus] = useState<DailyStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDaily = useCallback(async (date?: string) => {
    setLoading(true);
    try {
      const result = await getDailyManga(storedToken(), date);
      setDaily(result.daily);
      setStatus(result.status);
      saveToken(result.token);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitGuess = async (name: string, date?: string): Promise<DailyGuessResult | null> => {
    const { result, token } = await checkDailyAnswer(name, storedToken(), date);
    saveToken(token);

    if (result) {
      setStatus({
        alreadyPlayed: true,
        solved: result.correct,
        attempts: result.attempts,
        attemptsRemaining: result.attemptsRemaining,
      });
    }

    return result;
  };

  return { daily, status, loading, fetchDaily, submitGuess };
}
