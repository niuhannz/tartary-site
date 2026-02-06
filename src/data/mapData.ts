// ============================================================================
// GEOGRAPHIC DATA - The Realm of Heavenfall & BASEBORN
// ============================================================================

export interface MapLocation {
  id: string;
  name: string;
  originalName: string;
  type: 'capital' | 'ruins' | 'river' | 'pass' | 'mountain' | 'battlefield' | 'strategic' | 'realm';
  x: number;
  y: number;
  realm?: string;
  description: string;
  lore: string;
  era: 'heavenfall' | 'baseborn' | 'both';
  path?: number[][];
  color?: string;
}

export interface LocationData {
  capitals: MapLocation[];
  rivers: MapLocation[];
  passes?: MapLocation[];
  mountains?: MapLocation[];
  battlefields?: MapLocation[];
  strategicPoints?: MapLocation[];
  realms: MapLocation[];
}

export const LOCATIONS_HEAVENFALL: LocationData = {
  capitals: [
    {
      id: 'steelhaven',
      name: 'Steelhaven',
      originalName: '咸阳 (Xianyang)',
      type: 'capital',
      x: 25,
      y: 45,
      realm: 'Ironhold',
      description: 'The Iron Capital. Seat of the Empire. Built on principles of the Iron Creed, its walls have never been breached from without.',
      lore: 'From these obsidian towers, the Ironhold emperors commanded the greatest military machine the realm has ever known. The city\'s forges never cool, and the smoke from its foundries can be seen for leagues.',
      era: 'both'
    },
    {
      id: 'luminara',
      name: 'Luminara',
      originalName: '洛邑 (Luoyi)',
      type: 'capital',
      x: 50,
      y: 40,
      realm: 'Celestine',
      description: 'The Eastern Celestine capital. Seat of sacred but diminished power. Where Heaven\'s Mandate first touched mortal soil.',
      lore: 'Once the heart of divine authority, Luminara\'s jade spires still catch the first light of dawn. The Ordaineds maintain their vigil here, preserving rites older than memory.',
      era: 'heavenfall'
    },
    {
      id: 'goldenhall',
      name: 'Goldenhall',
      originalName: '临淄 (Linzi)',
      type: 'capital',
      x: 70,
      y: 35,
      realm: 'Aldoria',
      description: 'Capital of Aldoria. Centre of commerce and learning. Where philosophy and profit walk hand in hand.',
      lore: 'The markets of Goldenhall never close. Scholars debate in perfumed halls while merchants count fortunes in the bazaars below. Aldric Valorian made this city the envy of all realms.',
      era: 'heavenfall'
    },
    {
      id: 'dragonseat',
      name: 'Dragonseat',
      originalName: '邯郸 (Handan)',
      type: 'capital',
      x: 55,
      y: 28,
      realm: 'Dragonspire',
      description: 'Capital of Dragonspire. Known for its cavalry masters and the legendary Dragonspire Guard.',
      lore: 'Built into the base of the great northern peaks, Dragonseat\'s streets are wide enough for cavalry charges. The thunder of hooves is the city\'s heartbeat.',
      era: 'heavenfall'
    },
    {
      id: 'hallowmere',
      name: 'Hallowmere (Ruins)',
      originalName: '镐京 (Haojing)',
      type: 'ruins',
      x: 30,
      y: 38,
      realm: 'Celestine',
      description: 'The fallen Western Celestine capital. Destroyed in Heavenfall. Where the beacons burned for a smile.',
      lore: 'Nothing grows in Hallowmere now. The stones still carry the scorch marks of that final night when King Aldric the Blind lit the beacons for Seraphine Coldmoon\'s smile.',
      era: 'heavenfall'
    }
  ],
  rivers: [
    {
      id: 'goldenflow',
      name: 'The Goldenflow',
      originalName: '黄河 (Yellow River)',
      type: 'river',
      x: 50,
      y: 32,
      description: 'The great northern river. Mother of civilisation. Its golden silt feeds the Heartlands.',
      lore: 'They say the Goldenflow carries the tears of Heaven itself. Its floods have ended dynasties and birthed new ones. To control the Goldenflow is to hold the realm\'s fate.',
      era: 'both',
      path: [[15, 35], [35, 30], [55, 32], [75, 28], [90, 35]]
    },
    {
      id: 'longwater',
      name: 'The Longwater',
      originalName: '长江 (Yangtze)',
      type: 'river',
      x: 50,
      y: 60,
      description: 'The great southern river. Divides north and south. Barrier between Cheros and the northern realms.',
      lore: 'Wide as a sea in places, the Longwater has swallowed more armies than any battlefield. Valdrosian sailors know its moods like a lover\'s temperament.',
      era: 'both',
      path: [[10, 65], [30, 62], [50, 58], [70, 60], [90, 55]]
    }
  ],
  passes: [
    {
      id: 'throat',
      name: 'The Throat',
      originalName: '函谷关 (Hangu Pass)',
      type: 'pass',
      x: 35,
      y: 42,
      realm: 'Ironhold',
      description: 'The narrow chokepoint protecting Ironhold. Where one thousand can hold against one hundred thousand.',
      lore: 'Carved by gods or giants, none remember. The Throat has never fallen to frontal assault. Its cliffs weep with the blood of those who tried.',
      era: 'both'
    },
    {
      id: 'tigersgate',
      name: 'Tigersgate',
      originalName: '虎牢关 (Hulao Pass)',
      type: 'pass',
      x: 48,
      y: 44,
      description: 'Famous defensive position in the Heartlands. Named for the tiger that once guarded these stones.',
      lore: 'Legends speak of a white tiger that devoured an entire army here. Whether beast or general, the name endures.',
      era: 'both'
    }
  ],
  mountains: [
    {
      id: 'highfather',
      name: 'Highfather Peak',
      originalName: '泰山 (Mount Tai)',
      type: 'mountain',
      x: 65,
      y: 38,
      description: 'Most sacred mountain. Where kings perform the Fengshan sacrifices to Heaven.',
      lore: 'To stand atop Highfather Peak is to stand closest to Heaven. Only those bearing the true Mandate may climb to its summit and return unchanged.',
      era: 'both'
    }
  ],
  realms: [
    { id: 'ironhold', name: 'Ironhold', originalName: '秦 (Qin)', type: 'realm', x: 20, y: 50, description: 'The western kingdom of iron discipline. Adherents of the Iron Creed.', lore: 'Where other realms debate philosophy, Ironhold sharpens swords. The Iron Creed permits no weakness, no mercy, no failure.', era: 'both', color: '#4a4a4a' },
    { id: 'valdros', name: 'Valdros', originalName: '楚 (Chu)', type: 'realm', x: 45, y: 70, description: 'Vast southern kingdom of marshes and warriors. The wild heart of the south.', lore: 'The Valdrosians bow to no northern king. Their shamans speak to river spirits, their warriors paint themselves in ash and ochre.', era: 'heavenfall', color: '#8b0000' },
    { id: 'aldoria', name: 'Aldoria', originalName: '齐 (Qi)', type: 'realm', x: 72, y: 40, description: 'Prosperous eastern realm of commerce and philosophy.', lore: 'Gold flows through Aldoria like water. Its scholars have catalogued the wisdom of ages, its merchants have mapped routes to lands beyond knowing.', era: 'heavenfall', color: '#daa520' },
    { id: 'nordheim', name: 'Nordheim', originalName: '燕 (Yan)', type: 'realm', x: 60, y: 15, description: 'The northernmost realm. Cold and proud.', lore: 'Winter never truly leaves Nordheim. Its people are as hard as the frozen earth, as proud as the wolves that howl beneath their moons.', era: 'heavenfall', color: '#4682b4' },
    { id: 'aurelion', name: 'Aurelion', originalName: '晋 (Jin)', type: 'realm', x: 48, y: 25, description: 'Powerful northern realm. Later fragments into three.', lore: 'Once the mightiest realm after Celestine itself. Lady Lyra Darkweave\'s machinations tore it asunder, birthing Dragonspire, Grandmark, and Narrowdale.', era: 'heavenfall', color: '#ffd700' },
    { id: 'sanctum', name: 'Sanctum', originalName: '鲁 (Lu)', type: 'realm', x: 68, y: 45, description: 'Birthplace of Corwin Sage-of-Sages. Heart of the Covenant of Order.', lore: 'Small in territory, infinite in influence. From Sanctum came the teachings that would shape all civilisation.', era: 'heavenfall', color: '#228b22' }
  ]
};

