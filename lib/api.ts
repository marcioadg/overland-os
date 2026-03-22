export interface Campsite {
  id: string;
  name: string;
  type: 'BLM' | 'NFS' | 'Recreation';
  latitude: number;
  longitude: number;
  description?: string;
  isFree: boolean;
  hasWater: boolean;
  isDispersed: boolean;
  facilityName?: string;
}

const RECREATION_API_KEY = process.env.EXPO_PUBLIC_RECREATION_API_KEY ?? 'DEMO_KEY';
const RECREATION_BASE = 'https://ridb.recreation.gov/api/v1';

// 10 hardcoded mock BLM dispersed camping spots
export const MOCK_BLM_SPOTS: Campsite[] = [
  {
    id: 'blm-001',
    name: 'Moab Canyon Dispersed',
    type: 'BLM',
    latitude: 38.5733,
    longitude: -109.5498,
    description: 'Open desert dispersed camping near Moab, UT',
    isFree: true,
    hasWater: false,
    isDispersed: true,
    facilityName: 'BLM Moab Field Office',
  },
  {
    id: 'blm-002',
    name: 'Escalante River Corridor',
    type: 'BLM',
    latitude: 37.7765,
    longitude: -111.5949,
    description: 'Remote dispersed camping along the Escalante River',
    isFree: true,
    hasWater: true,
    isDispersed: true,
    facilityName: 'Grand Staircase-Escalante NM',
  },
  {
    id: 'blm-003',
    name: 'Owens Valley Flats',
    type: 'BLM',
    latitude: 36.9741,
    longitude: -118.0631,
    description: 'High desert dispersed near Bishop, CA',
    isFree: true,
    hasWater: false,
    isDispersed: true,
    facilityName: 'BLM Bishop Field Office',
  },
  {
    id: 'blm-004',
    name: 'Superstition Wilderness Trailhead',
    type: 'BLM',
    latitude: 33.4484,
    longitude: -111.4648,
    description: 'Desert dispersed camping east of Phoenix',
    isFree: true,
    hasWater: false,
    isDispersed: true,
    facilityName: 'Tonto NF / BLM',
  },
  {
    id: 'blm-005',
    name: 'Humboldt Basin Camp',
    type: 'BLM',
    latitude: 40.9646,
    longitude: -118.5876,
    description: 'Nevada high desert dispersed area',
    isFree: true,
    hasWater: false,
    isDispersed: true,
    facilityName: 'BLM Winnemucca District',
  },
  {
    id: 'blm-006',
    name: 'San Rafael Swell West',
    type: 'BLM',
    latitude: 38.8333,
    longitude: -110.8000,
    description: 'Classic Utah redrock dispersed camping',
    isFree: true,
    hasWater: false,
    isDispersed: true,
    facilityName: 'BLM Price Field Office',
  },
  {
    id: 'blm-007',
    name: 'Canyonlands Needles Overlook',
    type: 'BLM',
    latitude: 38.1500,
    longitude: -109.8200,
    description: 'Panoramic overlook dispersed sites',
    isFree: true,
    hasWater: false,
    isDispersed: true,
    facilityName: 'BLM Monticello Field Office',
  },
  {
    id: 'blm-008',
    name: 'Mojave Desert Wash',
    type: 'BLM',
    latitude: 34.8958,
    longitude: -115.5169,
    description: 'Accessible wash camping in the Mojave',
    isFree: true,
    hasWater: false,
    isDispersed: true,
    facilityName: 'BLM Needles Field Office',
  },
  {
    id: 'blm-009',
    name: 'Gila River Flats',
    type: 'BLM',
    latitude: 32.9500,
    longitude: -108.7000,
    description: 'Dispersed camping near the Gila River, NM',
    isFree: true,
    hasWater: true,
    isDispersed: true,
    facilityName: 'BLM Safford Field Office',
  },
  {
    id: 'blm-010',
    name: 'Black Rock Desert Playa',
    type: 'BLM',
    latitude: 40.8863,
    longitude: -119.0611,
    description: 'Famous alkali flat, unlimited dispersed camping',
    isFree: true,
    hasWater: false,
    isDispersed: true,
    facilityName: 'BLM Winnemucca District',
  },
];

interface RecreationCampsite {
  CampsiteID: string;
  CampsiteName: string;
  CampsiteLatitude: number;
  CampsiteLongitude: number;
  TypeOfUse: string;
  CampsiteReservable: boolean;
  FacilityName?: string;
  ATTRIBUTES?: Array<{ AttributeName: string; AttributeValue: string }>;
}

interface RecreationResponse {
  RECDATA: RecreationCampsite[];
  METADATA: {
    RESULTS: {
      CURRENT_COUNT: number;
      TOTAL_COUNT: number;
    };
  };
}

function parseRecreationCampsite(raw: RecreationCampsite): Campsite {
  const attrs = raw.ATTRIBUTES ?? [];
  const hasWater = attrs.some(
    (a) =>
      a.AttributeName.toLowerCase().includes('water') &&
      a.AttributeValue.toLowerCase() !== 'no'
  );

  return {
    id: `rec-${raw.CampsiteID}`,
    name: raw.CampsiteName || 'Unnamed Site',
    type: 'Recreation',
    latitude: raw.CampsiteLatitude,
    longitude: raw.CampsiteLongitude,
    isFree: !raw.CampsiteReservable,
    hasWater,
    isDispersed: false,
    facilityName: raw.FacilityName,
  };
}

export async function searchCampsites(query: string): Promise<Campsite[]> {
  const encoded = encodeURIComponent(query);
  const url = `${RECREATION_BASE}/campsites?query=${encoded}&apikey=${RECREATION_API_KEY}&limit=20`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      console.warn('Recreation.gov API error:', response.status);
      return [];
    }

    const data: RecreationResponse = await response.json();
    const recSites = (data.RECDATA ?? []).map(parseRecreationCampsite);
    return recSites;
  } catch (err) {
    console.error('searchCampsites fetch error:', err);
    return [];
  }
}

export function filterBLMByQuery(query: string): Campsite[] {
  const q = query.toLowerCase();
  return MOCK_BLM_SPOTS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      (s.description?.toLowerCase().includes(q) ?? false) ||
      (s.facilityName?.toLowerCase().includes(q) ?? false)
  );
}

export async function searchAllCampsites(query: string): Promise<Campsite[]> {
  const [recSites, blmMatches] = await Promise.all([
    searchCampsites(query),
    Promise.resolve(filterBLMByQuery(query)),
  ]);

  // If BLM filter returns nothing (query not in mock names), include all BLM spots
  const blmResults = blmMatches.length > 0 ? blmMatches : MOCK_BLM_SPOTS;

  return [...blmResults, ...recSites];
}
