import { AuthUser, IpRecord, ToolStatus, AuditLog } from '../types';

const STORAGE_USERS = 'fakenames_users_db_v2';
const STORAGE_CURRENT_USER = 'fakenames_auth_user_v1';
const STORAGE_IP_RECORDS = 'fakenames_ip_records_v1';
const STORAGE_TOOL_STATUSES = 'fakenames_tool_statuses_v1';
const STORAGE_AUDIT_LOGS = 'fakenames_audit_logs_v1';

// Initial pre-seeded users (Super Admin Prime8088 + Registered Accounts)
const INITIAL_USERS: AuthUser[] = [
  {
    id: 'usr_prime_8088',
    name: 'Prime8088',
    email: 'Prime8088@telegram.org',
    telegramUsername: 'Prime8088',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prime8088',
    createdAt: new Date().toISOString(),
    savedProfilesCount: 0,
    credits: 9999,
    isUnlimited: true,
    role: 'ADMIN',
    registeredIp: '127.0.0.1',
    referralCode: 'PRIME500',
    referralCount: 0,
    totalGeneratedCount: 0,
    totalCopiedCount: 0,
    isBanned: false,
  },
  {
    id: 'usr_admin_001',
    name: 'Admin Master',
    email: 'admin@fakenames.io',
    telegramUsername: 'admin_master',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    avatarType: 'video',
    videoAvatarUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-loop-motion-graphic-41484-large.mp4',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    savedProfilesCount: 42,
    credits: 9999,
    isUnlimited: true,
    role: 'ADMIN',
    registeredIp: '192.168.1.1',
    referralCode: 'ADMIN500',
    referralCount: 18,
    totalGeneratedCount: 380,
    totalCopiedCount: 290,
    isBanned: false,
  },
  {
    id: 'usr_demo_002',
    name: 'Mithu Chandra',
    email: 'mithu@devstudio.com',
    telegramUsername: 'mithu_pro',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    avatarType: 'image',
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    savedProfilesCount: 15,
    credits: 550,
    isUnlimited: false,
    role: 'USER',
    registeredIp: '103.204.2.14',
    referralCode: 'MITHU99',
    referralCount: 1,
    totalGeneratedCount: 120,
    totalCopiedCount: 85,
    isBanned: false,
  },
  {
    id: 'usr_demo_003',
    name: 'Sophia Cyber',
    email: 'sophia@telegram.org',
    telegramUsername: 'sophia_live',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    avatarType: 'video',
    videoAvatarUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-41481-large.mp4',
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    savedProfilesCount: 8,
    credits: 50,
    isUnlimited: false,
    role: 'USER',
    registeredIp: '185.220.101.5',
    referralCode: 'SOPHIA7',
    referralCount: 0,
    totalGeneratedCount: 45,
    totalCopiedCount: 30,
    isBanned: false,
  }
];

const INITIAL_TOOL_STATUSES: ToolStatus[] = [
  {
    id: 'check-live-uid',
    name: 'Check live UID Fb',
    isMaintenance: false,
    successRate: 99.4,
    avgLatency: 110,
    totalCalls: 1420,
    failedCalls: 8,
    lastStatus: 'Healthy',
    category: 'facebook'
  },
  {
    id: 'check-live-uid-ig',
    name: 'Check live UID IG',
    isMaintenance: false,
    successRate: 98.7,
    avgLatency: 145,
    totalCalls: 1180,
    failedCalls: 15,
    lastStatus: 'Healthy',
    category: 'instagram'
  },
  {
    id: 'get-uid-fb',
    name: 'Get UID From Fb name',
    isMaintenance: false,
    successRate: 96.8,
    avgLatency: 210,
    totalCalls: 980,
    failedCalls: 31,
    lastStatus: 'Healthy',
    category: 'facebook'
  },
  {
    id: '2fa-authenticator',
    name: '2FA.Live Authenticator',
    isMaintenance: false,
    successRate: 99.9,
    avgLatency: 45,
    totalCalls: 2100,
    failedCalls: 2,
    lastStatus: 'Healthy',
    category: 'security'
  },
  {
    id: 'check-ip',
    name: 'Check IP Detector',
    isMaintenance: false,
    successRate: 99.8,
    avgLatency: 65,
    totalCalls: 1650,
    failedCalls: 3,
    lastStatus: 'Healthy',
    category: 'ip'
  }
];

