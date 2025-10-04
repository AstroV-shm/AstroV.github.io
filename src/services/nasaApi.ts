export interface NASAAsteroid {
  id: string;
  name: string;
  diameter: number;
  velocity: number;
  isPotentiallyHazardous: boolean;
  closeApproachDate: string;
  missDistance: number;
}

const NASA_API_KEY = 'DEMO_KEY';
const NASA_NEO_URL = 'https://api.nasa.gov/neo/rest/v1/feed';

const MOCK_ASTEROIDS: NASAAsteroid[] = [
  {
    id: '2021277',
    name: '277 Elvis',
    diameter: 450,
    velocity: 35.2,
    isPotentiallyHazardous: true,
    closeApproachDate: '2025-11-15',
    missDistance: 7500000,
  },
  {
    id: '433',
    name: '433 Eros',
    diameter: 340,
    velocity: 24.8,
    isPotentiallyHazardous: true,
    closeApproachDate: '2026-01-31',
    missDistance: 4200000,
  },
  {
    id: '99942',
    name: '99942 Apophis',
    diameter: 370,
    velocity: 30.7,
    isPotentiallyHazardous: true,
    closeApproachDate: '2029-04-13',
    missDistance: 31000,
  },
  {
    id: '101955',
    name: '101955 Bennu',
    diameter: 490,
    velocity: 28.6,
    isPotentiallyHazardous: true,
    closeApproachDate: '2135-09-25',
    missDistance: 750000,
  },
  {
    id: '1950DA',
    name: '29075 (1950 DA)',
    diameter: 1100,
    velocity: 15.3,
    isPotentiallyHazardous: true,
    closeApproachDate: '2880-03-16',
    missDistance: 8000000,
  },
  {
    id: '2340',
    name: '2340 Hathor',
    diameter: 210,
    velocity: 41.5,
    isPotentiallyHazardous: true,
    closeApproachDate: '2026-10-21',
    missDistance: 12000000,
  },
  {
    id: '4179',
    name: '4179 Toutatis',
    diameter: 520,
    velocity: 35.0,
    isPotentiallyHazardous: true,
    closeApproachDate: '2028-12-08',
    missDistance: 18000000,
  },
  {
    id: '2062',
    name: '2062 Aten',
    diameter: 900,
    velocity: 26.4,
    isPotentiallyHazardous: true,
    closeApproachDate: '2030-08-19',
    missDistance: 25000000,
  },
  {
    id: '1862',
    name: '1862 Apollo',
    diameter: 1400,
    velocity: 31.2,
    isPotentiallyHazardous: true,
    closeApproachDate: '2027-05-06',
    missDistance: 16000000,
  },
  {
    id: '1566',
    name: '1566 Icarus',
    diameter: 1300,
    velocity: 42.8,
    isPotentiallyHazardous: true,
    closeApproachDate: '2029-06-14',
    missDistance: 9500000,
  },
];

let cachedData: NASAAsteroid[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 3600000;

export async function fetchNASAAsteroids(): Promise<NASAAsteroid[]> {
  const now = Date.now();

  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedData;
  }

  try {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 7);

    const startDateStr = today.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const url = `${NASA_NEO_URL}?start_date=${startDateStr}&end_date=${endDateStr}&api_key=${NASA_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('NASA API request failed');
    }

    const data = await response.json();

    const asteroids: NASAAsteroid[] = [];

    Object.values(data.near_earth_objects as Record<string, any[]>).forEach((dayData) => {
      dayData.forEach((neo) => {
        const diameterData = neo.estimated_diameter?.meters;
        const closeApproach = neo.close_approach_data?.[0];

        if (diameterData && closeApproach) {
          asteroids.push({
            id: neo.id,
            name: neo.name,
            diameter: Math.round((diameterData.estimated_diameter_min + diameterData.estimated_diameter_max) / 2),
            velocity: parseFloat(closeApproach.relative_velocity.kilometers_per_second),
            isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
            closeApproachDate: closeApproach.close_approach_date,
            missDistance: parseFloat(closeApproach.miss_distance.kilometers),
          });
        }
      });
    });

    const hazardousAsteroids = asteroids
      .filter(a => a.isPotentiallyHazardous)
      .sort((a, b) => a.missDistance - b.missDistance)
      .slice(0, 10);

    cachedData = hazardousAsteroids.length > 0 ? hazardousAsteroids : MOCK_ASTEROIDS;
    cacheTimestamp = now;

    return cachedData;
  } catch (error) {
    console.warn('Failed to fetch NASA data, using mock data:', error);
    cachedData = MOCK_ASTEROIDS;
    cacheTimestamp = now;
    return MOCK_ASTEROIDS;
  }
}

export function parseDiameterRange(neo: any): number {
  const diameterData = neo.estimated_diameter?.meters;
  if (!diameterData) return 0;
  return Math.round((diameterData.estimated_diameter_min + diameterData.estimated_diameter_max) / 2);
}
