import React, { useState, useEffect } from 'react';
import { openDB } from 'idb';
async function saveAudioToIndexedDB(blob) {
  const db = await openDB('audioDB', 1, {
    upgrade(db) {
      db.createObjectStore('audioStore');
    },
  });
  await db.put('audioStore', blob, 'audioBlob');
}
async function getAudioFromIndexedDB() {
  const db = await openDB('audioDB', 1);
  return await db.get('audioStore', 'audioBlob');
}
function RedirectPage() {
  const email = new URLSearchParams(window.location.search).get('email');
  
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  useEffect(() => {
    console.log("mediaRecorder has been set", mediaRecorder);
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = (event) => {
        console.log("ondataavailable event", event);
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
          console.log("audioChunk added", event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        console.log("Recording stopped, audioChunks:", audioChunks);
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await saveAudioToIndexedDB(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log("Audio URL generated", audioUrl);
        setAudioURL(audioUrl);
        setAudioChunks([]);
      };
    }
  }, [mediaRecorder, audioChunks]);
  useEffect(() => {
    (async () => {
      const audioBlob = await getAudioFromIndexedDB();
      if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      }
    })();
  }, []);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted");
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      console.log("Recording started");
    } catch (err) {
      console.error("Error accessing microphone", err);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log("Recording stopped by button");
    }
  };
  return (
    <div>
      <h1>Redirect Page</h1>
      {email ? (
        <p>The Gmail email used to log in is: {email}</p>
      ) : (
        <p>No email found!</p>
      )}
      <div>
        <button onClick={isRecording ? stopRecording : startRecording} style={{ marginBottom: '20px' }}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {audioURL && (
          <div>
            <audio controls src={audioURL}></audio>
          </div>
        )}
      </div>
    </div>
  );
}
export default RedirectPage;