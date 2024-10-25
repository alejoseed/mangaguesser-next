// pages/api/getManga.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const clientCookies = req.headers.cookie || '';
        console.log(clientCookies);
        const response = await fetch(`https://www.alejoseed.com/mangaguesser/image`, {
            method: 'GET',
            headers: {
                'Cookie': `${clientCookies}`,
            },
            redirect: 'follow',
            credentials: 'include'
        });

        
        const buffer = await response.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;
        
        res.status(200).json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch manga image' });
    }
}