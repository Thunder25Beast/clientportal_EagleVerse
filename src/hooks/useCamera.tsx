import { useState, useRef, useCallback, useEffect } from 'react';

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
  const [wasActiveBeforeHidden, setWasActiveBeforeHidden] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async (newFacingMode?: 'user' | 'environment') => {
    try {
      setCameraState(prev => ({ ...prev, error: null }));
      
      const targetFacingMode = newFacingMode || cameraState.facingMode;
      
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: targetFacingMode,
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
        error: null,
        facingMode: targetFacingMode
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
      cameraState.stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraState(prev => ({
      ...prev,
      isActive: false,
      stream: null
    }));
  }, [cameraState.stream]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (cameraState.isActive) {
          setWasActiveBeforeHidden(true);
          stopCamera();
        }
      } else {
        if (wasActiveBeforeHidden) {
          startCamera();
          setWasActiveBeforeHidden(false);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Ensure camera is stopped when component unmounts
      if (cameraState.isActive && cameraState.stream) {
        cameraState.stream.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }
    };
  }, [cameraState.isActive, stopCamera, startCamera, wasActiveBeforeHidden, cameraState.stream]);

  const switchCamera = useCallback(async () => {
    const newFacingMode = cameraState.facingMode === 'user' ? 'environment' : 'user';
    
    if (cameraState.isActive) {
      // Stop current camera first
      stopCamera();
      
      // Wait a bit for the camera to be fully released
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Start camera with new facing mode
      await startCamera(newFacingMode);
    } else {
      // Just update the facing mode if camera is not active
      setCameraState(prev => ({ ...prev, facingMode: newFacingMode }));
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
