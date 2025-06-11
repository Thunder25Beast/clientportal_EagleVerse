
export interface FacialRegionScore {
  name: string;
  darkCircles: number; // 0-10 scale, -1 means not applicable
  darkSpots: number;
  fineLines: number;
  oiliness: number;
  wrinkles: number;
}

export interface TreatmentRecommendation {
  id: number;
  title: string;
  cost: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AnalysisData {
  glowIndex: number; // 0-10 overall skin health score
  scores: FacialRegionScore[];
  treatments: TreatmentRecommendation[];
  analysisDate: string;
  imageUrl?: string;
}

export interface SkinAnalysisSession {
  id: string;
  clientId: string;
  analysis: AnalysisData;
  createdAt: string;
  notes?: string;
}

export const FACIAL_REGIONS = [
  'forehead',
  'left_eye_side',
  'right_eye_side',
  'left_under_eye',
  'right_under_eye',
  'nose',
  'left_cheek',
  'right_cheek',
  'chin'
] as const;

export const SKIN_PARAMETERS = [
  'darkCircles',
  'darkSpots',
  'fineLines',
  'oiliness',
  'wrinkles'
] as const;

export type FacialRegion = typeof FACIAL_REGIONS[number];
export type SkinParameter = typeof SKIN_PARAMETERS[number];
