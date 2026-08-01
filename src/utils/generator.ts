import { UserProfile, FilterOptions, UserTagConfig, CountryOrigin } from '../types';
import { ORIGIN_NAMES, EMAIL_PROVIDERS, OCCUPATIONS, BIOS, STREET_NAMES } from '../data/namesData';

// Generate a random integer between min and max inclusive
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Select random element from array
export function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate secure random password
export function generatePassword(length: number = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

// Format month index to 3-letter month name
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Generate Date of Birth based on age range
export function generateDOB(minAge: number = 18, maxAge: number = 40) {
  const currentYear = new Date().getFullYear();
  const age = getRandomInt(minAge, maxAge);
  const birthYear = currentYear - age;
  const monthNum = getRandomInt(1, 12);
  const month = MONTH_NAMES[monthNum - 1];
  
  // Handle days in month
  let maxDays = 31;
  if ([4, 6, 9, 11].includes(monthNum)) maxDays = 30;
  if (monthNum === 2) maxDays = 28;
  const day = getRandomInt(1, maxDays);

  const formatted = `${day < 10 ? '0' + day : day} ${month} ${birthYear}`;
  return { formatted, day, month, monthNum, year: birthYear, age };
}

// Generate phone number
export function generatePhone(origin: CountryOrigin): string {
  if (origin === 'in') {
    const start = getRandomElement(['9', '8', '7', '6']);
    const rest = Array.from({ length: 9 }, () => getRandomInt(0, 9)).join('');
    return `+91 ${start}${rest.slice(0, 4)} ${rest.slice(4)}`;
  } else if (origin === 'uk') {
    const rest = Array.from({ length: 9 }, () => getRandomInt(0, 9)).join('');
    return `+44 7${rest.slice(0, 3)} ${rest.slice(3, 6)}${rest.slice(6)}`;
  } else if (origin === 'de') {
    const rest = Array.from({ length: 9 }, () => getRandomInt(0, 9)).join('');
    return `+49 151 ${rest.slice(0, 4)}${rest.slice(4)}`;
  } else if (origin === 'fr') {
    const rest = Array.from({ length: 8 }, () => getRandomInt(0, 9)).join('');
    return `+33 6 ${rest.slice(0, 2)} ${rest.slice(2, 4)} ${rest.slice(4, 6)} ${rest.slice(6)}`;
  } else {
    // US / CA / Global
    const area = getRandomInt(201, 989);
    const mid = getRandomInt(100, 999);
    const last = getRandomInt(1000, 9999);
    return `+1 (${area}) ${mid}-${last}`;
  }
}

// Country flag and full name lookup helper
export function getCountryFlagAndName(originKey: CountryOrigin): { flag: string; name: string } {
  switch (originKey) {
    case 'us': return { flag: '🇺🇸', name: 'United States' };
    case 'uk': return { flag: '🇬🇧', name: 'United Kingdom' };
    case 'ca': return { flag: '🇨🇦', name: 'Canada' };
    case 'in': return { flag: '🇮🇳', name: 'India' };
    case 'de': return { flag: '🇩🇪', name: 'Germany' };
    case 'fr': return { flag: '🇫🇷', name: 'France' };
    default: return { flag: '🌍', name: 'Global' };
  }
}

// Format editable user tag e.g. "Prime@31" or "Prime@01"
export function formatUserTag(config: UserTagConfig): string {
  let dayVal: number;
  if (config.manualDateOverride !== null && config.manualDateOverride >= 1 && config.manualDateOverride <= 31) {
    dayVal = config.manualDateOverride;
  } else {
    dayVal = new Date().getDate(); // Realtime date of month (1-31)
  }

  const dateStr = config.useZeroPadding ? (dayVal < 10 ? `0${dayVal}` : `${dayVal}`) : `${dayVal}`;
  const prefix = config.prefix || 'Prime@';
  return `${prefix}${dateStr}`;
}

// Main unique profile generator
export function generateUniqueProfile(
  filters: FilterOptions,
  existingUsedFullNames: Set<string>
): UserProfile {
  let originKey = filters.origin;
  
  if (originKey === 'global') {
    const origins: CountryOrigin[] = ['us', 'uk', 'ca', 'in', 'de', 'fr'];
    originKey = getRandomElement(origins);
  }

  const originData = ORIGIN_NAMES[originKey] || ORIGIN_NAMES['us'];

  // Determine gender
  let genderVal: 'Male' | 'Female';
  if (filters.gender === 'male') {
    genderVal = 'Male';
  } else if (filters.gender === 'female') {
    genderVal = 'Female';
  } else {
    genderVal = Math.random() > 0.5 ? 'Male' : 'Female';
  }

  const firstNamePool = genderVal === 'Male' ? originData.maleFirstNames : originData.femaleFirstNames;
  const lastNamePool = originData.lastNames;

  let selectedFirst = '';
  let selectedLast = '';
  let fullCandidate = '';
  let attempt = 0;
  const maxAttempts = 200;

  // Non-repeating search loop
  while (attempt < maxAttempts) {
    attempt++;
    const fName = getRandomElement(firstNamePool);
    const lName = getRandomElement(lastNamePool);
    const candidate = `${fName} ${lName}`;

    if (!existingUsedFullNames.has(candidate.toLowerCase())) {
      selectedFirst = fName;
      selectedLast = lName;
      fullCandidate = candidate;
      break;
    }
  }

  // Fallback if pool exhausted: append unique suffix to avoid duplication
  if (!selectedFirst) {
    selectedFirst = getRandomElement(firstNamePool);
    selectedLast = getRandomElement(lastNamePool);
    const suffixNum = getRandomInt(10, 999);
    selectedLast = `${selectedLast}`;
    fullCandidate = `${selectedFirst} ${selectedLast} ${suffixNum}`;
  }

  // Record into used set
  existingUsedFullNames.add(fullCandidate.toLowerCase());

  // Generate Email
  const cleanFirst = selectedFirst.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLast = selectedLast.toLowerCase().replace(/[^a-z0-9]/g, '');
  const emailNum = getRandomInt(10, 9999);
  const provider = filters.customDomain ? filters.customDomain : getRandomElement(EMAIL_PROVIDERS);
  const email = `${cleanFirst}.${cleanLast}${emailNum}@${provider}`;

  // DOB
  const dob = generateDOB(filters.minAge, filters.maxAge);

  // Social handles for FB & IG
  const handleSuffix = getRandomElement([`${dob.year.toString().slice(-2)}`, `${emailNum}`, '_official', '_real', 'x']);
  const igHandle = `${cleanFirst}_${cleanLast}_${handleSuffix}`;
  const fbHandle = `fb.com/${cleanFirst}.${cleanLast}.${handleSuffix}`;

  // Password
  const password = generatePassword(12);

  // Address
  const streetNum = getRandomInt(100, 9999);
  const streetName = getRandomElement(STREET_NAMES);
  const streetType = getRandomElement(originData.streetTypes);
  const city = getRandomElement(originData.cities);
  const state = getRandomElement(originData.states);
  const zip = getRandomInt(10000, 99999).toString();
  const countryName = originKey === 'us' ? 'United States' :
                      originKey === 'uk' ? 'United Kingdom' :
                      originKey === 'ca' ? 'Canada' :
                      originKey === 'in' ? 'India' :
                      originKey === 'de' ? 'Germany' : 'France';

  const address = {
    street: `${streetNum} ${streetName} ${streetType}`,
    city,
    state,
    zip,
    country: countryName
  };

  return {
    id: `usr_${Date.now()}_${getRandomInt(1000, 9999)}`,
    firstName: selectedFirst,
    lastName: selectedLast,
    fullName: `${selectedFirst} ${selectedLast}`,
    gender: genderVal,
    email,
    emailProvider: provider,
    password,
    dob,
    username: {
      instagram: `@${igHandle}`,
      facebook: fbHandle
    },
    phone: generatePhone(originKey),
    address,
    bio: getRandomElement(BIOS),
    occupation: getRandomElement(OCCUPATIONS),
    generatedAt: new Date().toISOString(),
    origin: originKey,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedFirst + '_' + selectedLast)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
  };
}

