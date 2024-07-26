import React, { useState, useEffect } from 'react';
import { openDB } from 'idb';
import axios from 'axios';
import FetchData from './FetchData';
// Initialize IndexedDB with detailed logging
async function initializeDB() {
  try {
    console.log("Initializing IndexedDB...");
    const db = await openDB('audioDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('audioStore')) {
          console.log("Creating object store 'audioStore'");
          db.createObjectStore('audioStore');
        }
      },
    });
    console.log("Database and object store initialized");
    return db;
  } catch (error) {
    console.error('Error initializing IndexedDB:', error);
    return null;
  }
}
// Save audio blob to IndexedDB
async function saveAudioToIndexedDB(blob) {
  const db = await initializeDB();
  if (!db) {
    console.error('DB initialization failed');
    return;
  }
  try {
    console.log("Saving audio to IndexedDB...");
    const tx = db.transaction('audioStore', 'readwrite');
    const store = tx.objectStore('audioStore');
    await store.put(blob, 'audioBlob');
    await tx.done;
    console.log("Audio saved to IndexedDB");
  } catch (error) {
    console.error('Error saving audio to IndexedDB:', error);
  }
}
// Retrieve audio blob from IndexedDB
async function getAudioFromIndexedDB() {
  const db = await initializeDB();
  if (!db) {
    console.error('DB initialization failed');
    return null;
  }
  try {
    const tx = db.transaction('audioStore', 'readonly');
    const store = tx.objectStore('audioStore');
    const audioBlob = await store.get('audioBlob');
    if (audioBlob) {
      console.log("Audio retrieved from IndexedDB");
    } else {
      console.log("No audio found in IndexedDB");
    }
    return audioBlob;
  } catch (error) {
    console.error('Error retrieving audio from IndexedDB:', error);
    return null;
  }
}
function RedirectPage() {
  const email = new URLSearchParams(window.location.search).get('email');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [flaskMessage, setFlaskMessage] = useState("");
  // Handle mediaRecorder events
  useEffect(() => {
    console.log("mediaRecorder has been set", mediaRecorder);
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = (event) => {
        console.log("ondataavailable event", event);
        if (event.data && event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
          console.log("audioChunk added", event.data);
        }
      };
      mediaRecorder.onstop = async () => {
        console.log("Recording stopped, audioChunks:", audioChunks);
        try {
          if (audioChunks.length > 0) {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm; codecs=opus' });
            await saveAudioToIndexedDB(audioBlob);
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log("Audio URL generated", audioUrl);
            setAudioURL(audioUrl);
            setAudioChunks([]);
          } else {
            console.error('No audio data available to save.');
          }
        } catch (error) {
          console.error("Failed saving audioBlob or creating URL:", error);
        }
      };
    }
  }, [mediaRecorder, audioChunks]);
  // Retrieve audio from IndexedDB on component mount
  useEffect(() => {
    (async () => {
      console.log("Attempting to retrieve audio from IndexedDB");
      try {
        const audioBlob = await getAudioFromIndexedDB();
        if (audioBlob) {
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log("Audio URL generated from IndexedDB", audioUrl);
          setAudioURL(audioUrl);
        } else {
          console.log("No audio found in IndexedDB");
        }
      } catch (error) {
        console.error("Error during audio retrieval from IndexedDB:", error);
      }
    })();
  }, []);
  // Fetch message from Flask backend on component mount
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get("https://your-flask-backend-url/api/test");
        setFlaskMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching message from Flask:", error);
      }
    };
    fetchMessage();
  }, []);
  // Start recording audio
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
  // Stop recording audio
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
      {flaskMessage && <p>{flaskMessage}</p>}
      <FetchData />
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