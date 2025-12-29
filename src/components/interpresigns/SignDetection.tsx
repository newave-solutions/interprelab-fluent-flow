import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw } from 'lucide-react';
import ASLRecognitionService from './ASLRecognitionService';

interface SignDetectionProps {
  onSignDetected: (sign: string) => void;
}

type CameraState = 'idle' | 'checking-permission' | 'requesting-permission' | 'loading-model' | 'initializing-camera' | 'ready' | 'error';

const SignDetection: React.FC<SignDetectionProps> = ({ onSignDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef(true);
  const isInitializedRef = useRef(false); // Track if initialization has already happened

  const [cameraState, setCameraState] = useState<CameraState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');

  // Check camera permission status
  const checkCameraPermission = useCallback(async () => {
    try {
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermissionState(result.state);
        return result.state;
      }
      return 'prompt';
    } catch (error) {
      console.warn('Permission API not supported:', error);
      return 'prompt';
    }
  }, []);

  // Request camera access with proper error handling
  const requestCameraAccess = useCallback(async (): Promise<MediaStream | null> => {
    try {
      setCameraState('requesting-permission');

      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Request camera with specific constraints
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (!isMountedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return null;
      }

      return stream;
    } catch (err) {
      if (!isMountedRef.current) return null;

      console.error('Camera access error:', err);

      if (err instanceof Error) {
        // Handle specific error types
        switch (err.name) {
          case 'NotAllowedError':
          case 'PermissionDeniedError':
            setError('Camera permission denied. Please allow camera access in your browser settings and reload the page.');
            setPermissionState('denied');
            break;
          case 'NotFoundError':
          case 'DevicesNotFoundError':
            setError('No camera found. Please connect a camera and try again.');
            break;
          case 'NotReadableError':
          case 'TrackStartError':
            setError('Camera is in use by another application. Please close other apps using the camera and try again.');
            break;
          case 'OverconstrainedError':
            setError('Camera does not meet requirements. Please try with a different camera.');
            break;
          case 'SecurityError':
            setError('Camera access blocked due to security settings. Please check your browser settings.');
            break;
          default:
            setError(`Camera error: ${err.message}. Please try again.`);
        }
      } else {
        setError('An unknown camera error occurred. Please try again.');
      }

      setCameraState('error');
      return null;
    }
  }, []);

  // Initialize detection system
  const initializeDetection = useCallback(async () => {
    try {
      if (!isMountedRef.current) return;

      setCameraState('checking-permission');
      setError(null);

      // First, check current permission status
      const permission = await checkCameraPermission();

      if (permission === 'denied') {
        setError('Camera permission was previously denied. Please enable camera access in your browser settings.');
        setCameraState('error');
        return;
      }

      // Load TensorFlow models first
      setCameraState('loading-model');
      await ASLRecognitionService.loadModel();

      if (!isMountedRef.current) return;

      // Then request camera access
      setCameraState('initializing-camera');
      const stream = await requestCameraAccess();

      if (!stream || !isMountedRef.current) return;

      streamRef.current = stream;

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error('Video element not available'));
            return;
          }

          const video = videoRef.current;

          const onLoadedMetadata = () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            resolve();
          };

          const onError = (e: Event) => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            reject(new Error('Video failed to load'));
          };

          video.addEventListener('loadedmetadata', onLoadedMetadata);
          video.addEventListener('error', onError);

          // Start playing
          video.play().catch(reject);
        });
      }

      if (!isMountedRef.current) return;

      // Start detection loop
      setCameraState('ready');

      if (videoRef.current) {
        const video = videoRef.current;
        intervalRef.current = window.setInterval(async () => {
          if (!isMountedRef.current) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
          }

          try {
            const sign = await ASLRecognitionService.estimateSign(video);
            if (sign && isMountedRef.current) {
              setDetectedSign(sign);
              onSignDetected(sign);
            }
          } catch (detectionError) {
            console.error('Sign detection error:', detectionError);
          }
        }, 100);
      }
    } catch (err) {
      if (!isMountedRef.current) return;

      console.error('Initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize camera and detection system');
      setCameraState('error');
    }
  }, [checkCameraPermission, requestCameraAccess, onSignDetected]);

  // Retry initialization
  const retry = useCallback(() => {
    // Clean up existing resources
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Reset state and flags
    setError(null);
    setDetectedSign(null);
    setCameraState('idle');
    isInitializedRef.current = false; // Reset initialization flag

    // Reinitialize
    initializeDetection();
  }, [initializeDetection]);

  // Initialize on mount
  useEffect(() => {
    isMountedRef.current = true;

    // Only initialize once
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      initializeDetection();
    }

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [initializeDetection]);

  // Render loading states
  const renderStatus = () => {
    switch (cameraState) {
      case 'checking-permission':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-white text-lg">Checking camera permissions...</p>
          </div>
        );

      case 'requesting-permission':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-lg">
            <Camera className="w-16 h-16 text-primary mb-4 animate-pulse" />
            <p className="text-white text-lg font-semibold mb-2">Camera Access Required</p>
            <p className="text-gray-300 text-sm text-center max-w-md">
              Please allow camera access in your browser to use ASL sign detection
            </p>
          </div>
        );

      case 'loading-model':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-white text-lg">Loading AI models...</p>
            <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
          </div>
        );

      case 'initializing-camera':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-white text-lg">Initializing camera...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-[400px] bg-gray-900 rounded-lg overflow-hidden">
      {/* Video element */}
      <video
        ref={videoRef}
        className={cameraState !== 'ready' ? 'hidden' : 'w-full h-auto'}
        style={{ transform: 'scaleX(-1)' }}
        autoPlay
        playsInline
        muted
      />

      {/* Loading/Status overlays */}
      {renderStatus()}

      {/* Error state */}
      {error && cameraState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 rounded-lg p-6">
          <img
            src="/no-camera.svg"
            alt="Camera error"
            className="w-32 h-32 mb-4 opacity-50"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4 max-w-md">
            <h3 className="text-red-500 font-semibold text-lg mb-2">Camera Error</h3>
            <p className="text-red-300 text-sm mb-4">{error}</p>
            <Button
              onClick={retry}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Detection indicator */}
      {detectedSign && cameraState === 'ready' && !error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-pulse">
          <span className="font-bold text-lg">Detected: {detectedSign}</span>
        </div>
      )}

      {/* Ready indicator */}
      {cameraState === 'ready' && !detectedSign && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          Ready
        </div>
      )}
    </div>
  );
};

export default SignDetection;
