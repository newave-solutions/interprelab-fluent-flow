import React, { useRef, useEffect, useState } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import '@tensorflow/tfjs-backend-webgl';

// NOTE: This component currently implements pose estimation, which is a foundational
// step for sign language detection. The full sign language detection feature
// will be built on top of this in future development.

const SignDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startDetection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const net = await posenet.load();
        setIsLoading(false);

        if (videoRef.current) {
          const video = videoRef.current;
          intervalRef.current = window.setInterval(async () => {
            const pose = await net.estimateSinglePose(video);
            // console.log(pose); // Pose data is available here
          }, 100);
        }
      } catch (err) {
        console.error("Error during sign detection setup:", err);
        if (err instanceof Error) {
          if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            setError("Camera access was denied. Please grant permission to use this feature.");
          } else {
            setError("An error occurred while initializing the camera or pose detection model.");
          }
        } else {
          setError("An unknown error occurred.");
        }
        setIsLoading(false);
      }
    };

    startDetection();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative">
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <p className="text-white">Initializing camera and model...</p>
        </div>
      )}
      {error && (
        <div>
          <img src="/no-camera.svg" alt="Camera not available" className="w-full h-auto" />
          <div className="text-red-500 p-4 border border-red-500 rounded-md mt-4">{error}</div>
        </div>
      )}
      <video
        ref={videoRef}
        className={error || isLoading ? 'hidden' : ''}
        style={{ transform: 'scaleX(-1)' }}
        autoPlay
        playsInline
        muted
      />
    </div>
  );
};

export default SignDetection;
