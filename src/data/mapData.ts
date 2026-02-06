// ============================================================================
// THE REALM — Map Data (from TheRealm_Final.html)
// ============================================================================

export const MAP_WIDTH = 3000;
export const MAP_HEIGHT = 2013;

export type LocationType = 'capitals' | 'cities' | 'battles' | 'passes' | 'waters' | 'sacred';

export interface MapLocation {
  id: string;
  name: string;
  cn: string;
  x: number;
  y: number;
  desc: string;
  detail: string;
}

export interface Kingdom {
  id: string;
  name: string;
  color: string;
  path: string;
}

export const MARKER_COLORS: Record<LocationType, string> = {
  capitals: '#ffd700',
  cities: '#c4b090',
  battles: '#c04040',
  passes: '#707070',
  waters: '#6090b0',
  sacred: '#9070c0',
};

export const MARKER_SIZES: Record<LocationType, number> = {
  capitals: 14,
  cities: 10,
  battles: 11,
  passes: 9,
  waters: 9,
  sacred: 12,
};

export const MARKER_LABELS: Record<LocationType, string> = {
  capitals: 'Capital',
  cities: 'City',
  battles: 'Battlefield',
  passes: 'Pass',
  waters: 'Waters',
  sacred: 'Sacred Site',
};

export const locations: Record<LocationType, MapLocation[]> = {
  capitals: [
    { id: 'steelhaven', name: 'Steelhaven', cn: '咸阳 Xianyang', x: 1170, y: 780, desc: 'The Iron Capital — seat of the fallen Empire', detail: 'Once the beating heart of the unified realm under the Iron Creed. Now contested, its great walls stand as monument to ambition and ruin.' },
    { id: 'drumhold', name: 'Drumhold', cn: '彭城 Pengcheng', x: 1320, y: 1380, desc: "Kharic Stormborn's seat — Heartbeat of Cheros", detail: 'The drums of war echo from these ancient halls. Here the Hegemon holds court, his crimson banners snapping in the wind.' },
    { id: 'westmarch', name: 'Westmarch Basin', cn: '汉中 Hanzhong', x: 420, y: 1050, desc: "Maren Ashford's territory", detail: 'Fertile valley protected by mountains. What others saw as exile, Maren transformed into the foundation of empire.' },
    { id: 'luminara', name: 'Luminara', cn: '洛邑 Luoyi', x: 930, y: 780, desc: 'Eastern Celestine capital — sacred but diminished', detail: 'The Heavenborne still holds court here, though his mandate extends no further than the palace walls.' },
    { id: 'goldenhall', name: 'Goldenhall', cn: '临淄 Linzi', x: 2370, y: 870, desc: 'Former capital of Aldoria', detail: 'Merchants and scholars once flocked to these gilded streets. The academies still stand.' },
    { id: 'dragonseat', name: 'Dragonseat', cn: '邯郸 Handan', x: 1230, y: 420, desc: 'Former capital of Dragonspire', detail: 'Cavalry masters trained here for generations. The steppe ponies still run wild.' },
    { id: 'grandgate', name: 'Grandgate', cn: '大梁 Daliang', x: 630, y: 810, desc: 'Former capital of Grandmark', detail: 'First of the Seven Mighty to fall to Ironhold reforms.' },
  ],
  cities: [
    { id: 'hallowmere', name: 'Hallowmere (ruins)', cn: '镐京 Haojing', x: 525, y: 630, desc: 'Original Celestine capital — destroyed', detail: 'Destroyed in the Heavenfall when the beacons burned false.' },
    { id: 'sanctum', name: 'Sanctum', cn: '鲁 Lu', x: 2130, y: 930, desc: 'Birthplace of the Sage-of-Sages', detail: 'Every scholar of the Covenant makes pilgrimage here.' },
    { id: 'crossways', name: 'Crossways (ruins)', cn: '郑 Zheng', x: 870, y: 870, desc: 'Former crossroads of power', detail: 'Changed hands a dozen times before being razed entirely.' },
    { id: 'oldfort', name: 'Oldfort', cn: '陈 Chen', x: 1320, y: 1080, desc: 'Ancient state with proud lineage', detail: 'Its lords traced their blood to the first kings.' },
    { id: 'thornfield', name: 'Thornfield', cn: '蔡 Cai', x: 1230, y: 1170, desc: 'Small state caught between powers', detail: 'Named for the thorns that grow wild on its hills.' },
    { id: 'wardmark', name: 'Wardmark', cn: '卫 Wei', x: 1050, y: 720, desc: 'Border state — defensive prowess', detail: 'Its walls held against a hundred sieges.' },
    { id: 'remnant', name: 'Remnant', cn: '宋 Song', x: 1500, y: 1020, desc: 'Descendants of the old Eld dynasty', detail: 'They kept the old rites when all others forgot.' },
    { id: 'tideholm', name: 'Tideholm', cn: '吴 Wu', x: 2475, y: 1350, desc: 'Southeastern maritime power', detail: 'Its ships once ruled the eastern seas.' },
    { id: 'farshore', name: 'Farshore', cn: '越 Yue', x: 2625, y: 1575, desc: 'Furthest southeastern realm', detail: 'Beyond the last maps, where the realm dissolves into jungle.' },
    { id: 'marshton', name: 'Marshton', cn: '曹 Cao', x: 1080, y: 930, desc: 'Minor state in lowland terrain', detail: 'Built on stilts over the endless mud.' },
    { id: 'valdria', name: 'Valdria', cn: '汉 Han', x: 520, y: 1150, desc: "Maren Ashford's domain — The Merchant of Ash", detail: 'Named after the Han River valley. What began as exile became the foundation of a dynasty.' },
  ],
  battles: [
    { id: 'gallows', name: "Gallow's Field", cn: '垓下 Gaixia', x: 1575, y: 1230, desc: 'Final siege of Kharic', detail: 'Ten thousand Cherosian songs rose in the midnight dark. Kharic knew his army had deserted in spirit.' },
    { id: 'ashford', name: "Ashford's Gorge", cn: '荥阳 Xingyang', x: 870, y: 930, desc: 'The prolonged stalemate', detail: 'Maren bled here, nearly died here. The gorge ran red for seasons.' },
    { id: 'sorrows', name: "Sorrow's Crossing", cn: '乌江 Wujiang', x: 1275, y: 1530, desc: 'Where Kharic met his end', detail: '"I cannot face the elders who sent eight thousand sons with me." His blade found his own throat.' },
    { id: 'hollow', name: 'The Hollow', cn: '鸿沟 Honggou', x: 1020, y: 1020, desc: 'Where the false treaty was signed', detail: 'They divided the realm with a knife on parchment. Neither intended to honor it.' },
    { id: 'sandbag', name: 'Sandbag River', cn: '潍水 Weishui', x: 2070, y: 675, desc: "Hank's drowning gambit", detail: 'Hank dammed the river, then released it. Twenty thousand drowned in an hour.' },
    { id: 'needles', name: "The Needle's Eye", cn: '井陉 Jingxing', x: 1125, y: 540, desc: "Hank's Back-to-Water gambit", detail: '"Burn the boats. There is no retreat." They won.' },
    { id: 'drumfall', name: 'Fall of Drumhold', cn: '彭城之战', x: 1470, y: 1320, desc: "Maren's crushing defeat", detail: 'Kharic smashed through in fury. Maren fled with a handful of survivors.' },
  ],
  passes: [
    { id: 'throat', name: 'The Throat', cn: '函谷关 Hanguguan', x: 480, y: 780, desc: 'Chokepoint protecting the Crownlands', detail: 'One man can hold this pass against a thousand.' },
    { id: 'tigersgate', name: 'Tigersgate', cn: '虎牢关 Hulaoguan', x: 825, y: 825, desc: 'Famous defensive position', detail: 'Named for the tiger that once guarded these heights.' },
    { id: 'timberways', name: 'The Timber-Ways', cn: '栈道 Zhandao', x: 375, y: 930, desc: 'Wooden cliff roads', detail: 'Planks nailed into sheer cliff faces, swaying over thousand-foot drops.' },
    { id: 'ghostroad', name: 'The Ghost Road', cn: '陈仓道 Chencang', x: 420, y: 990, desc: 'Secret mountain path', detail: 'Maren burned the Timber-Ways publicly, then marched through this forgotten track.' },
  ],
  waters: [
    { id: 'dreamfens', name: 'Dreamwater Fens', cn: '云梦泽 Yunmengze', x: 1280, y: 1520, desc: 'Vast marshlands', detail: 'Mist rises from these endless bogs. Armies have vanished here.' },
    { id: 'goldenflow', name: 'The Goldenflow', cn: '黄河 Yellow River', x: 900, y: 600, desc: 'Great northern river', detail: 'Its golden silt birthed the first kingdoms. Its floods have drowned a hundred more.' },
    { id: 'longwater', name: 'The Longwater', cn: '长江 Yangtze', x: 1200, y: 1170, desc: 'Great southern river', detail: 'Control the Longwater, control the realm.' },
  ],
  sacred: [
    { id: 'highfather', name: 'Highfather Peak', cn: '泰山 Mount Tai', x: 2250, y: 570, desc: 'Most sacred site', detail: 'Only those who have united the realm may climb to its summit and speak with Heaven.' },
  ],
};