export const LOCATIONS_BASEBORN: LocationData = {
  capitals: [
    {
      id: 'steelhaven-baseborn',
      name: 'Steelhaven',
      originalName: '咸阳 (Xianyang)',
      type: 'capital',
      x: 25,
      y: 45,
      realm: 'The Crownlands',
      description: 'The Iron Capital. Seat of the Empire. Now the prize of the Crownlands\u2014whoever holds Steelhaven claims the Mandate.',
      lore: 'The throne room still bears the bloodstains from the empire\'s fall. Maren Ashford entered these halls a peasant and left a king.',
      era: 'baseborn'
    },
    {
      id: 'drumhold',
      name: 'Drumhold',
      originalName: '彭城 (Pengcheng)',
      type: 'capital',
      x: 58,
      y: 52,
      realm: 'Cheros',
      description: 'Kharic\'s seat of power. The "Heartbeat of Cheros." Where the Hegemon holds court.',
      lore: 'Named for the great war drums that echo from its towers, Drumhold pulses with Kharic Stormborn\'s fury. Here he divided the realm among his loyalists.',
      era: 'baseborn'
    },
    {
      id: 'valdria',
      name: 'Valdria',
      originalName: '汉中 (Hanzhong)',
      type: 'capital',
      x: 22,
      y: 55,
      realm: 'The Westmarch',
      description: 'Maren\'s territory. Basin lands and irrigation networks. From this exile, an empire was born.',
      lore: 'They gave Maren Ashford the worst land in the realm\u2014mountain-locked, far from power. He turned it into a forge of kings.',
      era: 'baseborn'
    }
  ],
  rivers: [
    {
      id: 'goldenflow-baseborn',
      name: 'The Goldenflow',
      originalName: '黄河 (Yellow River)',
      type: 'river',
      x: 50,
      y: 32,
      description: 'The great northern river. Its floods care nothing for the wars of men.',
      lore: 'Even as Maren and Kharic bled their armies white, the Goldenflow continued its eternal work\u2014giving life, taking life.',
      era: 'baseborn',
      path: [[15, 35], [35, 30], [55, 32], [75, 28], [90, 35]]
    },
    {
      id: 'longwater-baseborn',
      name: 'The Longwater',
      originalName: '长江 (Yangtze)',
      type: 'river',
      x: 50,
      y: 60,
      description: 'The great southern river. Kharic\'s natural barrier against northern incursion.',
      lore: 'Cherosian sailors boast they can read the Longwater\'s currents like scripture. Many northern generals learned too late that this was no idle boast.',
      era: 'baseborn',
      path: [[10, 65], [30, 62], [50, 58], [70, 60], [90, 55]]
    },
    {
      id: 'blackriver',
      name: 'Sorrow\'s Crossing',
      originalName: '乌江 (Wu River)',
      type: 'river',
      x: 62,
      y: 68,
      description: 'The Black River. Where Kharic Stormborn met his end.',
      lore: '"The river runs red tonight," the ferryman said. "It will run red for a thousand years." Kharic\'s blood stained these waters on the last day of the war.',
      era: 'baseborn',
      path: [[55, 72], [62, 68], [68, 65]]
    },
    {
      id: 'sandbag',
      name: 'The Sandbag River',
      originalName: '潍水 (Wei River)',
      type: 'river',
      x: 70,
      y: 42,
      description: 'Where Hank Xander drowned an army with mathematics and sandbags.',
      lore: 'General Barro never saw the flood coming. Hank had calculated the water volume to the cubic foot, the dam\'s breaking point to the hour.',
      era: 'baseborn',
      path: [[65, 48], [70, 42], [78, 38]]
    }
  ],
  battlefields: [
    {
      id: 'gallowsfield',
      name: 'Gallow\'s Field',
      originalName: '垓下 (Gai Xia)',
      type: 'battlefield',
      x: 60,
      y: 58,
      description: 'Site of the final siege. Where the Songs of Midnight broke the Hegemon\'s spirit.',
      lore: 'Four armies surrounded Kharic here. Then Maren\'s soldiers began to sing\u2014Cherosian folk songs, learned for this purpose. Kharic\'s men wept, believing all Cheros had fallen.',
      era: 'baseborn'
    },
    {
      id: 'ashfordsgorge',
      name: 'Ashford\'s Gorge',
      originalName: '荥阳 (Xingyang)',
      type: 'battlefield',
      x: 45,
      y: 48,
      description: 'The location of the prolonged stalemate and the Siege of the Three Thousand.',
      lore: 'For two years, neither Maren nor Kharic could break the deadlock. Three thousand of Maren\'s decoys died here so their lord could escape.',
      era: 'baseborn'
    },
    {
      id: 'hollow',
      name: 'The Hollow',
      originalName: '鸿沟 (Hong Gou)',
      type: 'battlefield',
      x: 48,
      y: 52,
      description: 'The Great Scar. Where the Treaty of the Hollow divided the realm\u2014and was immediately broken.',
      lore: 'Maren signed the treaty with one hand and signalled his generals with the other. "Honour is a luxury," he told Hadrian that night.',
      era: 'baseborn'
    },
    {
      id: 'needleseye',
      name: 'The Needle\'s Eye',
      originalName: '井陉 (Jingxing Pass)',
      type: 'pass',
      x: 52,
      y: 30,
      description: 'Site of Hank Xander\'s "Back-to-Water" gambit.',
      lore: 'Hank placed his army with their backs to the river. "Men who cannot retreat," he explained, "will fight like demons." Lord Brennan learned this lesson fatally.',
      era: 'baseborn'
    }
  ],
  strategicPoints: [
    {
      id: 'timberways',
      name: 'The Timber-Ways',
      originalName: '栈道 (Plank Roads)',
      type: 'strategic',
      x: 18,
      y: 50,
      description: 'The wooden cliff-roads of the Western Pass. Site of Maren\'s feint.',
      lore: 'Maren burned the Timber-Ways publicly, declaring he would never leave his exile. Then he sent Hank through the Ghost Road while Kharic\'s spies watched the smoke.',
      era: 'baseborn'
    },
    {
      id: 'ghostroad',
      name: 'The Ghost Road',
      originalName: '陈仓道 (Chen Cang Route)',
      type: 'strategic',
      x: 20,
      y: 48,
      description: 'The Forgotten Path. Secret mountain route for the flanking manoeuvre that changed history.',
      lore: 'Old shepherds knew this path. Hank paid them in silver and silence. When his army emerged behind the Three Lords, they thought ghosts had risen.',
      era: 'baseborn'
    },
    {
      id: 'dreamwater',
      name: 'The Dreamwater Fens',
      originalName: '云梦泽 (Yunmeng Marshes)',
      type: 'strategic',
      x: 48,
      y: 65,
      description: 'Vast marshlands. Site of Maren\'s "hunting trip" trap for Hank Xander.',
      lore: 'Maren invited Hank to hunt with him in the fens. The greatest general of the age walked into the trap like a trusting child. The marsh mists hid what happened next.',
      era: 'baseborn'
    },
    {
      id: 'throat-baseborn',
      name: 'The Throat',
      originalName: '函谷关 (Hangu Pass)',
      type: 'pass',
      x: 35,
      y: 42,
      description: 'The gate to the Crownlands. Jared Steelbane held this pass\u2014until Hank taught him otherwise.',
      lore: 'Steelbane thought The Throat impregnable. Hank simply went around it, through the Ghost Road. The pass fell without a siege.',
      era: 'baseborn'
    }
  ],
  realms: [
    { id: 'crownlands', name: 'The Crownlands', originalName: '关中 (Guanzhong)', type: 'realm', x: 28, y: 42, description: 'The prize. Fertile plains surrounding Steelhaven. Whoever holds the Crownlands claims the empire.', lore: 'The Crownlands feed armies. Markus Quillen understood this\u2014while Maren conquered, Markus counted granaries.', era: 'baseborn', color: '#4a4a4a' },
    { id: 'cheros', name: 'Cheros (The Hegemony)', originalName: '楚 (Chu)', type: 'realm', x: 55, y: 68, description: 'Kharic Stormborn\'s domain. Red stone valleys and mist-shrouded lakes.', lore: 'Cheros is Valdros in common speech\u2014five centuries of linguistic drift. Kharic\'s banner, the Crimson Storm, flew from every tower.', era: 'baseborn', color: '#8b0000' },
    { id: 'westmarch', name: 'The Westmarch (Valdria)', originalName: '汉 (Han)', type: 'realm', x: 20, y: 58, description: 'Maren Ashford\'s territory. Basin lands, irrigation networks, and the forge of his rebellion.', lore: 'Named for the Han River that waters its valleys. Different from the ancient state of Narrowdale, though outsiders often confuse them.', era: 'baseborn', color: '#2f4f4f' },
    { id: 'easternshore', name: 'The Eastern Shore', originalName: '齐 (Qi)', type: 'realm', x: 75, y: 38, description: 'Formerly Aldoria. Now Lord Aldric\'s domain, the final northern conquest.', lore: 'The old Aldorian pride survives, barely. Lord Aldric submitted to Maren\'s banners, but Goldenhall\'s merchants still remember when they bowed to no one.', era: 'baseborn', color: '#daa520' },
    { id: 'ridgelands', name: 'The Ridgelands', originalName: '赵 (Zhao)', type: 'realm', x: 55, y: 25, description: 'Formerly Dragonspire. Lord Brennan\'s domain until Hank\'s River-at-Back gambit destroyed him.', lore: 'The great cavalry tradition continues, though Brennan\'s defeat ended their dreams of independence.', era: 'baseborn', color: '#4682b4' },
    { id: 'ironmoor', name: 'Ironmoor', originalName: '魏 (Wei)', type: 'realm', x: 45, y: 35, description: 'Formerly Grandmark. Lord Calder\'s domain. First target of Hank\'s northern campaign.', lore: 'Calder thought his fortress impregnable. Hank proved him wrong in a single afternoon.', era: 'baseborn', color: '#696969' }
  ]
};

