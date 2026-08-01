import { IpRecord } from '../types';
import { getAllUsers } from './userStore';

const STORAGE_IP_RECORDS = 'fakenames_ip_records_v1';

// Initial IP records cache
const INITIAL_IP_RECORDS: IpRecord[] = [
  {
    ip: '192.168.1.1',
    userCount: 1,
    registeredUserIds: ['usr_admin_001'],
    isBlacklisted: false,
    lastAttemptAt: new Date().toISOString(),
    location: 'Dhaka, Bangladesh',
  },
  {
    ip: '103.204.2.14',
    userCount: 1,
    registeredUserIds: ['usr_demo_002'],
    isBlacklisted: false,
    lastAttemptAt: new Date(Date.now() - 3600000).toISOString(),
    location: 'Chittagong, Bangladesh',
  },
  {
    ip: '185.220.101.5',
    userCount: 1,
    registeredUserIds: ['usr_demo_003'],
    isBlacklisted: false,
    lastAttemptAt: new Date(Date.now() - 7200000).toISOString(),
    location: 'Frankfurt, Germany',
  },
  {
    ip: '45.142.120.99',
    userCount: 3,
    registeredUserIds: ['usr_spam_01', 'usr_spam_02', 'usr_spam_03'],
    isBlacklisted: true,
    lastAttemptAt: new Date(Date.now() - 86400000).toISOString(),
    location: 'Abuse/Tor Exit Node',
  }
];

export function getIpRecords(): IpRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_IP_RECORDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(STORAGE_IP_RECORDS, JSON.stringify(INITIAL_IP_RECORDS));
  return INITIAL_IP_RECORDS;
}

export function saveIpRecords(records: IpRecord[]) {
  try {
    localStorage.setItem(STORAGE_IP_RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error(e);
  }
}

// Simulated real client IP fetch with fallback to dynamic IP
let cachedClientIp: string | null = null;

export async function fetchClientIp(): Promise<string> {
  if (cachedClientIp) return cachedClientIp;
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    if (data.ip) {
      cachedClientIp = data.ip;
      return data.ip;
    }
  } catch (e) {
    console.log('IP fetch timeout or error, using local fallback');
  }
  // Fallback IP for development environment
  cachedClientIp = '103.204.2.' + Math.floor(10 + Math.random() * 200);
  return cachedClientIp;
}

// Anti-abuse check: Returns true if allowed, false if blocked due to IP duplication or blacklist
export function checkIpRegistrationAllowed(ip: string): { allowed: boolean; reason?: string } {
  const records = getIpRecords();
  const existingRecord = records.find((r) => r.ip === ip);

  if (existingRecord) {
    if (existingRecord.isBlacklisted) {
      return {
        allowed: false,
        reason: 'This IP address has been blacklisted by Admin for abuse.',
      };
    }

    if (existingRecord.userCount >= 1) {
      return {
        allowed: false,
        reason: 'Multiple free accounts from the same IP are restricted. Upgrade or contact Admin.',
      };
    }
  }

  // Also check existing users database directly by registeredIp
  const users = getAllUsers();
  const usersWithSameIp = users.filter((u) => u.registeredIp === ip);
  if (usersWithSameIp.length >= 1) {
    return {
      allowed: false,
      reason: 'Multiple free accounts from the same IP are restricted.',
    };
  }

  return { allowed: true };
}

// Record new IP registration
export function recordIpRegistration(ip: string, userId: string, location?: string) {
  const records = getIpRecords();
  const idx = records.findIndex((r) => r.ip === ip);

  if (idx >= 0) {
    records[idx].userCount += 1;
    if (!records[idx].registeredUserIds.includes(userId)) {
      records[idx].registeredUserIds.push(userId);
    }
    records[idx].lastAttemptAt = new Date().toISOString();
  } else {
    records.unshift({
      ip,
      userCount: 1,
      registeredUserIds: [userId],
      isBlacklisted: false,
      lastAttemptAt: new Date().toISOString(),
      location: location || 'Detected User IP',
    });
  }

  saveIpRecords(records);
}

// Toggle Blacklist status for an IP
export function toggleIpBlacklist(ip: string): IpRecord[] {
  const records = getIpRecords();
  const idx = records.findIndex((r) => r.ip === ip);

  if (idx >= 0) {
    records[idx].isBlacklisted = !records[idx].isBlacklisted;
  } else {
    records.unshift({
      ip,
      userCount: 0,
      registeredUserIds: [],
      isBlacklisted: true,
      lastAttemptAt: new Date().toISOString(),
      location: 'Manually Blacklisted IP',
    });
  }

  saveIpRecords(records);
  return records;
}
