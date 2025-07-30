import { SignAttributes, Element, Modality, NatalChart, CompatibilityScore, PlanetPosition } from './astro-types';

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export const SIGN_ATTRIBUTES: Record<string, SignAttributes> = {
  Aries: { element: 'Fire', modality: 'Cardinal', ruler: 'Mars' },
  Taurus: { element: 'Earth', modality: 'Fixed', ruler: 'Venus' },
  Gemini: { element: 'Air', modality: 'Mutable', ruler: 'Mercury' },
  Cancer: { element: 'Water', modality: 'Cardinal', ruler: 'Moon' },
  Leo: { element: 'Fire', modality: 'Fixed', ruler: 'Sun' },
  Virgo: { element: 'Earth', modality: 'Mutable', ruler: 'Mercury' },
  Libra: { element: 'Air', modality: 'Cardinal', ruler: 'Venus' },
  Scorpio: { element: 'Water', modality: 'Fixed', ruler: 'Mars' },
  Sagittarius: { element: 'Fire', modality: 'Mutable', ruler: 'Jupiter' },
  Capricorn: { element: 'Earth', modality: 'Cardinal', ruler: 'Saturn' },
  Aquarius: { element: 'Air', modality: 'Fixed', ruler: 'Uranus' },
  Pisces: { element: 'Water', modality: 'Mutable', ruler: 'Neptune' }
};

export function calculateElementCompatibility(element1: Element, element2: Element): number {
  const compatibilityMatrix: Record<Element, Record<Element, number>> = {
    Fire: { Fire: 0.9, Air: 0.8, Earth: 0.4, Water: 0.3 },
    Earth: { Earth: 0.9, Water: 0.7, Fire: 0.4, Air: 0.5 },
    Air: { Air: 0.9, Fire: 0.8, Water: 0.5, Earth: 0.5 },
    Water: { Water: 0.9, Earth: 0.7, Air: 0.5, Fire: 0.3 }
  };
  
  return compatibilityMatrix[element1][element2];
}

export function calculateModalityCompatibility(modality1: Modality, modality2: Modality): number {
  const compatibilityMatrix: Record<Modality, Record<Modality, number>> = {
    Cardinal: { Cardinal: 0.6, Fixed: 0.7, Mutable: 0.8 },
    Fixed: { Fixed: 0.8, Cardinal: 0.7, Mutable: 0.6 },
    Mutable: { Mutable: 0.9, Cardinal: 0.8, Fixed: 0.6 }
  };
  
  return compatibilityMatrix[modality1][modality2];
}

export function calculateAspectScore(degree1: number, degree2: number): number {
  const orb = Math.abs(degree1 - degree2);
  const normalizedOrb = Math.min(orb, 360 - orb);
  
  const aspects = [
    { angle: 0, score: 0.9, name: 'Conjunction' },
    { angle: 60, score: 0.8, name: 'Sextile' },
    { angle: 90, score: 0.4, name: 'Square' },
    { angle: 120, score: 0.9, name: 'Trine' },
    { angle: 180, score: 0.3, name: 'Opposition' }
  ];
  
  for (const aspect of aspects) {
    if (Math.abs(normalizedOrb - aspect.angle) <= 8) {
      return aspect.score;
    }
  }
  
  return 0.5;
}

export function generateBasicNatalChart(birthDate: Date): NatalChart {
  const dayOfYear = Math.floor((birthDate.getTime() - new Date(birthDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const baseSign = Math.floor((dayOfYear * 12) / 365) % 12;
  
  const createPlanet = (offset: number): PlanetPosition => ({
    planet: '',
    sign: ZODIAC_SIGNS[(baseSign + offset) % 12],
    degree: Math.floor(Math.random() * 30),
    house: Math.floor(Math.random() * 12) + 1
  });
  
  return {
    sun: { ...createPlanet(0), planet: 'Sun' },
    moon: { ...createPlanet(1), planet: 'Moon' },
    mercury: { ...createPlanet(0), planet: 'Mercury' },
    venus: { ...createPlanet(1), planet: 'Venus' },
    mars: { ...createPlanet(2), planet: 'Mars' },
    jupiter: { ...createPlanet(3), planet: 'Jupiter' },
    saturn: { ...createPlanet(4), planet: 'Saturn' },
    uranus: { ...createPlanet(5), planet: 'Uranus' },
    neptune: { ...createPlanet(6), planet: 'Neptune' },
    pluto: { ...createPlanet(7), planet: 'Pluto' },
    ascendant: { ...createPlanet(8), planet: 'Ascendant' },
    midheaven: { ...createPlanet(9), planet: 'Midheaven' }
  };
}

export function calculateCompatibility(chart1: NatalChart, chart2: NatalChart): CompatibilityScore {
  const sunSign1 = SIGN_ATTRIBUTES[chart1.sun.sign];
  const sunSign2 = SIGN_ATTRIBUTES[chart2.sun.sign];
  
  const moonSign1 = SIGN_ATTRIBUTES[chart1.moon.sign];
  const moonSign2 = SIGN_ATTRIBUTES[chart2.moon.sign];
  
  const mercurySign1 = SIGN_ATTRIBUTES[chart1.mercury.sign];
  const mercurySign2 = SIGN_ATTRIBUTES[chart2.mercury.sign];
  
  const sunCompatibility = calculateElementCompatibility(sunSign1.element, sunSign2.element);
  const moonCompatibility = calculateElementCompatibility(moonSign1.element, moonSign2.element);
  const mercuryCompatibility = calculateElementCompatibility(mercurySign1.element, mercurySign2.element);
  
  const modalityCompatibility = calculateModalityCompatibility(sunSign1.modality, sunSign2.modality);
  
  const communication = (mercuryCompatibility * 0.7) + (sunCompatibility * 0.3);
  const collaboration = (moonCompatibility * 0.6) + (sunCompatibility * 0.4);
  const leadership = (sunCompatibility * 0.8) + (modalityCompatibility * 0.2);
  const creativity = (sunCompatibility * 0.5) + (moonCompatibility * 0.3) + (mercuryCompatibility * 0.2);
  const workStyle = (modalityCompatibility * 0.6) + (sunCompatibility * 0.4);
  
  const overall = (communication + collaboration + leadership + creativity + workStyle) / 5;
  
  return {
    overall: Math.round(overall * 100),
    communication: Math.round(communication * 100),
    collaboration: Math.round(collaboration * 100),
    leadership: Math.round(leadership * 100),
    creativity: Math.round(creativity * 100),
    workStyle: Math.round(workStyle * 100)
  };
}