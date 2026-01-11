'use client'
import { useState, useEffect } from 'react';
import { getMangaNames, checkAnswer } from './actions';
import { MangasResponse } from 'Mangaguesser';

export function useMangaGame() {
  const [token, setToken] = useState<string | null>(null);
  const [mangaData, setMangaData] = useState<MangasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem('mangaSession');
    const cookieToken = getCookie();

    if (stored) {
      setToken(stored);
    } else if (cookieToken) {
      setToken(cookieToken);
      localStorage.setItem('mangaSession', cookieToken);
    }
  }, []);

  const getCookie = () => {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('mangaguesser_token='))
        ?.split('=')[1];

    if (!token) {
      console.log("Error setting token.")
      return null
    }

    return token;
  };

  const fetchManga = async () => {
    setLoading(true);
    try {
      const result = await getMangaNames();
      setMangaData(result.data);
      
      if (result.token) {
        setToken(result.token);
        localStorage.setItem('mangaSession', result.token);
      }
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (answer: number) => {
    if (!token) return null;
    return await checkAnswer(answer, token);
  };

  return { mangaData, loading, fetchManga, submitAnswer, token };
}