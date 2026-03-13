// API Response Types
export interface StudySite {
  facility: string;
  city: string;
  country: string;
}

export interface NormalizedStudy {
  nctId: string;
  overallStatus: string;
  startDate: string | null;
  leadSponsorName: string | null;
  countries: string[];
  phases: string[];
  studySites: StudySite[];
}

export interface PreviewMetrics {
  totalTrials: number;
  recruitingTrials: number;
  recruitingPct: number;
  countryDistribution: Array<{ country: string; count: number }>;
  topStudySites: Array<{ facility: string; count: number }>;
  topSponsors: Array<{ sponsor: string; count: number }>;
}

export type FetchTrialsResponse =
  | {
      error: false;
      indication: string;
      phase: string;
      country_name: string;
      country_code?: string;
      studies: NormalizedStudy[];
      sampledStudyCount: number;
      preview: PreviewMetrics;
      key_insight: string;
      note: string;
    }
  | {
      error: true;
      reason: string;
      suggestion: string;
      studies: [];
    };

// Form Types
export interface SnapshotFormData {
  indication: string;
  phase: 'All' | 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Phase 4';
  country_name: string;
  country_code?: string;
  email?: string;
  company?: string;
  user_question?: string;
}

export interface RfpFormData {
  email: string;
  company?: string;
  message?: string;
  file: File; // required; validated client-side
}

export interface DctWaitlistFormData {
  email: string;
}
