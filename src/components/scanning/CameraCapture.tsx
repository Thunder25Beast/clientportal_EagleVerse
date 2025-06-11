
import React, { useEffect, useState } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, RotateCw, Zap, ZapOff, CircleStop } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  isAnalyzing: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, isAnalyzing }) => {
  const {
    isActive,
    error,
    facingMode,
    flashEnabled,
    videoRef,
    startCamera,
    stopCamera,
    switchCamera,
    capturePhoto,
    toggleFlash
  } = useCamera();

  const { toast } = useToast();
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    // Auto-start camera when component mounts
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const handleCapture = async () => {
    if (!isActive || isAnalyzing) return;

    setIsCapturing(true);
    try {
      const imageData = capturePhoto();
      if (imageData) {
        onCapture(imageData);
        toast({
          title: "Photo captured!",
          description: "Starting skin analysis...",
        });
      } else {
        toast({
          title: "Capture failed",
          description: "Unable to capture photo. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Capture error:', error);
      toast({
        title: "Error",
        description: "Failed to capture photo.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="font-playfair text-2xl text-navy-900">
          Skin Analysis Camera
        </CardTitle>
        <div className="flex justify-center space-x-2">
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Camera Active" : "Camera Inactive"}
          </Badge>
          <Badge variant="outline">
            {facingMode === 'user' ? 'Front Camera' : 'Back Camera'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Camera Preview */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white p-4">
              <div className="text-center">
                <Camera size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">{error}</p>
                <Button 
                  onClick={startCamera}
                  className="mt-4 bg-coral-500 hover:bg-coral-600"
                >
                  Retry Camera Access
                </Button>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Camera Controls Overlay */}
          {isActive && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Guide Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-coral-400 rounded-full opacity-50 flex items-center justify-center">
                  <div className="text-coral-400 text-sm font-medium bg-black/50 px-3 py-1 rounded">
                    Position face here
                  </div>
                </div>
              </div>

              {/* Flash Indicator */}
              {flashEnabled && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-yellow-500 text-black">
                    <Zap size={14} className="mr-1" />
                    Flash On
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Camera Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={switchCamera}
            variant="outline"
            size="lg"
            disabled={!isActive || isAnalyzing}
            className="flex items-center space-x-2"
          >
            <RotateCw size={20} />
            <span>Switch</span>
          </Button>

          <Button
            onClick={toggleFlash}
            variant="outline"
            size="lg"
            disabled={!isActive || isAnalyzing}
            className="flex items-center space-x-2"
          >
            {flashEnabled ? <ZapOff size={20} /> : <Zap size={20} />}
            <span>Flash</span>
          </Button>

          <Button
            onClick={handleCapture}
            size="lg"
            disabled={!isActive || isAnalyzing || isCapturing}
            className="bg-coral-500 hover:bg-coral-600 text-white px-8 flex items-center space-x-2 font-medium"
          >
            {isCapturing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Capturing...</span>
              </>
            ) : (
              <>
                <Camera size={20} />
                <span>Capture</span>
              </>
            )}
          </Button>

          {isActive && (
            <Button
              onClick={stopCamera}
              variant="destructive"
              size="lg"
              className="flex items-center space-x-2"
            >
              <CircleStop size={20} />
              <span>Stop</span>
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>📋 <strong>For best results:</strong></p>
          <ul className="text-xs space-y-1 max-w-md mx-auto">
            <li>• Ensure good lighting (natural light preferred)</li>
            <li>• Position face within the circle guide</li>
            <li>• Remove makeup for accurate analysis</li>
            <li>• Keep face centered and still</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
