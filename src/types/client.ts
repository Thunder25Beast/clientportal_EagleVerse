
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  skinType?: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';
  allergies?: string[];
  notes?: string;
  profileImage?: string;
  createdAt: string;
  lastVisit?: string;
  totalAnalyses: number;
  totalSpent: number;
  preferredTreatments: string[];
}

export interface Appointment {
  id: string;
  clientId: string;
  date: string;
  time: string;
  treatment: string;
  duration: number;
  cost: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface ClientHistory {
  analyses: string[]; // Analysis session IDs
  appointments: Appointment[];
  treatments: TreatmentRecord[];
}

export interface TreatmentRecord {
  id: string;
  clientId: string;
  treatmentName: string;
  cost: number;
  date: string;
  notes?: string;
  beforePhoto?: string;
  afterPhoto?: string;
}
