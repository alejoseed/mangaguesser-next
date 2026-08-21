'use client'
import { DailyManga, DailyStatus, DailyGuessResult } from 'Mangaguesser';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://node1.alejoseed.com';

function authHeaders(sessionToken: string | null): HeadersInit {
    return sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {};
}

export async function getDailyManga(sessionToken: string | null, date?: string): Promise<{daily: DailyManga | null, status: DailyStatus | null, token: string | null}> {
    try {
        const query = date ? `?date=${date}` : '';
        const response = await fetch(`${API_BASE}/daily-manga${query}`, {
            method: 'GET',
            credentials: 'include',
            headers: authHeaders(sessionToken),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Daily API request failed: ${response.status} ${response.statusText}`, errorText);
            return {daily: null, status: null, token: null};
        }

        const result = await response.json();
        return {
            daily: result.data,
            status: result.status || null,
            token: result.token || null
        };
    } catch (error) {
        console.error("Failed to fetch daily manga.", error);
        return {daily: null, status: null, token: null};
    }
}

// Returns the sorted YYYY-MM-DD dates of past daily puzzles (today excluded).
export async function getDailyHistoryDates(): Promise<string[]> {
    try {
        const response = await fetch(`${API_BASE}/daily-manga/history`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Daily history API request failed: ${response.status} ${response.statusText}`, errorText);
            return [];
        }

        const result = await response.json();
        const mangas: DailyManga[] = result.data || [];
        return mangas.map(m => m.forDate.slice(0, 10)).sort();
    } catch (error) {
        console.error("Failed to fetch daily history.", error);
        return [];
    }
}

export async function checkDailyAnswer(name: string, sessionToken: string | null, date?: string): Promise<{result: DailyGuessResult | null, token: string | null}> {
    try {
        const dateQuery = date ? `&date=${date}` : '';
        const response = await fetch(`${API_BASE}/daily-manga/answer?name=${encodeURIComponent(name)}${dateQuery}`, {
            method: 'GET',
            credentials: 'include',
            headers: authHeaders(sessionToken),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Daily answer API request failed: ${response.status} ${response.statusText}`, errorText);
            return {result: null, token: null};
        }

        const result = await response.json();
        return {
            result,
            token: result.token || null
        };
    } catch (error) {
        console.error(error);
        return {result: null, token: null};
    }
}
