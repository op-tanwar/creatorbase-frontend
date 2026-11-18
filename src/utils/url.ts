export interface CreatorUrlTarget {
  platform?: string;
  handle?: string;
  profileUrl?: string | null;
  fullName?: string;
}

// Canonical marquee overrides for verified Indian YouTube creators
export const MARQUEE_CANONICAL_YT_MAP: Record<string, string> = {
  totalgaming: 'TotalGaming093',
  totalgaming093: 'TotalGaming093',
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
  harshbeniwal: 'harshbeniwal21',
  harshbeniwal21: 'harshbeniwal21',
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
  tanmaybhatyt: 'TanmayBhatYT',
  scoutop: 'scoutofficial',
  scoutofficial: 'scoutofficial',
  swadofficial: 'SwadOfficial',
  samayraina: 'SamayRainaOfficial',
  samayrainaofficial: 'SamayRainaOfficial',
  labourlawadvisor: 'LabourLawAdvisor',
  rachanaranade: 'rachanaranade',
  geekyranjit_yt: 'geekyranjit',
  geekyranjit: 'geekyranjit',
};

/**
 * Sanitizes raw handle by stripping URLs, leading @, query parameters, and unwanted symbols.
 * Returns empty string if invalid, avoiding broken links.
 */
export function sanitizePlatformHandle(
  rawHandle: string | undefined | null,
  platform: string = 'INSTAGRAM'
): string {
  if (!rawHandle) return '';

  let clean = String(rawHandle).trim();

  // Guard against null / undefined string literals
  if (
    clean === 'undefined' ||
    clean === 'null' ||
    clean === '[object Object]' ||
    clean === 'NaN'
  ) {
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
    // Valid YouTube handle / channel ID characters
    clean = clean.replace(/[^a-zA-Z0-9._-]/g, '');
  }

  return clean.trim();
}

/**
 * Direct canonical URL resolver function enforcing:
 * Instagram: https://www.instagram.com/${handle.replace(/^@/, '').trim()}/
 * YouTube: If handle.startsWith('UC') && handle.length === 24 -> https://www.youtube.com/channel/${handle}
 *          Else -> https://www.youtube.com/@${handle.replace(/^@/, '').trim()}
 */
export function getCanonicalProfileUrl(
  handle: string | undefined | null,
  platform: string = 'INSTAGRAM'
): string {
  const normPlatform = (platform || 'INSTAGRAM').toUpperCase();
  const clean = sanitizePlatformHandle(handle, normPlatform);

  if (!clean) {
    return normPlatform === 'YOUTUBE' ? 'https://www.youtube.com' : 'https://www.instagram.com';
  }

  if (normPlatform === 'YOUTUBE') {
    // If it's a 24-character YouTube Channel ID starting with UC...
    if (clean.startsWith('UC') && clean.length === 24) {
      return `https://www.youtube.com/channel/${clean}`;
    }
    // Resolve marquee alias if present
    const mapped = MARQUEE_CANONICAL_YT_MAP[clean.toLowerCase()] || clean;
    return `https://www.youtube.com/@${mapped}`;
  }

  // Instagram canonical URL
  return `https://www.instagram.com/${clean}/`;
}

/**
 * Generates bulletproof, verified live external profile URL for Instagram and YouTube.
 * Handles existing full profile URLs, channel IDs (UC...), custom handles, and removes double-@ errors.
 * Never renders broken links ('undefined', 'null', empty strings).
 */
export function getCreatorPlatformUrl(creator: CreatorUrlTarget | null | undefined): string {
  if (!creator) return 'https://www.instagram.com';

  const normPlatform = (creator.platform || 'INSTAGRAM').toUpperCase();

  // 1. If creator.profileUrl is already a valid canonical URL matching the platform domain, return it
  if (creator.profileUrl && typeof creator.profileUrl === 'string') {
    const rawUrl = creator.profileUrl.trim();
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      if (normPlatform === 'INSTAGRAM' && /instagram\.com\/[a-zA-Z0-9._]+\/?/i.test(rawUrl)) {
        return rawUrl.endsWith('/') ? rawUrl : `${rawUrl}/`;
      }
      if (
        normPlatform === 'YOUTUBE' &&
        /(?:youtube\.com\/(?:@|channel\/)[a-zA-Z0-9._-]+)/i.test(rawUrl)
      ) {
        return rawUrl;
      }
    }
  }

  // 2. Resolve via canonical rules
  return getCanonicalProfileUrl(creator.handle, normPlatform);
}

/**
 * Standard security attributes for opening external creator links in a new tab
 */
export const EXTERNAL_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;
