'use client'
import { MangasResponse }  from 'Mangaguesser';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://node1.alejoseed.com';

export async function getMangaNames(): Promise<{data: MangasResponse | null, token: string | null}> {
    try {
        const response = await fetch(`${API_BASE}/random_manga`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
            return {data: null, token: null};
        }

        const result = await response.json();
        return {
            data: result.data,
            token: result.token || null
        };
    } catch (error) {
        console.error("Failed to fetch manga data.", error);
        return {data: null, token: null};
    }
}

export async function checkAnswer(answer: number, sessionToken: string): Promise<boolean | null> {
    try {
        const response = await fetch(`${API_BASE}/answer?number=${answer}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionToken}`
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Answer API request failed: ${response.status} ${response.statusText}`, errorText);
            return null;
        }

        const result = await response.json();
        return result["correct"];
    } catch (error) {
        console.error(error);
        return null;
    }
}