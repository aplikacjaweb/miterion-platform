import type { NormalizedStudy, PreviewMetrics } from '@/types';

const API_URL = 'https://clinicaltrials.gov/api/v2/studies';

type RawStudy = {
  protocolSection: {
    identificationModule: {
      nctId: string;
      organization: {
        fullName: string;
      };
    };
    statusModule: {
      overallStatus: string;
      startDateStruct?: {
        date: string;
      };
    };
    sponsorCollaboratorsModule: {
      leadSponsor: {
        name: string;
      };
    };
    designModule: {
      phases?: string[];
    };
    contactsLocationsModule: {
      locations?: Array<{
        facility: string;
        city: string;
        country: string;
      }>;
    };
  };
};

interface SearchParams {
  indication: string;
  phase: string;
  country_name: string;
  country_code?: string;
}


function normalizeStudy(raw: RawStudy): NormalizedStudy {
  const proto = raw.protocolSection;
  const locations = proto.contactsLocationsModule?.locations || [];

  return {
    nctId: proto.identificationModule.nctId,
    overallStatus: proto.statusModule.overallStatus,
    startDate: proto.statusModule.startDateStruct?.date || null,
    leadSponsorName: proto.sponsorCollaboratorsModule?.leadSponsor?.name || null,
    countries: Array.from(new Set(locations.map((l) => l.country))),
    phases: proto.designModule?.phases || [],
    studySites: locations.map((l) => ({
      facility: l.facility,
      city: l.city,
      country: l.country,
    })),
  };
}

function generatePreviewMetrics(studies: NormalizedStudy[]): PreviewMetrics {
  const totalTrials = studies.length;
  const recruitingTrials = studies.filter((s) =>
    s.overallStatus.toLowerCase() === 'recruiting'
  ).length;

  const countryMap = new Map<string, number>();
  studies.forEach((study) => {
    study.countries.forEach((country) => {
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });
  });

  const siteMap = new Map<string, number>();
  studies.forEach((study) => {
    study.studySites.forEach((site) => {
      siteMap.set(site.facility, (siteMap.get(site.facility) || 0) + 1);
    });
  });

  const sponsorMap = new Map<string, number>();
  studies.forEach((study) => {
    if (study.leadSponsorName) {
      sponsorMap.set(
        study.leadSponsorName,
        (sponsorMap.get(study.leadSponsorName) || 0) + 1
      );
    }
  });

  return {
    totalTrials,
    recruitingTrials,
    recruitingPct: totalTrials > 0 ? Math.round((recruitingTrials / totalTrials) * 100) : 0,
    countryDistribution: Array.from(countryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({ country, count })),
    topStudySites: [...siteMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([facility, count]) => ({ facility, count })),
    topSponsors: [...sponsorMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([sponsor, count]) => ({ sponsor, count })),
  };
}

function generateKeyInsight({
  indication,
  phase,
  country_name,
  preview,
}: { indication: string; phase: string; country_name: string; preview: PreviewMetrics }): string {
  const competitionLevel = (() => {
    if (preview.totalTrials > 10) return 'high';
    if (preview.totalTrials >= 4) return 'medium';
    return 'low';
  })();

  const topCountry = preview.countryDistribution[0]?.country;
  const topSponsor = preview.topSponsors[0]?.sponsor;

  let insight = `Recruitment competition for ${indication} in ${country_name} is ${competitionLevel}`;;

  if (phase !== 'All') {
    insight += ` for Phase ${phase.replace('Phase ','')} trials`;
  }

  if (topCountry && preview.countryDistribution[0].count > 1) {
    insight += ` with ${preview.countryDistribution[0].count} trials in ${topCountry}`;;
  }

  if (topSponsor) {
    insight += ` and ${topSponsor} as a top sponsor`;
  }

  insight += '.';
  return insight;
}

export async function fetchTrials({ indication, phase, country_name, country_code }: SearchParams) {
  // Build query string — URLSearchParams only accepts string values
  const params = new URLSearchParams({
    'query.cond': indication,
    format: 'json',
    pageSize: '100',
  });

  if (country_name) {
    params.append('filter.advanced', `AREA[LocationCountry] ${country_name}`);
  }

  if (phase !== 'All') {
    // Map phase label to API enum value
    const phaseMap: Record<string, string> = {
      'Phase 1': 'PHASE1',
      'Phase 2': 'PHASE2',
      'Phase 3': 'PHASE3',
      'Phase 4': 'PHASE4',
    };
    if (phaseMap[phase]) {
      params.append('filter.advanced', `AREA[Phase] ${phaseMap[phase]}`);
    }
  }

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      // 10-second timeout via AbortController
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) throw new Error(`API responded ${response.status}`);

    const data = await response.json();
    const rawStudies: RawStudy[] = data.studies ?? [];
    const studies = rawStudies.map(normalizeStudy);

    return {
      error: false as const,
      indication,
      phase,
      country_name,
      country_code,
      studies,
      sampledStudyCount: studies.length,
      preview: generatePreviewMetrics(studies),
      key_insight: generateKeyInsight({ indication, phase, country_name, preview: generatePreviewMetrics(studies) }),
      note: studies.length === 100 ? 'Limited to first 100 results' : '',
    };
  } catch (error) {
    console.error('ClinicalTrials.gov API error:', error);
    return {
      error: true as const,
      reason: 'Failed to fetch trial data',
      suggestion: 'Please try again in a few minutes',
      studies: [] as [],
    };
  }
}

