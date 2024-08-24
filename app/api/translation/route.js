import { NextResponse } from 'next/server';
import { SpeechClient } from '@google-cloud/speech';
import { Readable } from 'stream';

// Initialize Google Cloud Speech-to-Text client
const client = new SpeechClient({
  keyFilename: './apikey/finalproject3-432215-7106ffb3a055.json', // Ensure the correct path to your credentials
});

export async function POST(req) {
    try {
        // Parse the incoming request to get the audio file
        const formData = await req.formData();
        const audioFile = formData.get('audio');

        // Check if audio file is present
        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        // Convert the audio file to a buffer
        const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

        // Configure the request for Google Speech-to-Text
        const request = {
            audio: {
                content: audioBuffer.toString('base64'), // Convert buffer to base64 string
            },
            config: {
                encoding: 'WEBM_OPUS', // Adjust based on your audio format
                sampleRateHertz: 16000, // Adjust based on your audio format
                languageCode: 'en-US',
            },
        };

        // Perform the transcription request
        const [response] = await client.recognize(request);

        // Extract and format the transcription result
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join(' ');

        return NextResponse.json({ transcription });
    } catch (error) {
        console.error('Error processing audio file:', error);
        return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
    }
}