export const kingdoms: Kingdom[] = [
  { id: 'ironhold', name: 'Ironhold', color: '#4a4a4a', path: 'M150,300 Q270,270 315,390 C360,540 330,720 345,900 Q360,1080 315,1170 C270,1260 210,1320 150,1350 Q90,1260 85,1080 C80,900 90,630 150,300 Z' },
  { id: 'crownlands', name: 'Crownlands', color: '#8b7355', path: 'M345,900 Q480,840 690,870 C900,900 1050,840 1140,870 Q1200,960 1140,1080 C1050,1230 900,1260 690,1230 Q480,1200 390,1110 C330,1020 345,930 345,900 Z' },
  { id: 'westmarch', name: 'Westmarch', color: '#2f4f4f', path: 'M150,1350 Q270,1290 420,1350 C570,1440 675,1500 750,1620 Q720,1770 600,1860 C450,1950 270,1920 180,1800 Q105,1680 90,1530 C82,1410 105,1350 150,1350 Z' },
  { id: 'ironmoor', name: 'Ironmoor', color: '#696969', path: 'M1140,870 Q1320,810 1500,840 C1680,870 1800,900 1860,990 Q1830,1110 1710,1200 C1560,1320 1380,1290 1200,1230 Q1080,1170 1140,1020 C1200,900 1140,870 1140,870 Z' },
  { id: 'ridgelands', name: 'Ridgelands', color: '#4682b4', path: 'M930,300 Q1200,240 1500,270 C1680,300 1800,390 1770,510 Q1710,660 1560,720 C1350,810 1140,780 1020,690 Q870,570 930,420 C960,330 930,300 930,300 Z' },
  { id: 'nordheim', name: 'Nordheim', color: '#5f9ea0', path: 'M1770,180 Q2040,135 2370,165 C2610,195 2760,270 2790,390 Q2760,540 2550,600 C2280,675 1980,630 1800,540 Q1650,450 1680,330 C1710,240 1770,180 1770,180 Z' },
  { id: 'easternshore', name: 'Eastern Shore', color: '#daa520', path: 'M2550,600 Q2730,540 2850,630 C2940,720 2970,870 2940,1050 Q2880,1230 2700,1320 C2475,1425 2250,1380 2100,1275 Q1980,1170 2010,1020 C2055,840 2250,720 2550,600 Z' },
  { id: 'cheros', name: 'Cheros', color: '#8b0000', path: 'M750,1470 Q1050,1410 1425,1440 C1800,1470 2100,1530 2250,1650 Q2340,1770 2295,1860 C2175,1950 1875,1980 1425,1980 Q975,1980 675,1920 C450,1860 360,1740 405,1590 Q480,1470 750,1470 Z' },
];