export const NAMING_PATTERNS = [
  {
    tradition: 'Celestine (Zhou)',
    description: 'Latin roots suggesting heaven, light, cosmic order. Noble names end in \'-ric\' or \'-ard.\'',
    examples: ['Aldric', 'Edric', 'Celestine'],
    color: '#e6d5ac'
  },
  {
    tradition: 'Aldorian (Qi)',
    description: 'Ancient nobility and commerce. Germanic roots with \'-ald,\' \'-oric,\' or \'-ian\' endings.',
    examples: ['Valorian', 'Baldwin', 'Gareth'],
    color: '#daa520'
  },
  {
    tradition: 'Valdrosian/Cherosian (Chu)',
    description: 'Wilderness and martial strength. Heavy consonants, \'-val,\' \'-dric,\' \'-os\' endings.',
    examples: ['Valdric', 'Kharic', 'Quintus'],
    color: '#8b0000'
  },
  {
    tradition: 'Aurelian (Jin)',
    description: 'Gold, dawn, greatness. Latin roots, \'-ion,\' \'-ic,\' \'-ius\' endings.',
    examples: ['Auric', 'Aurelian'],
    color: '#ffd700'
  },
  {
    tradition: 'Ironhold (Qin)',
    description: 'Stark, martial, direct. Anglo-Saxon roots, hard consonants.',
    examples: ['Mordecai', 'Siegfried', 'Steelbane'],
    color: '#4a4a4a'
  },
  {
    tradition: 'Valdrian (Han)',
    description: 'Common origins with rising nobility. Accessible names for merchants or farmers elevated to power.',
    examples: ['Maren', 'Markus', 'Roland'],
    color: '#2f4f4f'
  }
];
