import { NextResponse } from 'next/server';
import { SpeechClient } from '@google-cloud/speech';

const client = new SpeechClient({
  keyFilename: './apikey/finalproject3-432215-7106ffb3a055.json',
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    const request = {
      audio: {
        content: audioBuffer.toString('base64'),
      },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
    };

    const [response] = await client.recognize(request);

    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join(' ');

    return NextResponse.json({ transcription });
  } catch (error) {
    console.error('Error processing audio file:', error);
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}
