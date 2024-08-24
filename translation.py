from google.cloud import speech_v1p1beta1 as speech
import io
import sys

def transcribe_audio(audio_file_path):
    client = speech.SpeechClient()

    with io.open(audio_file_path, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
    )

    response = client.recognize(config=config, audio=audio)

    transcriptions = []
    for result in response.results:
        transcriptions.append(result.alternatives[0].transcript)

    return " ".join(transcriptions)

if __name__ == "__main__":
    audio_file_path = sys.argv[1]
    print(transcribe_audio(audio_file_path))
