
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CameraCapture from '@/components/scanning/CameraCapture';
import PrivacyNotice from '@/components/scanning/PrivacyNotice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Scanning = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [pendingCapture, setPendingCapture] = useState<string | null>(null);

  const mockAnalysisData = {
    glowIndex: 7.2,
    scores: [
      { name: 'forehead', darkCircles: -1, darkSpots: 3, fineLines: 2, oiliness: 6, wrinkles: 1 },
      { name: 'left_eye_side', darkCircles: 4, darkSpots: 2, fineLines: 3, oiliness: 2, wrinkles: 2 },
      { name: 'right_eye_side', darkCircles: 4, darkSpots: 2, fineLines: 3, oiliness: 2, wrinkles: 2 },
      { name: 'left_under_eye', darkCircles: 5, darkSpots: 1, fineLines: 4, oiliness: 1, wrinkles: 3 },
      { name: 'right_under_eye', darkCircles: 5, darkSpots: 1, fineLines: 4, oiliness: 1, wrinkles: 3 },
      { name: 'nose', darkCircles: -1, darkSpots: 4, fineLines: 1, oiliness: 8, wrinkles: 0 },
      { name: 'left_cheek', darkCircles: -1, darkSpots: 3, fineLines: 2, oiliness: 5, wrinkles: 1 },
      { name: 'right_cheek', darkCircles: -1, darkSpots: 3, fineLines: 2, oiliness: 5, wrinkles: 1 },
      { name: 'chin', darkCircles: -1, darkSpots: 2, fineLines: 1, oiliness: 7, wrinkles: 0 }
    ],
    treatments: [
      {
        id: 1,
        title: 'Deep Cleansing Facial',
        cost: '$85',
        reason: 'Addresses excess oiliness in T-zone',
        priority: 'high' as const
      },
      {
        id: 2,
        title: 'Under-Eye Treatment',
        cost: '$120',
        reason: 'Reduces dark circles and fine lines',
        priority: 'high' as const
      },
      {
        id: 3,
        title: 'Spot Treatment Therapy',
        cost: '$65',
        reason: 'Targets dark spots across face',
        priority: 'medium' as const
      }
    ],
    analysisDate: new Date().toISOString(),
    imageUrl: capturedImage || undefined
  };

  const handlePrivacyAccept = () => {
    setPrivacyAccepted(true);
    setShowPrivacyNotice(false);
    if (pendingCapture) {
      processAnalysis(pendingCapture);
      setPendingCapture(null);
    }
  };

  const handlePrivacyDecline = () => {
    setShowPrivacyNotice(false);
    setPendingCapture(null);
    toast({
      title: "Privacy Notice Declined",
      description: "Photo capture cancelled. Please accept privacy terms to continue.",
      variant: "destructive",
    });
  };

  const handleCapture = async (imageData: string) => {
    if (!privacyAccepted) {
      setPendingCapture(imageData);
      setShowPrivacyNotice(true);
      return;
    }
    
    processAnalysis(imageData);
  };

  const processAnalysis = async (imageData: string) => {
    setCapturedImage(imageData);
    setIsAnalyzing(true);

    try {
      // Simulate AI analysis processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Store analysis data
      const analysisSession = {
        id: Date.now().toString(),
        clientId: 'demo-client',
        analysis: { ...mockAnalysisData, imageUrl: imageData },
        createdAt: new Date().toISOString()
      };

      // Store in localStorage for demo
      const existingSessions = JSON.parse(localStorage.getItem('salon-analysis-sessions') || '[]');
      localStorage.setItem('salon-analysis-sessions', JSON.stringify([...existingSessions, analysisSession]));

      toast({
        title: "Analysis Complete!",
        description: "Skin analysis has been processed successfully.",
      });

      // Navigate to results
      navigate('/analysis-results', { state: { analysis: { ...mockAnalysisData, imageUrl: imageData } } });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        handleCapture(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isAnalyzing) {
    return (
      <DashboardLayout>
        <div className="min-h-[600px] flex items-center justify-center">
          <Card className="w-full max-w-md mx-auto text-center bg-white/90 backdrop-blur-sm border-0">
            <CardContent className="pt-6">
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="w-20 h-20 border-4 border-coral-200 rounded-full animate-spin">
                  <div className="w-3 h-3 bg-coral-500 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                </div>
              </div>
              <h3 className="text-xl font-playfair font-bold text-navy-900 mb-2">
                Analyzing Your Skin
              </h3>
              <p className="text-gray-600 mb-4">
                Our AI is processing your image and analyzing skin conditions...
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✓ Image processing complete</p>
                <p>✓ Facial region detection</p>
                <p className="animate-pulse">⏳ Analyzing skin parameters...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PrivacyNotice
        open={showPrivacyNotice}
        onAccept={handlePrivacyAccept}
        onDecline={handlePrivacyDecline}
      />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-playfair font-bold text-navy-900 mb-2">
            AI Skin Analysis
          </h1>
          <p className="text-gray-600">
            Capture or upload a photo for comprehensive skin analysis
          </p>
        </div>

        <Tabs defaultValue="camera" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera" className="flex items-center space-x-2">
              <Camera size={18} />
              <span>Camera Capture</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload size={18} />
              <span>Upload Photo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="mt-6">
            <CameraCapture onCapture={handleCapture} isAnalyzing={isAnalyzing} />
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border-0">
              <CardHeader className="text-center">
                <CardTitle className="font-playfair text-2xl text-navy-900">
                  Upload Photo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-coral-400 transition-colors">
                  <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a photo to analyze
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Choose a clear, well-lit photo of the face
                  </p>
                  <Label htmlFor="photo-upload">
                    <Button className="bg-coral-500 hover:bg-coral-600 text-white">
                      Choose File
                    </Button>
                  </Label>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>📋 <strong>Supported formats:</strong> JPG, PNG, WEBP</p>
                  <p>📏 <strong>Recommended:</strong> High resolution, good lighting</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Scanning;
