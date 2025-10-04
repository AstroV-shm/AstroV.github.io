export interface AsteroidParams {
  diameter: number;
  velocity: number;
  angle: number;
  density: 'rocky' | 'metallic' | 'icy';
}

export interface ImpactResults {
  mass: number;
  impactEnergy: number;
  tntEquivalent: number;
  craterDiameter: number;
  craterDepth: number;
  affectedAreaRadius: number;
  fireball: number;
  thermalRadiation: number;
  seismicMagnitude: number;
  casualtyEstimate: number;
  airBlast: number;
}

const DENSITIES = {
  rocky: 3000,
  metallic: 8000,
  icy: 1000,
};

const G = 9.81;

export function calculateImpact(
  params: AsteroidParams,
  population: number = 0
): ImpactResults {
  const { diameter, velocity, angle, density } = params;

  const radius = diameter / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const densityValue = DENSITIES[density];
  const mass = volume * densityValue;

  const velocityMs = velocity * 1000;
  const impactEnergy = 0.5 * mass * Math.pow(velocityMs, 2) * Math.sin((angle * Math.PI) / 180);

  const tntEquivalent = impactEnergy / 4.184e9;

  const craterDiameter = 2 * Math.pow(impactEnergy / (G * densityValue), 0.25);
  const craterDepth = craterDiameter / 3;

  const affectedAreaRadius = Math.pow(tntEquivalent, 0.33) * 1000;

  const fireball = Math.pow(tntEquivalent, 0.4) * 100;

  const thermalRadiation = Math.pow(tntEquivalent, 0.41) * 150;

  const seismicMagnitude = Math.log10(impactEnergy) - 4.8;

  const airBlast = Math.pow(tntEquivalent, 0.33) * 800;

  let casualtyEstimate = 0;
  if (population > 0) {
    const affectedArea = Math.PI * Math.pow(affectedAreaRadius, 2);
    const populationDensity = population / 1000000;
    casualtyEstimate = Math.floor(affectedArea * populationDensity * 0.7);
  }

  return {
    mass,
    impactEnergy,
    tntEquivalent,
    craterDiameter,
    craterDepth,
    affectedAreaRadius,
    fireball,
    thermalRadiation,
    seismicMagnitude: Math.max(0, seismicMagnitude),
    casualtyEstimate,
    airBlast,
  };
}

export function calculateMitigation(
  energyMT: number,
  daysBeforeImpact: number,
  strategy: 'kinetic' | 'nuclear' | 'gravity'
): {
  deflectionNeeded: number;
  successProbability: number;
  description: string;
} {
  const timeYears = daysBeforeImpact / 365;

  let baseSuccess = 0;
  let description = '';

  switch (strategy) {
    case 'kinetic':
      baseSuccess = timeYears > 5 ? 85 : timeYears > 2 ? 60 : timeYears > 1 ? 35 : 10;
      description = 'Launch spacecraft to collide with asteroid, changing its momentum';
      break;
    case 'nuclear':
      baseSuccess = timeYears > 3 ? 90 : timeYears > 1 ? 70 : timeYears > 0.5 ? 45 : 20;
      description = 'Detonate nuclear device near asteroid to vaporize surface material';
      break;
    case 'gravity':
      baseSuccess = timeYears > 10 ? 95 : timeYears > 5 ? 50 : 15;
      description = 'Position spacecraft near asteroid to gradually alter trajectory via gravity';
      break;
  }

  const energyFactor = Math.max(0, 1 - (energyMT / 1000));
  const successProbability = Math.min(95, baseSuccess * energyFactor);

  const deflectionNeeded = 0.0001 * Math.sqrt(energyMT) / timeYears;

  return {
    deflectionNeeded,
    successProbability: Math.max(5, successProbability),
    description,
  };
}

export function getHistoricalImpacts() {
  return [
    {
      name: 'Chicxulub Impact',
      year: -65000000,
      diameter: 10000,
      energy: 100000000,
      location: 'Yucatan Peninsula, Mexico',
      effect: 'Dinosaur extinction event',
    },
    {
      name: 'Tunguska Event',
      year: 1908,
      diameter: 60,
      energy: 15,
      location: 'Siberia, Russia',
      effect: '2,000 km² of forest destroyed',
    },
    {
      name: 'Chelyabinsk Meteor',
      year: 2013,
      diameter: 20,
      energy: 0.5,
      location: 'Chelyabinsk, Russia',
      effect: '1,500 injuries, widespread damage',
    },
    {
      name: 'Meteor Crater',
      year: -50000,
      diameter: 50,
      energy: 10,
      location: 'Arizona, USA',
      effect: '1.2 km crater formed',
    },
  ];
}