// One click Copy All Profile Details structured text for FB/IG registration
export function formatFullProfileText(profile: UserProfile): string {
  return `=== FAKE NAME & PROFILE DETAILS ===
First Name  : ${profile.firstName}
Last Name   : ${profile.lastName}
Full Name   : ${profile.fullName}
Gender      : ${profile.gender}
DOB         : ${profile.dob.formatted} (Age ${profile.dob.age})

--- CONTACT & ACCOUNT ---
Email       : ${profile.email}
Password    : ${profile.password}
Phone       : ${profile.phone}

--- SOCIAL HANDLES ---
Instagram   : ${profile.username.instagram}
Facebook    : ${profile.username.facebook}

--- ADDRESS ---
Street      : ${profile.address.street}
City/State  : ${profile.address.city}, ${profile.address.state} ${profile.address.zip}
Country     : ${profile.address.country}

--- OTHER ---
Occupation  : ${profile.occupation}
Bio         : ${profile.bio}
===================================`;
}

// Clipboard helper with fallback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

// Download history to CSV
export function downloadCSV(profiles: UserProfile[]) {
  if (profiles.length === 0) return;

  const headers = [
    'First Name',
    'Last Name',
    'Full Name',
    'Gender',
    'DOB',
    'Age',
    'Email',
    'Password',
    'Phone',
    'Instagram',
    'Facebook',
    'Street',
    'City',
    'Country'
  ];

  const rows = profiles.map(p => [
    `"${p.firstName}"`,
    `"${p.lastName}"`,
    `"${p.fullName}"`,
    `"${p.gender}"`,
    `"${p.dob.formatted}"`,
    p.dob.age,
    `"${p.email}"`,
    `"${p.password}"`,
    `"${p.phone}"`,
    `"${p.username.instagram}"`,
    `"${p.username.facebook}"`,
    `"${p.address.street}"`,
    `"${p.address.city}"`,
    `"${p.address.country}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `fake_names_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
