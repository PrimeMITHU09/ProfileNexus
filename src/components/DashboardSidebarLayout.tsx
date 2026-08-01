import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  UserProfile,
  UserTagConfig,
  FilterOptions,
  FrameworkLayout,
  AuthUser,
  GeneratorSettings,
  ToolStatus
} from '../types';
import { formatUserTag } from '../utils/generator';
import { getToolStatuses, addCreditsToUser } from '../utils/userStore';
import { LivePlatformChart, PlatformStatData } from './LivePlatformChart';
import { LiveToolChart, ToolUsageData } from './LiveToolChart';
import { TopUsersLeaderboard } from './TopUsersLeaderboard';
import { UserAvatar } from './UserAvatar';
import { GeneratorControls } from './GeneratorControls';
import { NameCard } from './NameCard';
import { ProfileDetailsCard } from './ProfileDetailsCard';
import { TwoFactorAuthenticator } from './tools/TwoFactorAuthenticator';
import { CheckIpTool } from './tools/CheckIpTool';
import { CheckLiveUidFb } from './tools/CheckLiveUidFb';
import { CheckLiveUidIg } from './tools/CheckLiveUidIg';
import { GetUidFromFb } from './tools/GetUidFromFb';
import { AdminDashboard } from './AdminDashboard';
import { AdBanner } from './AdBanner';
import {
  Gift,
  Share2,
  Send,
  LayoutDashboard,
  Sparkles,
  Layers,
  History,
  Tag,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  Zap,
  Clock,
  ArrowUpRight,
  BarChart2,
  Menu,
  X,
  Plus,
  Edit3,
  ClipboardList,
  Globe,
  UserCheck,
  Facebook,
  Instagram,
  Crown,
  Lock,
  AlertTriangle,
  LogOut
} from 'lucide-react';

interface DashboardSidebarLayoutProps {
  currentProfile: UserProfile | null;
  onGenerateNext: () => void;
  isGenerating: boolean;
  filters: FilterOptions;
  onChangeFilters: (f: FilterOptions) => void;
  tagConfig: UserTagConfig;
  onOpenTagEditor: () => void;
  uniqueCount: number;
  history: UserProfile[];
  onCopy: (text: string, label: string, platform?: string) => void;
  copiedLabel: string | null;
  layout: FrameworkLayout;
  onSelectLayout: (l: FrameworkLayout) => void;
  currentUser: AuthUser | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onEditProfile: () => void;
  platformData: PlatformStatData[];
  toolUsageData: ToolUsageData[];
  totalToolExecutions: number;
  onToolUsed: (toolName: string) => void;
  currentUserName?: string;
  totalGenerated: number;
  totalCopies: number;
  onClearHistory: () => void;
  onLoadProfile: (p: UserProfile) => void;
  onRefreshGlobalState?: () => void;
  onUnauthorizedAccess?: (msg: string) => void;
}

