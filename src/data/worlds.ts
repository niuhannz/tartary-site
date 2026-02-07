export interface WorldLocation {
  name: string;
  lat: number;
  lng: number;
  type: 'capital' | 'city' | 'landmark' | 'conflict';
  description?: string;
}

export interface WorldDefinition {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  accentColor: string;
  accentColorLight: string;
  texturePath: string;
  flatMapTexturePath: string;
  mapType: 'fantasy' | 'earth-based';
  era?: string;
  keyLocations: WorldLocation[];
  lore: string;
}

export const WORLDS: Record<string, WorldDefinition> = {
  HEAVENFALL: {
    id: 'HEAVENFALL',
    name: 'HEAVENFALL',
    subtitle: 'The Realm of the Ancient Fifteen',
    description:
      'A sprawling fantasy continent shaped by sacred kings, jade spires, and the Mandate of Heaven. Two eras of war and rebirth across eight kingdoms.',
    accentColor: '#ff4d00',
    accentColorLight: '#ff7a3d',
    texturePath: '/textures/globe-heavenfall.jpg',
    flatMapTexturePath: '/map.svg',
    mapType: 'fantasy',
    era: 'The War of Ash and Storm',
    keyLocations: [
      { name: 'Steelhaven', lat: 20, lng: -30, type: 'capital', description: 'Seat of the Ironhold dynasty' },
      { name: 'Drumhold', lat: -10, lng: 45, type: 'capital', description: 'Fortress of the Hegemon' },
      { name: 'Luminara', lat: 35, lng: 10, type: 'capital', description: 'Where Heaven\'s Mandate first touched mortal soil' },
      { name: 'Hallowmere', lat: 15, lng: -60, type: 'city', description: 'The ruins where beacons burned for a smile' },
      { name: "Gallow's Field", lat: -25, lng: 20, type: 'conflict', description: 'The bloodiest battle of the Baseborn War' },
      { name: 'The Hollow', lat: 5, lng: 70, type: 'landmark', description: 'Where the realm was divided' },
    ],
    lore: 'When the ancient order collapsed, two titans — Maren Ashford and Kharic Stormborn — waged a war that would reshape civilisation itself. HEAVENFALL chronicles the fall of an empire and the rise of a peasant king.',
  },

  MARGIN: {
    id: 'MARGIN',
    name: 'MARGIN',
    subtitle: 'On the Water\'s Margin',
    description:
      'Our world, reimagined. Borders have shifted, alliances redrawn. A saga of outlaws, honour, and rebellion set against a familiar yet altered geography.',
    accentColor: '#d4a574',
    accentColorLight: '#e8c9a0',
    texturePath: '/textures/globe-margin.jpg',
    flatMapTexturePath: '/textures/flat-margin.jpg',
    mapType: 'earth-based',
    era: 'The Age of Outlaws',
    keyLocations: [
      { name: 'Liangshan', lat: 35.8, lng: 116.0, type: 'landmark', description: 'The great marsh stronghold' },
      { name: 'Kaifeng', lat: 34.8, lng: 114.3, type: 'capital', description: 'The Imperial capital' },
      { name: 'The Yellow River Delta', lat: 37.5, lng: 118.5, type: 'landmark', description: 'Where the rivers converge' },
      { name: 'Jiangnan', lat: 31.2, lng: 121.5, type: 'city', description: 'The southern lands of silk and silver' },
      { name: 'The Northern Frontier', lat: 42.0, lng: 115.0, type: 'conflict', description: 'Where empires meet the steppe' },
    ],
    lore: 'Inspired by the great Chinese literary classic, MARGIN reimagines the Water Margin saga on a world where geography is familiar but history has taken a different turn. Outlaws become heroes, and rebellion becomes revolution.',
  },

  XT111: {
    id: 'XT111',
    name: 'XT111',
    subtitle: 'Signal Received',
    description:
      'Earth, 2089. After first contact, borders dissolved and reformed. Nations merged, fractured, and evolved around new centres of power aligned to the signal.',
    accentColor: '#00d4ff',
    accentColorLight: '#66e5ff',
    texturePath: '/textures/globe-xt111.jpg',
    flatMapTexturePath: '/textures/flat-xt111.jpg',
    mapType: 'earth-based',
    era: 'Post-Contact Era',
    keyLocations: [
      { name: 'Neo Shanghai', lat: 31.2, lng: 121.5, type: 'capital', description: 'Humanity\'s new nexus' },
      { name: 'The Signal Array', lat: -33.9, lng: 18.4, type: 'landmark', description: 'Where the first transmission was decoded' },
      { name: 'Arctic Sovereignty', lat: 75.0, lng: 40.0, type: 'capital', description: 'The ice nations' },
      { name: 'Meridian', lat: 0.0, lng: 0.0, type: 'landmark', description: 'The equatorial neutral zone' },
      { name: 'Pacific Confederation', lat: -15.0, lng: -170.0, type: 'capital', description: 'The island alliance' },
    ],
    lore: 'When signal XT-111 was decoded in 2089, everything changed. Nations that once competed for land now competed for bandwidth. XT111 tells the story of humanity\'s first century after proof that we are not alone.',
  },

  THE_UNRECORDED: {
    id: 'THE_UNRECORDED',
    name: 'THE UNRECORDED',
    subtitle: 'What History Forgot',
    description:
      'The real world, but the parts they left out. Alternative history where suppressed events, hidden civilisations, and erased chapters come to light.',
    accentColor: '#a0886e',
    accentColorLight: '#c4ad94',
    texturePath: '/textures/globe-unrecorded.jpg',
    flatMapTexturePath: '/textures/flat-unrecorded.jpg',
    mapType: 'earth-based',
    era: 'The Hidden Timeline',
    keyLocations: [
      { name: 'Tartaria', lat: 50.0, lng: 70.0, type: 'capital', description: 'The empire that was erased' },
      { name: 'The Mud Flood Line', lat: 48.0, lng: 15.0, type: 'landmark', description: 'Where the old world was buried' },
      { name: 'Great Wall Interior', lat: 40.4, lng: 116.6, type: 'landmark', description: 'Built to keep something in, not out' },
      { name: 'The Star Forts', lat: 45.0, lng: 30.0, type: 'conflict', description: 'Geometric fortifications of unknown origin' },
      { name: 'Tennessee Archives', lat: 36.2, lng: -86.8, type: 'city', description: 'Where the records were found' },
    ],
    lore: 'History is written by the victors — but what about the parts they burned? THE UNRECORDED explores the real-world mysteries, suppressed histories, and architectural anomalies that don\'t fit the official narrative.',
  },
};

export const WORLD_ORDER = ['HEAVENFALL', 'MARGIN', 'XT111', 'THE_UNRECORDED'] as const;
export type WorldId = (typeof WORLD_ORDER)[number];
