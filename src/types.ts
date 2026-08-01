export type FrameworkLayout = 'modern-saas' | 'bold-industrial' | 'split-studio';

export type Gender = 'male' | 'female' | 'any';

export type CountryOrigin = 'us' | 'uk' | 'ca' | 'in' | 'de' | 'fr' | 'global';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'Male' | 'Female';
  email: string;
  emailProvider: string;
  password: string;
  dob: {
    formatted: string; // e.g. "15 Aug 1998"
    day: number;
    month: string;
    monthNum: number;
    year: number;
    age: number;
  };
  username: {
    instagram: string;
    facebook: string;
  };
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  bio: string;
  occupation: string;
  generatedAt: string; // ISO string
  origin: CountryOrigin;
  avatarUrl: string;
}

export interface UserTagConfig {
  prefix: string; // e.g., "Prime@"
  useZeroPadding: boolean; // true -> "01", false -> "1"
  manualDateOverride: number | null; // null for auto real-time date
  autoRefreshDaily: boolean;
}

export interface FilterOptions {
  gender: Gender;
  origin: CountryOrigin;
  minAge: number;
  maxAge: number;
  customDomain: string;
}

export type AvatarStyle = 'avataaars' | 'bottts' | 'personas' | 'lorelei' | 'micah' | 'shapes';

export interface GeneratorSettings {
  passwordLength: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  avatarStyle: AvatarStyle;
  autoCopyOnGenerate: boolean;
  defaultGender: Gender;
  defaultOrigin: CountryOrigin;
}

export interface PlatformStat {
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn' | 'X (Twitter)';
  generated: number;
  copied: number;
  color: string;
}

export type UserRole = 'USER' | 'ADMIN';

export interface AuthUser {
  id: string;
  systemUid?: string;
  name: string;
  email: string;
  password?: string;
  hasPassword?: boolean;
  telegramUsername?: string;
  avatarUrl: string;
  avatarType?: 'image' | 'video'; // supports live video profile (MP4/WebM profile stream)
  videoAvatarUrl?: string;
  createdAt: string;
  savedProfilesCount: number;
  credits: number;
  isUnlimited?: boolean;
  role: UserRole;
  registeredIp: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  totalGeneratedCount?: number;
  totalCopiedCount?: number;
  isBanned?: boolean;
}

export interface IpRecord {
  ip: string;
  userCount: number;
  registeredUserIds: string[];
  isBlacklisted: boolean;
  lastAttemptAt: string;
  location?: string;
}

export interface ToolStatus {
  id: string;
  name: string;
  isMaintenance: boolean;
  successRate: number; // e.g. 99.2%
  avgLatency: number; // e.g. 145ms
  totalCalls: number;
  failedCalls: number;
  lastStatus: 'Healthy' | 'Degraded' | 'Down';
  category: 'facebook' | 'instagram' | 'security' | 'ip';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  targetUser?: string;
  details: string;
}