export const DashboardSidebarLayout: React.FC<DashboardSidebarLayoutProps> = ({
  currentProfile,
  onGenerateNext,
  isGenerating,
  filters,
  onChangeFilters,
  tagConfig,
  onOpenTagEditor,
  uniqueCount,
  history,
  onCopy,
  copiedLabel,
  layout,
  onSelectLayout,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenSettings,
  onEditProfile,
  platformData,
  toolUsageData,
  totalToolExecutions,
  onToolUsed,
  currentUserName,
  totalGenerated,
  totalCopies,
  onClearHistory,
  onLoadProfile,
  onRefreshGlobalState,
  onUnauthorizedAccess,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [bulkCount, setBulkCount] = useState<number>(10);
  const [bulkExportFormat, setBulkExportFormat] = useState<'json' | 'csv'>('csv');

  const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;

  const [taskClaimedTimestamps, setTaskClaimedTimestamps] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(`fakenames_cpa_timestamps_${currentUser?.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [nowTime, setNowTime] = useState<number>(Date.now());
  const [verifyingTask, setVerifyingTask] = useState<{
    id: string;
    title: string;
    instruction: string;
    reward: number;
    link: string;
    banner: string;
    badgeColor: string;
  } | null>(null);
  const [verificationStep, setVerificationStep] = useState<'verifying' | 'ready'>('verifying');

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const CPA_OFFERS = [
    {
      id: 'cpa_1',
      title: 'Get the Best Rewards With Tap Rewards',
      instruction: 'Submit Email & Zip Code',
      reward: 1,
      link: 'https://singingfiles.com/show.php?l=0&u=2543894&id=73721',
      banner: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'cpa_2',
      title: 'Get $100 Ulta Gift Card Now!',
      instruction: 'Submit Email & Zip Code',
      reward: 15,
      link: 'https://singingfiles.com/show.php?l=0&u=2543894&id=74437',
      banner: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    },
    {
      id: 'cpa_3',
      title: 'Start Playing Yoga Workout!',
      instruction: 'Download & Play / Submit Email',
      reward: 5,
      link: 'https://singingfiles.com/show.php?l=0&u=2543894&id=74923',
      banner: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'cpa_4',
      title: 'Get a 7-Eleven Gift Card!',
      instruction: 'Submit Email & Zip Code',
      reward: 25,
      link: 'https://singingfiles.com/show.php?l=0&u=2543894&id=69083',
      banner: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    },
    {
      id: 'cpa_5',
      title: 'Get $500 to Spend at Walmart!',
      instruction: 'Submit Email & Zip Code',
      reward: 15,
      link: 'https://singingfiles.com/show.php?l=0&u=2543894&id=74764',
      banner: 'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?w=600',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'cpa_6',
      title: 'Get $100 to Spend at Jersey Mikes!',
      instruction: 'Submit Email & Zip Code',
      reward: 15,
      link: 'https://singingfiles.com/show.php?l=0&u=2543894&id=75134',
      banner: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
  ];

  const getTaskStatus = (taskId: string) => {
    const claimedAt = taskClaimedTimestamps[taskId];
    if (!claimedAt) return { isClaimed: false, countdownText: '' };

    const remainingMs = claimedAt + FIVE_HOURS_MS - nowTime;
    if (remainingMs <= 0) {
      return { isClaimed: false, countdownText: '' };
    }

    const totalSecs = Math.floor(remainingMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const formatted = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return { isClaimed: true, countdownText: `Resets in ${formatted}` };
  };

  const handleOpenCpaTask = (task: (typeof CPA_OFFERS)[0]) => {
    if (!currentUser) return;
    window.open(task.link, '_blank', 'noopener,noreferrer');
    setVerifyingTask(task);
    setVerificationStep('verifying');

    setTimeout(() => {
      setVerificationStep('ready');
    }, 4000);
  };

  const handleClaimReward = () => {
    if (!currentUser || !verifyingTask) return;
    addCreditsToUser(currentUser.id, verifyingTask.reward);

    const newTimestamps = { ...taskClaimedTimestamps, [verifyingTask.id]: Date.now() };
    setTaskClaimedTimestamps(newTimestamps);
    try {
      localStorage.setItem(`fakenames_cpa_timestamps_${currentUser.id}`, JSON.stringify(newTimestamps));
    } catch (e) {}

    if (onRefreshGlobalState) onRefreshGlobalState();
    const claimedTaskTitle = verifyingTask.title;
    const rewardAmt = verifyingTask.reward;
    setVerifyingTask(null);
    onCopy('', `🎉 Claimed +${rewardAmt} Credits for ${claimedTaskTitle}! Resets in 5 Hours.`);
  };

  // STRICT RBAC PROTECTION: Redirect non-admin users away from admin tab
  useEffect(() => {
    if (activeTab === 'admin' && currentUser?.role !== 'ADMIN') {
      setActiveTab('dashboard');
      if (onUnauthorizedAccess) {
        onUnauthorizedAccess('Unauthorized Access: Admin Control Panel is restricted to Super Admin (@Prime8088)');
      }
    }
  }, [activeTab, currentUser?.role, onUnauthorizedAccess]);

  const toolStatuses = getToolStatuses();

  const isToolInMaintenance = (toolId: string) => {
    const status = toolStatuses.find((t) => t.id === toolId);
    return status?.isMaintenance || false;
  };

  const baseSidebarItems = [
    { id: 'dashboard', label: 'Dashboard & Live Analytics', icon: LayoutDashboard },
    { id: 'generator', label: 'ProfileNexus Generator', icon: Zap },
    { id: 'refer-earn', label: 'Refer & Earn (+500 Credits)', icon: Gift },
    { id: '2fa-authenticator', label: '2FA.Live Authenticator', icon: ShieldCheck },
    { id: 'check-ip', label: 'Check IP', icon: Globe },
    { id: 'check-live-uid', label: 'Check live UID Fb', icon: UserCheck },
    { id: 'check-live-uid-ig', label: 'Check live UID IG', icon: Instagram },
    { id: 'get-uid-fb', label: 'Get UID From Fb name', icon: Facebook },
  ];

  const sidebarNavItems = currentUser?.role === 'ADMIN'
    ? [...baseSidebarItems, { id: 'admin', label: 'Admin Control Panel', icon: Crown }]
    : baseSidebarItems;


  const topNavItems = [
    { id: 'bulk', label: 'Bulk Profile Generator', icon: Download },
    { id: 'history', label: `Saved History (${history.length})`, icon: History },
    { id: 'tags', label: 'User Tag & Date Rules', icon: Tag },
  ] as const;

  const handleExportHistory = (format: 'json' | 'csv') => {
    if (history.length === 0) return;
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fake_names_export_${Date.now()}.json`;
      a.click();
    } else {
      const headers = ['Full Name', 'Gender', 'Email', 'Password', 'Phone', 'Address', 'Instagram', 'Facebook'];
      const rows = history.map((p) => [
        `"${p.fullName}"`,
        `"${p.gender}"`,
        `"${p.email}"`,
        `"${p.password}"`,
        `"${p.phone}"`,
        `"${p.address.street}, ${p.address.city}, ${p.address.country}"`,
        `"${p.username.instagram}"`,
        `"${p.username.facebook}"`,
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fake_names_export_${Date.now()}.csv`;
      a.click();
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Mobile Top Controls Bar */}
      <div className="md:hidden p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Sidebar Menu
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          {isSidebarOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* LEFT SIDEBAR (Dashboard & Live Analytics + Fake Name Generator) */}
      <aside
        className={`w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col shrink-0 transition-all ${
          isSidebarOpenMobile ? 'block' : 'hidden md:flex'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <BarChart2 className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
            Main Sidebar Navigation
          </span>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="p-3 space-y-1.5 flex-1">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as typeof activeTab);
                  setIsSidebarOpenMobile(false);
                }}
                className={`w-full px-3.5 py-3 rounded-xl text-xs font-extrabold flex items-center gap-2.5 transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.01]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-indigo-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Account / Auth Card inside Left Sidebar */}
        {currentUser && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <div className="flex items-center gap-2.5">
                <UserAvatar
                  name={currentUser.name}
                  avatarUrl={currentUser.avatarUrl}
                  avatarType={currentUser.avatarType}
                  sizeClassName="w-9 h-9"
                />
                <div className="overflow-hidden">
                  <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-extrabold text-xs border border-red-500/20 transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout System</span>
                </button>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* RIGHT MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Main View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* TAB 1: DASHBOARD & LIVE ANALYTICS (with Generator Tools Embedded Below) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Total Generated</div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{totalGenerated}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Non-repeating names</div>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                  <BarChart2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Total Copied</div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalCopies}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Clipboard events</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                  <Copy className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Saved Profiles</div>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{history.length}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">In local memory</div>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                  <History className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase">System Status</div>
                  <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-4 h-4" /> 100% Unique
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Memory active</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* AdSense / Announcement Banner Slot */}
            <AdBanner slotId="main-dashboard-top" />

            {/* Live Chart Section */}
            <LivePlatformChart
              data={platformData}
              totalGenerated={totalGenerated}
              totalCopies={totalCopies}
            />

            {/* Live Tools Usage Chart (Real-time tracking of 2FA, IP, Check live UID, Get UID, Generator) */}
            <LiveToolChart
              data={toolUsageData}
              totalUses={totalToolExecutions}
            />

            {/* Top 30 Active Users Leaderboard */}
            <TopUsersLeaderboard
              currentUserName={currentUserName}
              currentUserTag={formatUserTag(tagConfig)}
            />

          </div>
        )}

        {/* TAB: ADMIN CONTROL PANEL */}
        {activeTab === 'admin' && currentUser?.role === 'ADMIN' && (
          <div className="animate-fade-in">
            <AdminDashboard
              currentAdmin={currentUser}
              onRefreshGlobalState={onRefreshGlobalState}
            />
          </div>
        )}

        {/* TAB: 2FA.LIVE AUTHENTICATOR */}
        {activeTab === '2fa-authenticator' && (
          <div className="animate-fade-in">
            {isToolInMaintenance('2fa-authenticator') && currentUser?.role !== 'ADMIN' ? (
              <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-center space-y-3">
                <Lock className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-black">Tool Under Maintenance</h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 max-w-md mx-auto">
                  2FA.Live Authenticator is currently in Maintenance Mode by System Admin. Please check back shortly!
                </p>
              </div>
            ) : (
              <TwoFactorAuthenticator onCopy={onCopy} copiedLabel={copiedLabel || undefined} onToolUsed={onToolUsed} />
            )}
          </div>
        )}

        {/* TAB: CHECK IP */}
        {activeTab === 'check-ip' && (
          <div className="animate-fade-in">
            {isToolInMaintenance('check-ip') && currentUser?.role !== 'ADMIN' ? (
              <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-center space-y-3">
                <Lock className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-black">Tool Under Maintenance</h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 max-w-md mx-auto">
                  Check IP Detector is currently in Maintenance Mode by System Admin. Please check back shortly!
                </p>
              </div>
            ) : (
              <CheckIpTool onCopy={onCopy} copiedLabel={copiedLabel || undefined} onToolUsed={onToolUsed} />
            )}
          </div>
        )}

        {/* TAB: CHECK LIVE UID FB */}
        {activeTab === 'check-live-uid' && (
          <div className="animate-fade-in">
            {isToolInMaintenance('check-live-uid') && currentUser?.role !== 'ADMIN' ? (
              <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-center space-y-3">
                <Lock className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-black">Tool Under Maintenance</h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 max-w-md mx-auto">
                  Check live UID Fb is currently in Maintenance Mode by System Admin. Please check back shortly!
                </p>
              </div>
            ) : (
              <CheckLiveUidFb onCopy={onCopy} copiedLabel={copiedLabel || undefined} onToolUsed={onToolUsed} />
            )}
          </div>
        )}

        {/* TAB: CHECK LIVE UID IG */}
        {activeTab === 'check-live-uid-ig' && (
          <div className="animate-fade-in">
            {isToolInMaintenance('check-live-uid-ig') && currentUser?.role !== 'ADMIN' ? (
              <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-center space-y-3">
                <Lock className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-black">Tool Under Maintenance</h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 max-w-md mx-auto">
                  Check live UID IG is currently in Maintenance Mode by System Admin. Please check back shortly!
                </p>
              </div>
            ) : (
              <CheckLiveUidIg onCopy={onCopy} copiedLabel={copiedLabel || undefined} onToolUsed={onToolUsed} />
            )}
          </div>
        )}

        {/* TAB: GET UID FROM FB NAME */}
        {activeTab === 'get-uid-fb' && (
          <div className="animate-fade-in">
            {isToolInMaintenance('get-uid-fb') && currentUser?.role !== 'ADMIN' ? (
              <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-center space-y-3">
                <Lock className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-black">Tool Under Maintenance</h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 max-w-md mx-auto">
                  Get UID From Fb name is currently in Maintenance Mode by System Admin. Please check back shortly!
                </p>
              </div>
            ) : (
              <GetUidFromFb onCopy={onCopy} copiedLabel={copiedLabel || undefined} onToolUsed={onToolUsed} />
            )}
          </div>
        )}

        {/* TAB 2: FAKE NAME GENERATOR DIRECT VIEW */}
        {activeTab === 'generator' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              
              {/* Heading Title + Inline-Flex Top Header Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-500" />
                    <span>ProfileNexus Identity Engine</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Instant non-repeating profile generator with deep customization
                  </p>
                </div>

                {/* Inline-flex Top Navigation Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
                  <button
                    onClick={() => setActiveTab('bulk')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-150 shrink-0 ${
                      activeTab === 'bulk'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Bulk Profile Generator</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('history')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-150 shrink-0 ${
                      activeTab === 'history'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <History className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Saved History ({history.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenTagEditor) onOpenTagEditor();
                      setActiveTab('tags');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-150 shrink-0 ${
                      activeTab === 'tags'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5 text-indigo-500" />
                    <span>User Tag & Date Rules</span>
                  </button>
                </div>
              </div>

              <button
                onClick={onGenerateNext}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition flex items-center gap-2 shrink-0 self-start lg:self-center"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Next Unique Profile</span>
              </button>
            </div>

            <GeneratorControls
              filters={filters}
              onChangeFilters={onChangeFilters}
              uniqueCount={uniqueCount}
              layout={layout}
              onSelectLayout={onSelectLayout}
            />

            {currentProfile && (
              <>
                {/* BOLD LIME INDUSTRIAL LAYOUT */}
                {layout === 'bold-industrial' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
                  >
                    {/* Left 2 Cols: GIANT Bold Typography Hero Identity */}
                    <div className="lg:col-span-2 relative bg-[#111] border-2 border-white/10 hover:border-[#D4FF00] p-6 sm:p-12 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#D4FF00]/15 transition-all duration-300">
                      <div className="absolute top-4 right-6 text-[#222] text-[100px] sm:text-[180px] font-black leading-none opacity-30 pointer-events-none select-none uppercase tracking-tighter">
                        IDENTITY
                      </div>

                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                          <span className="text-[#D4FF00] font-mono text-xs tracking-[0.3em] uppercase font-black">
                            GENERATE UNIQUE NAME
                          </span>
                          <span className="w-2.5 h-2.5 bg-[#D4FF00] rounded-full animate-ping" />
                        </div>

                        {/* Display Names & Avatar */}
                        <div className="flex items-center gap-4">
                          <img
                            src={currentProfile.avatarUrl}
                            alt={`${currentProfile.fullName} Avatar`}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#D4FF00] bg-white/10 p-1 object-cover shrink-0 shadow-lg shadow-[#D4FF00]/20 hover:scale-110 transition-transform duration-300"
                          />
                          <div className="border-l-8 border-[#D4FF00] pl-4 sm:pl-6 space-y-1">
                            <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tighter uppercase break-words text-white hover:text-[#D4FF00] transition-colors duration-200">
                              {currentProfile.firstName}
                            </div>
                            <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tighter uppercase break-words text-[#D4FF00]">
                              {currentProfile.lastName}
                            </div>
                          </div>
                        </div>

                        {/* Individual First and Last Copy buttons */}
                        <div className="pt-4 flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => onCopy(currentProfile.firstName, 'First Name')}
                            className="px-5 py-3 bg-white/10 hover:bg-[#D4FF00] hover:text-black text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl border border-white/20 hover:border-[#D4FF00] hover:scale-105 active:scale-95 transition-all shadow-md"
                          >
                            {copiedLabel === 'First Name' ? '✓ Copied First' : `1st: ${currentProfile.firstName}`}
                          </button>

                          <button
                            onClick={() => onCopy(currentProfile.lastName, 'Last Name')}
                            className="px-5 py-3 bg-white/10 hover:bg-[#D4FF00] hover:text-black text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl border border-white/20 hover:border-[#D4FF00] hover:scale-105 active:scale-95 transition-all shadow-md"
                          >
                            {copiedLabel === 'Last Name' ? '✓ Copied Last' : `Last: ${currentProfile.lastName}`}
                          </button>
                        </div>

                        {/* Main Action Bar */}
                        <div className="flex flex-wrap items-center gap-4 pt-6">
                          <button
                            onClick={() => onCopy(currentProfile.fullName, 'Full Name')}
                            className="bg-[#D4FF00] text-black px-8 py-4 text-sm font-black uppercase tracking-widest hover:bg-[#c2eb00] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#D4FF00]/30 flex items-center gap-2 rounded-xl"
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copy Full Name</span>
                          </button>

                          <button
                            onClick={onGenerateNext}
                            disabled={isGenerating}
                            className="border-2 border-white/20 hover:border-[#D4FF00] text-white hover:text-[#D4FF00] px-8 py-4 text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 rounded-xl"
                          >
                            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                            <span>Generate Next</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Col: Account Context & User Tag Badge */}
                    <div className="bg-[#111] border-2 border-white/10 hover:border-[#D4FF00]/60 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl transition-all duration-300">
                      
                      {/* Highlighted Tag Badge */}
                      <div className="p-5 bg-[#1A1A1A] border border-white/10 hover:border-[#D4FF00]/50 hover:bg-[#222] rounded-xl space-y-3 transition-all duration-200">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">
                            USER TAG CONTEXT
                          </span>
                          <button
                            onClick={onOpenTagEditor}
                            className="text-[#D4FF00] hover:text-white text-xs underline uppercase font-bold flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            Edit Tag
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-3xl font-black tracking-tighter text-white font-mono">
                            {formatUserTag(tagConfig)}
                          </div>
                          <div className="bg-[#D4FF00]/10 px-3 py-1.5 rounded-lg border border-[#D4FF00]/30 text-center animate-pulse">
                            <div className="text-[9px] text-[#D4FF00] uppercase font-black">DAILY RESET</div>
                          </div>
                        </div>
                      </div>

                      {/* Social Acc Account Data */}
                      <div className="space-y-4">
                        <h3 className="text-xs text-white/40 uppercase tracking-widest font-bold">
                          Social Acc Signup Profile
                        </h3>

                        <div className="space-y-3 font-mono text-xs">
                          <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-[#D4FF00]/50 hover:bg-white/10 transition-all duration-200 flex items-center justify-between">
                            <div>
                              <div className="text-[10px] text-white/40 uppercase">Email</div>
                              <div className="text-white font-bold truncate max-w-[180px]">{currentProfile.email}</div>
                            </div>
                            <button onClick={() => onCopy(currentProfile.email, 'Email')} className="p-1.5 text-[#D4FF00] hover:scale-125 transition-transform">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Highlighted Password in Bold Lime Industrial Mode */}
                          <div className="bg-[#D4FF00]/10 border-2 border-[#D4FF00] p-3.5 rounded-xl flex items-center justify-between gap-2 shadow-md shadow-[#D4FF00]/20 transition-all duration-200">
                            <div>
                              <div className="text-[10px] text-[#D4FF00] font-black uppercase tracking-wider">
                                🔑 SECURE PASSWORD (HIGHLIGHTED)
                              </div>
                              <div className="text-white font-mono font-extrabold text-sm tracking-wider">{currentProfile.password}</div>
                            </div>
                            <button
                              onClick={() => onCopy(currentProfile.password, 'Password')}
                              className="bg-[#D4FF00] hover:bg-white text-black px-3 py-1.5 text-xs font-black uppercase rounded-lg flex items-center gap-1 hover:scale-105 active:scale-95 transition-all shrink-0"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{copiedLabel === 'Password' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-[#D4FF00]/50 hover:bg-white/10 transition-all duration-200">
                              <div className="text-[10px] text-white/40 uppercase">DOB</div>
                              <div className="text-white font-bold">{currentProfile.dob.formatted}</div>
                            </div>

                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-[#D4FF00]/50 hover:bg-white/10 transition-all duration-200">
                              <div className="text-[10px] text-white/40 uppercase">Gender</div>
                              <div className="text-white font-bold">{currentProfile.gender}</div>
                            </div>
                          </div>

                          <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-[#D4FF00]/50 hover:bg-white/10 transition-all duration-200 flex items-center justify-between">
                            <div>
                              <div className="text-[10px] text-white/40 uppercase">Instagram</div>
                              <div className="text-white font-bold">{currentProfile.username.instagram}</div>
                            </div>
                            <button onClick={() => onCopy(currentProfile.username.instagram, 'Instagram')} className="p-1.5 text-[#D4FF00] hover:scale-125 transition-transform">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-[#D4FF00]/50 hover:bg-white/10 transition-all duration-200 flex items-center justify-between">
                            <div>
                              <div className="text-[10px] text-white/40 uppercase">Facebook</div>
                              <div className="text-white font-bold truncate max-w-[180px]">{currentProfile.username.facebook}</div>
                            </div>
                            <button onClick={() => onCopy(currentProfile.username.facebook, 'Facebook')} className="p-1.5 text-[#D4FF00] hover:scale-125 transition-transform">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => onCopy(currentProfile.fullName + '\n' + currentProfile.email + '\n' + currentProfile.password, 'Profile Details')}
                          className="w-full py-3 bg-[#D4FF00] text-black text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                        >
                          <ClipboardList className="w-4 h-4" />
                          <span>Copy Full Profile Details</span>
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* SPLIT STUDIO LAYOUT */}
                {layout === 'split-studio' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            Split Studio Profile Engine
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 font-mono text-[10px] font-bold">
                            {formatUserTag(tagConfig)}
                          </span>
                        </div>

                        <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={currentProfile.avatarUrl}
                              alt={`${currentProfile.fullName} Avatar`}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-full border-2 border-purple-500 bg-purple-100 dark:bg-purple-900 p-0.5 object-cover shrink-0 shadow-sm"
                            />
                            <div>
                              <span className="text-xs font-semibold text-slate-500 block">Generated Full Name</span>
                              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                                {currentProfile.fullName}
                              </h2>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <button
                              onClick={() => onCopy(currentProfile.firstName, 'First Name')}
                              className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between hover:bg-purple-50 dark:hover:bg-purple-900/40 transition"
                            >
                              <span className="truncate">1st: {currentProfile.firstName}</span>
                              <Copy className="w-3.5 h-3.5 text-purple-500" />
                            </button>

                            <button
                              onClick={() => onCopy(currentProfile.lastName, 'Last Name')}
                              className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between hover:bg-purple-50 dark:hover:bg-purple-900/40 transition"
                            >
                              <span className="truncate">Last: {currentProfile.lastName}</span>
                              <Copy className="w-3.5 h-3.5 text-purple-500" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => onCopy(currentProfile.fullName, 'Full Name')}
                          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy Full Name</span>
                        </button>

                        <button
                          onClick={onGenerateNext}
                          disabled={isGenerating}
                          className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-sm flex items-center justify-center gap-2 transition"
                        >
                          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                          <span>Generate Next Unique Profile</span>
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-7 w-full">
                      <ProfileDetailsCard
                        profile={currentProfile}
                        onCopy={onCopy}
                        copiedLabel={copiedLabel}
                        onOpenEditProfile={onEditProfile}
                      />
                    </div>
                  </div>
                )}

                {/* MODERN SAAS LAYOUT (DEFAULT) */}
                {layout === 'modern-saas' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-5 w-full">
                      <NameCard
                        profile={currentProfile}
                        onGenerate={onGenerateNext}
                        isGenerating={isGenerating}
                        onCopy={onCopy}
                        copiedLabel={copiedLabel}
                        onOpenEditProfile={onEditProfile}
                      />
                    </div>
                    <div className="lg:col-span-7 w-full">
                      <ProfileDetailsCard
                        profile={currentProfile}
                        onCopy={onCopy}
                        copiedLabel={copiedLabel}
                        onOpenEditProfile={onEditProfile}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 3: BULK GENERATOR */}
        {activeTab === 'bulk' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Download className="w-5 h-5 text-indigo-500" />
                  <span>Bulk Identity Export Engine</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Generate multiple unique names at once and export as JSON or CSV file
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Export Quantity
                  </label>
                  <select
                    value={bulkCount}
                    onChange={(e) => setBulkCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                  >
                    <option value={5}>5 Unique Profiles</option>
                    <option value={10}>10 Unique Profiles</option>
                    <option value={25}>25 Unique Profiles</option>
                    <option value={50}>50 Unique Profiles</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Export Format
                  </label>
                  <select
                    value={bulkExportFormat}
                    onChange={(e) => setBulkExportFormat(e.target.value as 'json' | 'csv')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                  >
                    <option value="csv">CSV Spreadsheet File</option>
                    <option value="json">JSON Structured File</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => handleExportHistory(bulkExportFormat)}
                  disabled={history.length === 0}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Export ({history.length} Available)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HISTORY VAULT */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-500" />
                  <span>Saved Profiles Memory History</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {history.length} profiles stored in non-repeating memory session
                </p>
              </div>

              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs border border-red-500/20 transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                No generated profiles in history yet. Generate names to see them listed here!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatarUrl}
                        alt={item.fullName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full border border-indigo-500 object-cover shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {item.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{item.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-slate-400 text-[10px]">@{item.username.instagram}</span>
                      <button
                        onClick={() => onLoadProfile(item)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] hover:bg-indigo-100 transition"
                      >
                        Load Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TAGS & PRESETS */}
        {activeTab === 'tags' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-500" />
                  <span>User Tag & Real-time Date Configuration</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Configure tag prefixes and date rules attached to generated user identities
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">Active User Tag</div>
                  <div className="text-base font-mono font-black text-indigo-700 dark:text-indigo-300">
                    {tagConfig.prefix}{tagConfig.useZeroPadding ? '01' : '1'}
                  </div>
                </div>

                <button
                  onClick={onOpenTagEditor}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Edit Tag Rules
                </button>
              </div>
            </div>
          </div>
        )}
        {/* TAB: REFER & EARN (+500 CREDITS) */}
        {activeTab === 'refer-earn' && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            {/* Main Referral Card Header */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-2xl overflow-hidden space-y-6">
              
              {/* Decorative background aura */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20">
                  <Gift className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>Invite Friends & Earn Free Credits</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-extrabold uppercase">
                      +500 Credits / Signup
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Share your referral link with colleagues or friends on Telegram. Every valid signup gives you <strong className="text-amber-400 font-extrabold">+500 Credits instantly!</strong>
                  </p>
                </div>
              </div>

              {/* Referral Link Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-sky-400" />
                    Your Personal Telegram Referral Link:
                  </span>
                  <span className="text-amber-400 font-mono">
                    Ref Code: {currentUser?.referralCode || 'REF500'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    readOnly
                    value={`https://t.me/ProfileNexus_bot?start=${currentUser?.referralCode || 'REF500'}`}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/15 bg-slate-950/80 font-mono text-xs text-sky-300 outline-none select-all"
                  />
                  <button
                    onClick={() => {
                      const link = `https://t.me/ProfileNexus_bot?start=${currentUser?.referralCode || 'REF500'}`;
                      onCopy(link, 'Referral Link');
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-sky-500/25 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Referral Link</span>
                  </button>
                </div>
              </div>

              {/* Real-time Referral Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Referred Users
                  </div>
                  <div className="text-3xl font-black text-white">
                    {currentUser?.referralCount || 0}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold">
                    Successful Telegram registrations
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Credits Earned via Referrals
                  </div>
                  <div className="text-3xl font-black text-amber-400">
                    {((currentUser?.referralCount || 0) * 500).toLocaleString()} Credits
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold">
                    Added to your active balance
                  </div>
                </div>
              </div>
            </div>

            {/* How it works steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  Share Your Link
                </h4>
                <p className="text-xs text-slate-500">
                  Copy your unique referral link and send it to friends or Telegram groups.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  Friend Signs Up
                </h4>
                <p className="text-xs text-slate-500">
                  Your friend registers their account via your Telegram referral link.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  Earn +500 Credits
                </h4>
                <p className="text-xs text-slate-500">
                  You instantly receive +500 Credits in your profile balance!
                </p>
              </div>
            </div>

            {/* TASK-TO-EARN CPA OFFER WALL SECTION */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
                    <span>Earn Free Credits (CPA Offers)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Complete sponsor offers to claim execution credits. Offers refresh every 5 Hours!
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-extrabold shrink-0 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>5-Hour Auto Refresh Active ⚡</span>
                </div>
              </div>

              {/* Offer Cards Grid (6 Tasks) with Visual Thumbnails */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CPA_OFFERS.map((task) => {
                  const { isClaimed, countdownText } = getTaskStatus(task.id);
                  const isVerifying = verifyingTask?.id === task.id;

                  return (
                    <div
                      key={task.id}
                      className="rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between overflow-hidden shadow-xl hover:border-indigo-500/50 transition group relative"
                    >
                      {/* Visual Banner Thumbnail */}
                      <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                        <img
                          src={task.banner}
                          alt={task.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                        
                        {/* Floating Reward Badge */}
                        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-500/40 text-amber-400 font-mono font-black text-xs shadow-lg flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 fill-amber-400" />
                          <span>+{task.reward} {task.reward === 1 ? 'Credit' : 'Credits'}</span>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className={`inline-block px-2.5 py-1 rounded-lg border text-[10px] font-bold font-mono ${task.badgeColor}`}>
                            📌 {task.instruction}
                          </div>

                          <h4 className="font-extrabold text-sm text-white leading-snug group-hover:text-indigo-400 transition">
                            {task.title}
                          </h4>
                        </div>

                        {/* Animated Action Button / Cooldown State */}
                        {isClaimed ? (
                          <div className="w-full py-3 px-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-400 font-bold text-xs flex flex-col items-center justify-center gap-0.5 cursor-not-allowed">
                            <span className="flex items-center gap-1 text-slate-300 font-extrabold">
                              <Check className="w-4 h-4 text-emerald-400" /> Claimed ✓
                            </span>
                            <span className="text-[10px] font-mono text-amber-400 font-semibold">{countdownText}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenCpaTask(task)}
                            disabled={isVerifying}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Zap className="w-4 h-4 fill-white animate-pulse" />
                            <span>{isVerifying ? 'Verifying Offer...' : 'Open Task & Claim'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      {/* Verification & Claim Modal */}
      {verifyingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-slate-100 relative">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg">
                <Zap className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">CPA Offer Verification</h3>
                <p className="text-xs text-slate-400 truncate max-w-[240px]">{verifyingTask.title}</p>
              </div>
            </div>

            {verificationStep === 'verifying' ? (
              <div className="py-8 space-y-4 text-center">
                <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-mono font-bold text-slate-200">Verifying Offer Completion with sponsor postback...</p>
                  <p className="text-[11px] text-slate-400">Please complete the task instructions in the opened window.</p>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-5 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-emerald-400">Offer Verified Successfully! 🎉</p>
                  <p className="text-xs text-slate-300">
                    Click below to add <strong className="text-amber-400 font-mono">+{verifyingTask.reward} Credits</strong> to your live profile balance.
                  </p>
                </div>

                <button
                  onClick={handleClaimReward}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-xl shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Claim +{verifyingTask.reward} Credits Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      </main>

      </div>

    </div>
  );
};
