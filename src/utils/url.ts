export interface CreatorUrlTarget {
  platform?: string;
  handle?: string;
  profileUrl?: string | null;
  fullName?: string;
}

// Canonical marquee overrides for verified Indian creators
const MARQUEE_CANONICAL_YT_MAP: Record<string, string> = {
  totalgaming: 'totalgaming',
  totalgaming093: 'totalgaming',
  technogamerz: 'technogamerz',
  carryminati: 'CarryMinati',
  carryislive: 'CarryisLive',
  round2hell: 'Round2hell',
  ashishchanchlani: 'ashishchanchlanivines',
  ashishchanchlanivines: 'ashishchanchlanivines',
  souravjoshivlogs: 'souravjvlogs',
  souravjvlogs: 'souravjvlogs',
  bbkiwines: 'BBKiVines',
  bbkivines: 'BBKiVines',
  technicalguruji_yt: 'TechnicalGuruji',
  technicalguruji: 'TechnicalGuruji',
  triggeredinsaan: 'triggeredinsaan',
  harshbeniwal: 'harshbeniwal',
  mythpat: 'mythpat',
  trakintech: 'trakintech',
  kabitaskitchen: 'kabitaskitchen',
  bharatzkitchen: 'bharatzkitchenHINDI',
  bharatzkitchenhindi: 'bharatzkitchenHINDI',
  physicswallah_yt: 'PhysicsWallah',
  physicswallah: 'PhysicsWallah',
  techburner_yt: 'TechBurner',
  techburner: 'TechBurner',
  fukrainsaan: 'fukrainsaan',
  dynamogaming: 'dynamogaming',
  flyingbeast: 'FlyingBeast320',
  flyingbeast320: 'FlyingBeast320',
  slayypoint: 'SlayyPointOfficial',
  slayypointofficial: 'SlayyPointOfficial',
  zakirkhan_yt: 'ZakirKhan',
  zakirkhan: 'ZakirKhan',
  sanjeevkapoorkhazana: 'sanjeevkapoorkhazana',
  fittuber_yt: 'FitTuber',
  fittuber: 'FitTuber',
  ranveerbrar_yt: 'RanveerBrar',
  ranveerbrar: 'RanveerBrar',
  mortal_gaming: 'MortaLyt',
  mortalyt: 'MortaLyt',
  foodieincarnate_yt: 'foodieincarnate',
  foodieincarnate: 'foodieincarnate',
  jonathangaming: 'JONATHANGAMINGYT',
  jonathangamingyt: 'JONATHANGAMINGYT',
  pranjalkamra: 'pranjalkamra',
  codewithharry: 'CodeWithHarry',
  bassi_standup: 'anubhavsinghbassi',
  yourfoodlab: 'yourfoodlab',
  rohitkhatrifitness_yt: 'RohitKhatriFitness',
  rohitkhatrifitness: 'RohitKhatriFitness',
  techbar: 'TechBar',
  tanmaybhat: 'TanmayBhatYT',
  scoutop: 'scoutop',
  swadofficial: 'SwadOfficial',
  samayraina: 'SamayRainaOfficial',
  labourlawadvisor: 'LabourLawAdvisor',
  rachanaranade: 'rachanaranade',
  geekyranjit_yt: 'geekyranjit',
  geekyranjit: 'geekyranjit',
};

/**
 * Sanitizes raw handle by stripping URLs, leading @, query parameters, and unwanted symbols.
 */
export function sanitizePlatformHandle(
  rawHandle: string | undefined | null,
  platform: string = 'INSTAGRAM'
): string {
  if (!rawHandle) return '';

  let clean = String(rawHandle).trim();

  // Guard against null / undefined string literals
  if (clean === 'undefined' || clean === 'null' || clean === '[object Object]') {
    return '';
  }

  // Strip full URL prefixes if stored inside handle
  clean = clean.replace(/^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|youtube\.com)\/?/i, '');
  clean = clean.replace(/^(?:channel\/|c\/|user\/)/i, '');

  // Strip query parameters (?igsh=..., ?utm_source=..., etc.)
  clean = clean.replace(/\?.*$/, '');

  // Strip trailing slashes and hash
  clean = clean.replace(/#.*$/, '');
  clean = clean.replace(/\/+$/, '');

  // Strip leading @ symbols
  clean = clean.replace(/^@+/, '');

  // Strip URL encoded spaces or internal whitespace
  clean = clean.replace(/%20/g, '');
  clean = clean.replace(/[\s\t\r\n]+/g, '');

  const normPlatform = (platform || '').toUpperCase();

  if (normPlatform === 'INSTAGRAM') {
    // Only valid Instagram username characters: letters, digits, periods, underscores
    clean = clean.replace(/[^a-zA-Z0-9._]/g, '');
  } else if (normPlatform === 'YOUTUBE') {
    // Valid YouTube handle / ID characters
    clean = clean.replace(/[^a-zA-Z0-9._-]/g, '');
  }

  return clean.trim();
}

/**
 * Generates bulletproof, verified live external profile URL for Instagram and YouTube.
 * Handles existing full profile URLs, channel IDs (UC...), custom handles, and removes double-@ errors.
 */
export function getCreatorPlatformUrl(creator: CreatorUrlTarget | null | undefined): string {
  if (!creator) return 'https://www.instagram.com/';

  const normPlatform = (creator.platform || 'INSTAGRAM').toUpperCase();

  // 1. If creator.profileUrl is already a valid full URL matching the platform domain, return it
  if (creator.profileUrl && typeof creator.profileUrl === 'string') {
    const rawUrl = creator.profileUrl.trim();
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      if (normPlatform === 'INSTAGRAM' && /instagram\.com/i.test(rawUrl)) {
        return rawUrl;
      }
      if (normPlatform === 'YOUTUBE' && /(?:youtube\.com|youtu\.be)/i.test(rawUrl)) {
        return rawUrl;
      }
    }
  }

  // 2. Clean the handle
  const cleanHandle = sanitizePlatformHandle(creator.handle, normPlatform);

  if (!cleanHandle || cleanHandle === 'undefined' || cleanHandle === 'null') {
    return normPlatform === 'YOUTUBE' ? 'https://www.youtube.com' : 'https://www.instagram.com';
  }

  // 3. Platform specific formatting
  if (normPlatform === 'YOUTUBE') {
    // Resolve marquee alias
    const lower = cleanHandle.toLowerCase();
    const verifiedCanonical = MARQUEE_CANONICAL_YT_MAP[lower] || cleanHandle;

    // If it's a 24-character YouTube Channel ID starting with UC...
    if (verifiedCanonical.startsWith('UC') && verifiedCanonical.length === 24) {
      return `https://www.youtube.com/channel/${verifiedCanonical}`;
    }
    // Standard YouTube channel @handle
    return `https://www.youtube.com/@${verifiedCanonical}`;
  }

  // Default to Instagram
  return `https://www.instagram.com/${cleanHandle}/`;
}

/**
 * Standard security attributes for opening external creator links in a new tab
 */
export const EXTERNAL_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;
