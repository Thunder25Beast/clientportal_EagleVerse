
import { useState, useRef, useCallback } from 'react';

interface CameraState {
  isActive: boolean;
  stream: MediaStream | null;
  error: string | null;
  facingMode: 'user' | 'environment';
  flashEnabled: boolean;
}

export const useCamera = () => {
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    stream: null,
    error: null,
    facingMode: 'user',
    flashEnabled: false
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setCameraState(prev => ({ ...prev, error: null }));
      
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraState.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraState(prev => ({
        ...prev,
        isActive: true,
        stream,
        error: null
      }));
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraState(prev => ({
        ...prev,
        error: 'Unable to access camera. Please ensure camera permissions are granted.'
      }));
    }
  }, [cameraState.facingMode]);

  const stopCamera = useCallback(() => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach(track => track.stop());
    }
    setCameraState(prev => ({
      ...prev,
      isActive: false,
      stream: null
    }));
  }, [cameraState.stream]);

  const switchCamera = useCallback(() => {
    const newFacingMode = cameraState.facingMode === 'user' ? 'environment' : 'user';
    setCameraState(prev => ({ ...prev, facingMode: newFacingMode }));
    
    if (cameraState.isActive) {
      stopCamera();
      setTimeout(startCamera, 100);
    }
  }, [cameraState.facingMode, cameraState.isActive, startCamera, stopCamera]);

  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current || !cameraState.isActive) return null;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  }, [cameraState.isActive]);

  const toggleFlash = useCallback(async () => {
    if (!cameraState.stream) return;

    try {
      const track = cameraState.stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      // Check if torch is supported (only available on some devices)
      if ('torch' in capabilities && capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !cameraState.flashEnabled } as any]
        });
        setCameraState(prev => ({ ...prev, flashEnabled: !prev.flashEnabled }));
      }
    } catch (error) {
      console.error('Flash toggle error:', error);
    }
  }, [cameraState.stream, cameraState.flashEnabled]);

  return {
    ...cameraState,
    videoRef,
    startCamera,
    stopCamera,
    switchCamera,
    capturePhoto,
    toggleFlash
  };
};
