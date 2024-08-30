import React, { useState, useRef, useEffect } from 'react';

const ScreenRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  useEffect(() => {
    const handleStartRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' }
        });

        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: 'video/webm'
        });

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunks.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setVideoURL(url);
          chunks.current = [];
        };

        if (recording) {
          mediaRecorderRef.current.start();
        } else if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      } catch (err) {
        console.error('Error: ' + err);
      }
    };

    if (recording) {
      handleStartRecording();
    }

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setRecording(false);
      }
    };
  }, [recording]);

  const handleStartClick = () => {
    setRecording(true);
  };

  const handleStopClick = () => {
    setRecording(false);
  };

  return (
    <div className="screen-recorder">
      <h1>Screen Recorder</h1>
      <div className="controls">
        {!recording ? (
          <button onClick={handleStartClick} className="record-btn">
            Start Recording
          </button>
        ) : (
          <button onClick={handleStopClick} className="stop-btn">
            Stop Recording
          </button>
        )}
      </div>
      {videoURL && (
        <div className="video-container">
          <h2>Recorded Video</h2>
          <video src={videoURL} controls></video>
          <a href={videoURL} download="recording.webm">Download</a>
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
