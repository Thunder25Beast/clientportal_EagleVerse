
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalysisData, FacialRegionScore } from '@/types/analysis';
import { Eye, Download, Share, ArrowLeft } from 'lucide-react';

const AnalysisResults = () => {
  const location = useLocation();
  const analysis: AnalysisData = location.state?.analysis;
  const [selectedRegion, setSelectedRegion] = useState<FacialRegionScore | null>(null);

  if (!analysis) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">No Analysis Data</h2>
          <p className="text-gray-600">Please perform a skin analysis first.</p>
          <Button className="mt-4 bg-coral-500 hover:bg-coral-600">
            Start New Analysis
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getScoreColor = (score: number) => {
    if (score === -1) return 'bg-gray-200';
    if (score <= 3) return 'bg-green-500';
    if (score <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score === -1) return 'N/A';
    if (score <= 3) return 'Good';
    if (score <= 6) return 'Fair';
    return 'Needs Attention';
  };

  const regionPositions = {
    forehead: { top: '15%', left: '50%', transform: 'translateX(-50%)' },
    left_eye_side: { top: '30%', left: '30%' },
    right_eye_side: { top: '30%', right: '30%' },
    left_under_eye: { top: '35%', left: '35%' },
    right_under_eye: { top: '35%', right: '35%' },
    nose: { top: '45%', left: '50%', transform: 'translateX(-50%)' },
    left_cheek: { top: '55%', left: '25%' },
    right_cheek: { top: '55%', right: '25%' },
    chin: { bottom: '20%', left: '50%', transform: 'translateX(-50%)' }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to Scanning
            </Button>
            <div>
              <h1 className="text-3xl font-playfair font-bold text-navy-900">
                Skin Analysis Results
              </h1>
              <p className="text-gray-600">Analysis completed on {new Date(analysis.analysisDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Share size={16} className="mr-2" />
              Share
            </Button>
            <Button variant="outline">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Glow Index */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-playfair font-bold text-navy-900 mb-2">
                Overall Glow Index
              </h2>
              <div className="text-6xl font-bold text-coral-500 mb-4">
                {analysis.glowIndex.toFixed(1)}
              </div>
              <Progress value={analysis.glowIndex * 10} className="w-64 mx-auto" />
              <p className="text-gray-600 mt-2">out of 10.0</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Face Map */}
            <Card>
              <CardHeader>
                <CardTitle>Facial Region Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Face Diagram */}
                  <div className="flex-1">
                    <div className="relative w-80 h-96 mx-auto bg-gradient-to-b from-orange-100 to-orange-200 rounded-full border-4 border-orange-300">
                      {/* Face outline */}
                      <div className="absolute inset-4 bg-gradient-to-b from-pink-100 to-pink-200 rounded-full">
                        {/* Eyes */}
                        <div className="absolute top-8 left-16 w-8 h-4 bg-blue-300 rounded-full"></div>
                        <div className="absolute top-8 right-16 w-8 h-4 bg-blue-300 rounded-full"></div>
                        {/* Nose */}
                        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-pink-300 rounded"></div>
                        {/* Mouth */}
                        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-red-300 rounded-full"></div>
                      </div>
                      
                      {/* Region markers */}
                      {analysis.scores.map((region) => (
                        <button
                          key={region.name}
                          className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-transform ${getScoreColor(Math.max(region.darkCircles, region.darkSpots, region.fineLines, region.oiliness, region.wrinkles))}`}
                          style={regionPositions[region.name as keyof typeof regionPositions]}
                          onClick={() => setSelectedRegion(region)}
                        >
                          <span className="sr-only">{region.name}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-4">
                      Click on any region to see detailed analysis
                    </p>
                  </div>

                  {/* Region Details */}
                  <div className="flex-1">
                    {selectedRegion ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="capitalize">
                            {selectedRegion.name.replace(/_/g, ' ')} Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {[
                            { label: 'Dark Circles', value: selectedRegion.darkCircles },
                            { label: 'Dark Spots', value: selectedRegion.darkSpots },
                            { label: 'Fine Lines', value: selectedRegion.fineLines },
                            { label: 'Oiliness', value: selectedRegion.oiliness },
                            { label: 'Wrinkles', value: selectedRegion.wrinkles }
                          ].map((param) => (
                            <div key={param.label} className="flex items-center justify-between">
                              <span className="font-medium">{param.label}</span>
                              <div className="flex items-center space-x-2">
                                <Progress value={param.value === -1 ? 0 : param.value * 10} className="w-20" />
                                <Badge variant={param.value <= 3 ? 'default' : param.value <= 6 ? 'secondary' : 'destructive'}>
                                  {getScoreLabel(param.value)}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <Eye size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600">Select a region on the face map to view detailed analysis</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Treatment Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Treatments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {analysis.treatments.map((treatment) => (
                    <div key={treatment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-navy-900">{treatment.title}</h3>
                        <p className="text-gray-600 text-sm">{treatment.reason}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={treatment.priority === 'high' ? 'destructive' : treatment.priority === 'medium' ? 'secondary' : 'default'}>
                          {treatment.priority} priority
                        </Badge>
                        <span className="font-bold text-coral-500">{treatment.cost}</span>
                        <Button size="sm" className="bg-coral-500 hover:bg-coral-600">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            {/* Detailed Analysis Table */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Facial Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Region</th>
                        <th className="text-center p-3 font-semibold">Dark Circles</th>
                        <th className="text-center p-3 font-semibold">Dark Spots</th>
                        <th className="text-center p-3 font-semibold">Fine Lines</th>
                        <th className="text-center p-3 font-semibold">Oiliness</th>
                        <th className="text-center p-3 font-semibold">Wrinkles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.scores.map((region) => (
                        <tr key={region.name} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium capitalize">
                            {region.name.replace(/_/g, ' ')}
                          </td>
                          {[region.darkCircles, region.darkSpots, region.fineLines, region.oiliness, region.wrinkles].map((score, index) => (
                            <td key={index} className="p-3 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <span className={`w-3 h-3 rounded-full ${getScoreColor(score)}`}></span>
                                <span>{score === -1 ? 'N/A' : score}</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AnalysisResults;
