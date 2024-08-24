import React, { useState, useEffect } from 'react';

const RecordButton = ({ onTranscription }) => {
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (recorder === null) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          setRecorder(mediaRecorder);
        }).catch(err => {
          console.error('Error accessing media devices.', err);
        });
      } else {
        console.error('Media devices not supported.');
      }
    }

    if (recorder) {
      recorder.ondataavailable = async (e) => {
        const audioBlob = new Blob([e.data], { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
          const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          if (data.transcription) {
            onTranscription(data.transcription);
          } else {
            console.error('Error handling transcription:', data.error);
          }
        } catch (error) {
          console.error('Error during transcription request:', error);
        }
      };
    }
  }, [recorder, onTranscription]);

  const startRecording = () => {
    if (recorder) {
      setIsRecording(true);
      recorder.start();
    }
  };

  const stopRecording = () => {
    if (recorder) {
      setIsRecording(false);
      recorder.stop();
    }
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default RecordButton;