// Helper to load users database
export function getAllUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load users', e);
  }
  // Initialize with seed users if none exists
  saveAllUsers(INITIAL_USERS);
  return INITIAL_USERS;
}

// Save users list
export function saveAllUsers(users: AuthUser[]) {
  try {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

// Get single user by ID
export function getUserById(userId: string): AuthUser | null {
  const users = getAllUsers();
  return users.find((u) => u.id === userId) || null;
}

// Save or Update single user
export function saveUser(user: AuthUser) {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.unshift(user);
  }
  saveAllUsers(users);
}

// Get tool maintenance statuses
export function getToolStatuses(): ToolStatus[] {
  try {
    const raw = localStorage.getItem(STORAGE_TOOL_STATUSES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(STORAGE_TOOL_STATUSES, JSON.stringify(INITIAL_TOOL_STATUSES));
  return INITIAL_TOOL_STATUSES;
}

export function saveToolStatuses(statuses: ToolStatus[]) {
  try {
    localStorage.setItem(STORAGE_TOOL_STATUSES, JSON.stringify(statuses));
  } catch (e) {
    console.error(e);
  }
}

export function toggleToolMaintenance(toolId: string): ToolStatus[] {
  const statuses = getToolStatuses();
  const updated = statuses.map((t) =>
    t.id === toolId ? { ...t, isMaintenance: !t.isMaintenance } : t
  );
  saveToolStatuses(updated);
  return updated;
}

// Referral processing: Award referrer +500 credits
export function processReferral(referralCode: string, newUserId: string): boolean {
  if (!referralCode) return false;
  const users = getAllUsers();
  const referrer = users.find(
    (u) => u.referralCode.toUpperCase() === referralCode.toUpperCase()
  );

  if (referrer && referrer.id !== newUserId) {
    referrer.credits += 500;
    referrer.referralCount += 1;
    saveUser(referrer);
    logAuditAction('REFERRAL_BONUS', 'System', referrer.email, `Awarded +500 referral credits to ${referrer.name} for inviting user ${newUserId}`);
    return true;
  }
  return false;
}

// Helper to add credits to user balance
export function addCreditsToUser(userId: string, amount: number): AuthUser | null {
  const user = getUserById(userId);
  if (!user) return null;
  user.credits = (user.credits || 0) + amount;
  saveUser(user);
  logAuditAction('CREDITS_ADDED', 'CPA Task / Referral', user.email, `Added +${amount} credits to ${user.name}`);
  return user;
}

// Credit deduction logic
export function deductUserCredit(userId: string, amount: number = 1): { success: boolean; remainingCredits: number; isUnlimited: boolean } {
  const user = getUserById(userId);
  if (!user) return { success: false, remainingCredits: 0, isUnlimited: false };

  if (user.isUnlimited) {
    return { success: true, remainingCredits: user.credits, isUnlimited: true };
  }

  if (user.credits < amount) {
    return { success: false, remainingCredits: user.credits, isUnlimited: false };
  }

  user.credits -= amount;
  saveUser(user);
  return { success: true, remainingCredits: user.credits, isUnlimited: false };
}

// Generate unique referral code
export function generateReferralCode(usernameOrName: string): string {
  const clean = usernameOrName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'REF';
  const randomStr = Math.floor(100 + Math.random() * 900);
  return `${clean}${randomStr}`;
}

// Audit logging
export function getAuditLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_AUDIT_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function logAuditAction(action: string, performedBy: string, targetUser: string | undefined, details: string) {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
    timestamp: new Date().toISOString(),
    action,
    performedBy,
    targetUser,
    details,
  };
  logs.unshift(newLog);
  try {
    localStorage.setItem(STORAGE_AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    console.error(e);
  }
}
