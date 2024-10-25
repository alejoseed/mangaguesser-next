import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const clientCookies = req.headers.cookie || '';
        
        const response = await fetch('https://www.alejoseed.com/mangaguesser/random_manga', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': clientCookies, // Forward the cookies
            },
            credentials: 'include'
        });

        const mangaInfo = await response.json();
        
        // Get all cookies from the response
        const setCookieHeaders = response.headers.get('set-cookie');
        if (setCookieHeaders) {
            res.setHeader('Set-Cookie', setCookieHeaders);
        }

        res.status(200).json(mangaInfo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch manga data' });
    }
}