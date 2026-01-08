import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';

const CameraStream = ({ showCamera = true }) => {
  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [faceWarningVisible, setFaceWarningVisible] = useState(false);
  const [faceWarningMessage, setFaceWarningMessage] = useState('');
  const [multipleFaceCount, setMultipleFaceCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let stream;

    const loadModels = async () => {
      const MODEL_URL = '/models/tiny_face_detector';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      console.log("FaceAPI Model Loaded ");
    };

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Please allow camera access.');
      }
    };

    if (showCamera) {
      loadModels().then(startCamera);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showCamera]);

  useEffect(() => {
    let interval;
    if (showCamera) {
      interval = setInterval(detectFaces, 2000);
    }
    return () => clearInterval(interval);
  }, [showCamera]);

  const detectFaces = async () => {
    if (videoRef.current && faceapi.nets.tinyFaceDetector.params) {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions());

      if (detections.length > 1) {
        setMultipleFaceCount(prev => {
          const newCount = prev + 1;

          if (newCount === 1) {
            setFaceWarningMessage('⚠️ Warning!! Multiple faces detected! (First Warning)');
            setFaceWarningVisible(true);
          } else if (newCount === 2) {
            setFaceWarningMessage('⚠️ Final Warning!! Multiple faces detected again! Stay Alone!!');
            setFaceWarningVisible(true);
          } else if (newCount >= 3) {
            setFaceWarningMessage('⛔ Exam Terminated! Multiple face detections.');
            setFaceWarningVisible(true);
            setTimeout(() => {
              navigate('/');  // Terminate and navigate after showing warning
            }, 3000);
          }

          return newCount;
        });
      }
    }
  };

  const handleFaceWarningOk = () => {
    setFaceWarningVisible(false);
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = cameraRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  if (!showCamera) return null;

  return (
    <>
      {faceWarningVisible && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Warning!!</h2>
            <p className="mb-6">{faceWarningMessage}</p>
            <button
              onClick={handleFaceWarningOk}
              style={{ backgroundColor: 'red' }}
              className=" text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div
        ref={cameraRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: '256px',
          height: '192px',
          backgroundColor: 'black',
          borderRadius: '1rem',
          overflow: 'hidden',
          border: '1px solid #d1d5db',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 50,
          cursor: 'move',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </>
  );
};

export default CameraStream;
