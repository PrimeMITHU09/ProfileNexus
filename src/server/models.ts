import mongoose, { Schema, Document } from 'mongoose';

// 1. User Interface & Schema
export interface IUser extends Document {
  telegramId?: string;
  username: string;
  email?: string;
  passwordHash?: string;
  avatarUrl?: string;
  avatarType?: 'image' | 'video';
  videoAvatarUrl?: string;
  registrationIp: string;
  creditBalance: number;
  isUnlimited: boolean;
  totalGenerated: number;
  totalCopied: number;
  role: 'USER' | 'ADMIN';
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  isBanned: boolean;
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    telegramId: { type: String, sparse: true, index: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, sparse: true },
    passwordHash: { type: String },
    avatarUrl: { type: String, default: '' },
    avatarType: { type: String, enum: ['image', 'video'], default: 'image' },
    videoAvatarUrl: { type: String, default: '' },
    registrationIp: { type: String, required: true, index: true },
    creditBalance: { type: Number, default: 50 },
    isUnlimited: { type: Boolean, default: false },
    totalGenerated: { type: Number, default: 0 },
    totalCopied: { type: Number, default: 0 },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    referralCode: { type: String, required: true, unique: true },
    referredBy: { type: String },
    referralCount: { type: Number, default: 0 },
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 2. ToolLog Interface & Schema
export interface IToolLog extends Document {
  toolType: string;
  userId?: string;
  userIp: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  latencyMs?: number;
  timestamp: Date;
}

const ToolLogSchema: Schema = new Schema(
  {
    toolType: { type: String, required: true, index: true },
    userId: { type: String, index: true },
    userIp: { type: String, required: true },
    status: { type: String, enum: ['SUCCESS', 'FAILED', 'BLOCKED'], default: 'SUCCESS' },
    latencyMs: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

// 3. AppSettings Interface & Schema
export interface IAppSettings extends Document {
  adsEnabled: boolean;
  adsScriptCode: string;
  toolMaintenanceState: Map<string, boolean>;
  blacklistedIps: string[];
}

const AppSettingsSchema: Schema = new Schema(
  {
    adsEnabled: { type: Boolean, default: true },
    adsScriptCode: { type: String, default: '' },
    toolMaintenanceState: { type: Map, of: Boolean, default: {} },
    blacklistedIps: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const ToolLogModel = mongoose.models.ToolLog || mongoose.model<IToolLog>('ToolLog', ToolLogSchema);
export const AppSettingsModel = mongoose.models.AppSettings || mongoose.model<IAppSettings>('AppSettings', AppSettingsSchema);
