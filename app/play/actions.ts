'use server'
import { cookies } from 'next/headers'
import { MangasResponse }  from 'Mangaguesser';

export async function getMangaImage() : Promise<Blob | null> {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('mysession') || "";

        if (!session) {
            console.error("No session found.");
            return null;
        }

        const response = await fetch(`https://www.alejoseed.com/mangaguesser/image`, {
        // const response = await fetch(`http://localhost:8080/image`, {
        
            method: 'GET',
            headers: {
                'Cookie': `${session.value}`,
            },
            redirect: 'follow',
            credentials: 'include'
        });

        const blob = await response.blob();
        return blob
    } catch (error) {
        return null;
    }
}


export async function getMangaNames() : Promise<MangasResponse | null> {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('mysession');

        const response = await fetch('https://www.alejoseed.com/mangaguesser/random_manga', {
        // const response = await fetch('http://localhost:8080/random_manga', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `${session?.value}`
            },
            credentials: 'include'
        });

        
        if (!session) {
            // Set cookies
            const cookiesArray = response.headers.getSetCookie();
            if (cookiesArray.length < 1) {
                console.error("No cookie found in request response.");
                return null;
            }
            
            cookieStore.set('mysession', cookiesArray[0]);
        }

        const mangaInfo : MangasResponse = await response.json();
        return mangaInfo;
    } catch (error) {
        console.error("Failed to fetch manga data.", error);
        return null;
    }
}

export async function checkAnswer(answer : number): Promise<boolean | null> {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('mysession') || "";

        if (!session) {
            console.error("No session found.");
            return null;
        }

        const response = await fetch(`https://www.alejoseed.com/mangaguesser/answer?number=${answer}`, {
        // const response = await fetch(`http://localhost:8080/answer?number=${answer}`, {
            method: 'GET',
            headers: {
                'Cookie': `${session.value}`,
            },
            redirect: 'follow',
            credentials: 'include'
        });

        const result = await response.json();
        
        return result["correct"];
    } catch (error) {
        console.error(error);
        return null;
    }
}