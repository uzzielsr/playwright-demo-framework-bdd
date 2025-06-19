import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.IMGBB_API_KEY;

export async function uploadToImgBB(imagePath: string): Promise<string | null> {
    try {
        const form = new FormData();
        form.append('key', apiKey);
        form.append('image', fs.createReadStream(imagePath));

        const response = await axios.post('https://api.imgbb.com/1/upload', form, {
            headers: form.getHeaders(),
        });

        const uploadedUrl = response.data?.data?.url;
        console.log(`🔗 Uploaded to ImgBB: ${uploadedUrl}`);
        return uploadedUrl;
    } catch (error: any) {
        console.error('❌ Upload failed:', error.response?.data || error.message);
        return 'Screenshot upload failed';
    }
}