import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.IMGBB_API_KEY;

export async function uploadToImgBB(imagePath: string): Promise<string | null> {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        const response = await axios.post('https://api.imgbb.com/1/upload', null, {
            params: {
                key: apiKey,
                image: base64Image,
            },
        });

        return response.data.data.url;
    } catch {
        return 'Screenshot upload failed';
    }
}