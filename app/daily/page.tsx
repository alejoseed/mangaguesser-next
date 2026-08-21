"use client"
import React, { useEffect, useState } from "react";
import { useDailyGame } from "./useDailyGame";
import { getDailyHistoryDates } from "./actions";
import Image from "next/image";

interface Guess {
  name: string;
  similarity: number;
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Daily(){
  const [popUp, setPopUp] = useState<boolean>(false);
  const [guess, setGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  // null means today; a YYYY-MM-DD string means a past day.
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [pastDates, setPastDates] = useState<string[]>([]);
  const { daily, status, loading, fetchDaily, submitGuess } = useDailyGame();

  useEffect(() => {
    getDailyHistoryDates().then(setPastDates);
  }, []);

  useEffect(() => {
    fetchDaily(selectedDate ?? undefined);
  }, [fetchDaily, selectedDate]);

  const solved = status?.solved ?? false;
  const outOfAttempts = !solved && (status?.attemptsRemaining ?? 6) <= 0;
  const gameOver = solved || outOfAttempts;
  const isToday = selectedDate === null;

  const today = todayUTC();
  const allDates = [...pastDates.filter(d => d < today), today];
  const dateIndex = allDates.indexOf(selectedDate ?? today);
  const atOldest = dateIndex <= 0;

  function selectDate(date: string | null) {
    setGuesses([]);
    setGuess("");
    setSelectedDate(date);
  }

  function goBack() {
    if (atOldest) return;
    selectDate(allDates[dateIndex - 1]);
  }

  function goForward() {
    if (isToday || dateIndex < 0) return;
    const next = allDates[dateIndex + 1];
    selectDate(next === today ? null : next);
  }

  async function handleGuess() {
    const name = guess.trim();
    if (!name || submitting || gameOver) return;

    setSubmitting(true);
    try {
      const result = await submitGuess(name, selectedDate ?? undefined);
      if (!result) return;

      if (result.correct) {
        setPopUp(true);
        setTimeout(() => setPopUp(false), 2000);
      } else {
        setGuesses(prev => [{ name, similarity: result.similarity ?? 0 }, ...prev]);
      }
      setGuess("");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div>
      <div className="flex flex-col items-center justify-center max-h-full pt-14">
        <video autoPlay loop muted playsInline className="rounded-lg shadow-lg max-w-[360px] md:max-w-lg">
          <source src="/deku.webm" type="video/webm"/>
        </video>
        <div className="lds-ring pt-3"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  }

  return (
    <div className="flex flex-col items-center w-full">
      {popUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="font-link bg-cyan-400 rounded-2xl w-[320px] p-8 shadow-2xl
                          animate-[scale-in_0.3s_ease-out] flex flex-col items-center gap-4">
            <div className="text-4xl">🎉</div>
            <div className="text-2xl font-bold text-center">
              <p>You got today&apos;s manga!</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-svw flex flex-col items-center p-4 gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            aria-label="Previous day"
            disabled={atOldest}
            className={`w-10 h-10 rounded-md text-xl font-bold grid place-items-center
                       bg-gray-800/60 transition-all duration-100
                       ${atOldest
                         ? 'opacity-30 cursor-not-allowed'
                         : 'hover:-translate-y-1 active:scale-95'}`}>
            ←
          </button>
          <div className="flex flex-col items-center min-w-[160px]">
            <h2 className="text-xl font-semibold">Daily Manga</h2>
            <span className="text-sm text-gray-400">
              {isToday ? `Today · ${todayUTC()}` : selectedDate}
              {status && ` · ${status.attemptsRemaining} ${status.attemptsRemaining === 1 ? "guess" : "guesses"} left`}
            </span>
          </div>
          <button
            onClick={goForward}
            aria-label="Next day"
            disabled={isToday}
            className={`w-10 h-10 rounded-md text-xl font-bold grid place-items-center
                       bg-gray-800/60 transition-all duration-100
                       ${isToday
                         ? 'opacity-30 cursor-not-allowed'
                         : 'hover:-translate-y-1 active:scale-95'}`}>
            →
          </button>
        </div>

        <div className="relative w-full max-w-[600px] md:h-[550px] h-[380px] bg-gray-100 rounded-lg overflow-hidden -z-10">
          {daily?.imageUrl ? (
            <Image
              className="object-scale-down"
              src={daily.imageUrl}
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, (max-width:1400) 90vw"
              alt="Daily manga panel"
              priority />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">
                {isToday ? "No daily manga today, come back later!" : "No daily manga for this date."}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="flex flex-col gap-2 p-2 w-full max-w-[600px] mx-auto">
        {solved && (
          <div className="rounded-md bg-green-600/90 text-center p-3 font-semibold">
            🎉 Solved in {status?.attempts} {status?.attempts === 1 ? "try" : "tries"}!{isToday && " Come back tomorrow."}
          </div>
        )}
        {outOfAttempts && (
          <div className="rounded-md bg-red-600/90 text-center p-3 font-semibold">
            {isToday ? "Out of guesses for today. Try again tomorrow!" : "Out of guesses for this day."}
          </div>
        )}

        {!gameOver && daily && (
          <form onSubmit={e => { e.preventDefault(); handleGuess(); }} className="flex gap-2 w-full">
            <input
              type="text"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              placeholder="Guess the manga name..."
              className="flex-1 rounded-md px-4 h-12 text-black bg-white
                         border-2 border-gray-300 focus:border-cyan-400 focus:outline-none"
              disabled={submitting}
            />
            <button
              type="submit"
              className={`h-12 rounded-md px-6 font-semibold text-center
                        transition-all duration-100
                        ${submitting
                          ? 'scale-95 animate-pulse'
                          : 'hover:-translate-y-1 active:scale-95'}`}
              style={{ backgroundColor: "#89CFF0" }}
              disabled={submitting || !guess.trim()}>
                Guess
            </button>
          </form>
        )}

        {guesses.length > 0 && (
          <ul className="flex flex-col gap-1">
            {guesses.map((g, i) => (
              <li key={i} className="flex justify-between rounded-md bg-gray-800/60 px-4 py-2 text-sm">
                <span className="line-through opacity-70">{g.name}</span>
                <span className="opacity-70">{g.similarity}% close</span>
              </li>
            ))}
          </ul>
        )}
      </footer>
    </div>
  );
}
