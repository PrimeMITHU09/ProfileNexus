import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  UserProfile,
  UserTagConfig,
  FilterOptions,
  FrameworkLayout,
  GeneratorSettings,
  AuthUser
} from './types';
import {
  generateUniqueProfile,
  copyToClipboard,
  formatUserTag
} from './utils/generator';
import { Header } from './components/Header';
import { TagEditorModal } from './components/TagEditorModal';
import { NameCard } from './components/NameCard';
import { ProfileDetailsCard } from './components/ProfileDetailsCard';
import { GeneratorControls } from './components/GeneratorControls';
import { HistoryDrawer } from './components/HistoryDrawer';
import { EditProfileModal } from './components/EditProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { AuthLandingPage } from './components/AuthLandingPage';
import { DashboardModal } from './components/DashboardModal';
import { DashboardSidebarLayout } from './components/DashboardSidebarLayout';
import { UserProfileModal } from './components/UserProfileModal';
import { CreditDepletedModal } from './components/CreditDepletedModal';
import { ToolUsageData } from './components/LiveToolChart';
import { Toast } from './components/Toast';
import {
  getUserById,
  saveUser,
  deductUserCredit,
  addCreditsToUser,
  getAllUsers
} from './utils/userStore';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Gift,
  Edit3,
  Calendar,
  Lock,
  Mail,
  Instagram,
  Facebook,
  Phone,
  MapPin,
  ClipboardList
} from 'lucide-react';

const STORAGE_KEY_TAG = 'fakenames_tag_config_v1';
const STORAGE_KEY_HISTORY = 'fakenames_history_v1';
const STORAGE_KEY_LAYOUT = 'fakenames_layout_v1';
const STORAGE_KEY_THEME = 'fakenames_theme_v1';
const STORAGE_KEY_SETTINGS = 'fakenames_settings_v1';

export default function App() {
  // Framework layout selection
  const [layout, setLayout] = useState<FrameworkLayout>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LAYOUT);
      if (saved) return saved as FrameworkLayout;
    } catch (e) {
      console.error(e);
    }
    return 'modern-saas';
  });

  // Generator global settings
  const [settings, setSettings] = useState<GeneratorSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      passwordLength: 12,
      includeNumbers: true,
      includeSymbols: true,
      avatarStyle: 'avataaars',
      autoCopyOnGenerate: false,
      defaultGender: 'any',
      defaultOrigin: 'global',
    };
  });

  // Theme state with persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved !== null) return saved === 'dark';
    } catch (e) {
      console.error(e);
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // User tag badge config (default "Prime@31" format)
  const [tagConfig, setTagConfig] = useState<UserTagConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TAG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      prefix: 'Prime@',
      useZeroPadding: false,
      manualDateOverride: null,
      autoRefreshDaily: true,
    };
  });

  // Filters state
  const [filters, setFilters] = useState<FilterOptions>({
    gender: 'any',
    origin: 'global',
    minAge: 18,
    maxAge: 35,
    customDomain: '',
  });

  // Generated memory history & active profile
  const [history, setHistory] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [usedNamesSet] = useState<Set<string>>(() => {
    const set = new Set<string>();
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        const list: UserProfile[] = JSON.parse(saved);
        list.forEach((p) => set.add(p.fullName.toLowerCase()));
      }
    } catch (e) {
      console.error(e);
    }
    return set;
  });

  // User Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('fakenames_auth_user_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');

  // Live Platform Stats state
  const [platformStats, setPlatformStats] = useState<Record<string, { generated: number; copied: number }>>({
    'Instagram': { generated: 0, copied: 0 },
    'Facebook': { generated: 0, copied: 0 },
    'TikTok': { generated: 0, copied: 0 },
    'LinkedIn': { generated: 0, copied: 0 },
    'X (Twitter)': { generated: 0, copied: 0 },
  });

  // Live Tool Usage Analytics State
  const [toolUsageStats, setToolUsageStats] = useState<Record<string, number>>({
    'Check live UID Fb': 0,
    'Check live UID IG': 0,
    '2FA.Live Authenticator': 0,
    'Get UID From Fb name': 0,
    'Check IP': 0,
    'ProfileNexus': 0,
  });

  // User-scoped data loader (Fresh User Dashboard Initialization)
  useEffect(() => {
    if (!currentUser?.id) return;

    try {
      const savedHist = localStorage.getItem(`fakenames_history_${currentUser.id}`);
      setHistory(savedHist ? JSON.parse(savedHist) : []);
    } catch (e) {
      setHistory([]);
    }

    try {
      const savedPlat = localStorage.getItem(`fakenames_platform_stats_${currentUser.id}`);
      setPlatformStats(
        savedPlat
          ? JSON.parse(savedPlat)
          : {
              'Instagram': { generated: 0, copied: 0 },
              'Facebook': { generated: 0, copied: 0 },
              'TikTok': { generated: 0, copied: 0 },
              'LinkedIn': { generated: 0, copied: 0 },
              'X (Twitter)': { generated: 0, copied: 0 },
            }
      );
    } catch (e) {
      setPlatformStats({
        'Instagram': { generated: 0, copied: 0 },
        'Facebook': { generated: 0, copied: 0 },
        'TikTok': { generated: 0, copied: 0 },
        'LinkedIn': { generated: 0, copied: 0 },
        'X (Twitter)': { generated: 0, copied: 0 },
      });
    }

    try {
      const savedTool = localStorage.getItem(`fakenames_tool_usage_${currentUser.id}`);
      setToolUsageStats(
        savedTool
          ? JSON.parse(savedTool)
          : {
              'Check live UID Fb': 0,
              'Check live UID IG': 0,
              '2FA.Live Authenticator': 0,
              'Get UID From Fb name': 0,
              'Check IP': 0,
              'ProfileNexus': 0,
            }
      );
    } catch (e) {
      setToolUsageStats({
        'Check live UID Fb': 0,
        'Check live UID IG': 0,
        '2FA.Live Authenticator': 0,
        'Get UID From Fb name': 0,
        'Check IP': 0,
        'ProfileNexus': 0,
      });
    }
  }, [currentUser?.id]);

  // User Profile information state (Name & Avatar)
  const [userProfileInfo, setUserProfileInfo] = useState<{
    userName: string;
    userEmail: string;
    userAvatar: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('fakenames_user_profile_info_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      userName: 'Prime Master Admin',
      userEmail: 'mithuchandra647@gmail.com',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
  });

  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modals & Drawers
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [referredByCode, setReferredByCode] = useState<string>('');

  const handleWatchAdToEarn = () => {
    if (!currentUser) return;
    setIsWatchingAd(true);
    setTimeout(() => {
      addCreditsToUser(currentUser.id, 5);
      refreshUserFromStore();
      setIsWatchingAd(false);
      setIsCreditModalOpen(false);
      setToastMessage('🎉 You earned +5 Free Credits for watching sponsored ad!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 3000);
  };

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  // Extract referral link parameter on launch
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || params.get('start');
      if (ref) {
        setReferredByCode(ref);
        setToastMessage(`Referral code applied: ${ref} (+500 Credits on Signup!)`);
        setTimeout(() => setToastMessage(null), 4000);
        setIsAuthOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync user state from userStore
  const refreshUserFromStore = useCallback(() => {
    if (!currentUser) return;
    const fresh = getUserById(currentUser.id);
    if (fresh) {
      setCurrentUser(fresh);
    }
  }, [currentUser]);

  // Callback when any tool is executed
  const handleToolUsed = useCallback((toolName: string) => {
    const freeTools = ['ProfileNexus', 'Fake Name Generator', 'Check IP'];
    const isFree = freeTools.includes(toolName);

    // Deduct 1 credit only for PAID tools (2FA, Check live UID FB/IG, Get UID)
    if (currentUser && !isFree) {
      const res = deductUserCredit(currentUser.id, 1);
      if (!res.success && !res.isUnlimited) {
        setIsCreditModalOpen(true);
        return;
      }
      refreshUserFromStore();
    }

    setToolUsageStats((prev) => {
      const updated = {
        ...prev,
        [toolName]: (prev[toolName] || 0) + 1,
      };
      try {
        if (currentUser?.id) {
          localStorage.setItem(`fakenames_tool_usage_${currentUser.id}`, JSON.stringify(updated));
        }
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, [currentUser, refreshUserFromStore]);

  // Persist Auth User
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('fakenames_auth_user_v1', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('fakenames_auth_user_v1');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Persist Platform Stats (User Scoped)
  useEffect(() => {
    try {
      if (currentUser?.id) {
        localStorage.setItem(`fakenames_platform_stats_${currentUser.id}`, JSON.stringify(platformStats));
      }
    } catch (e) {
      console.error(e);
    }
  }, [platformStats, currentUser?.id]);

  // Dark mode class toggle & persistence
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, isDarkMode ? 'dark' : 'light');
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Persist layout
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LAYOUT, layout);
    } catch (e) {
      console.error(e);
    }
  }, [layout]);

  // Persist tag config
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TAG, JSON.stringify(tagConfig));
    } catch (e) {
      console.error(e);
    }
  }, [tagConfig]);

  // Persist history (User Scoped)
  useEffect(() => {
    try {
      if (currentUser?.id) {
        localStorage.setItem(`fakenames_history_${currentUser.id}`, JSON.stringify(history));
      }
    } catch (e) {
      console.error(e);
    }
  }, [history, currentUser?.id]);

  // Main generator function
  const handleGenerateNext = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const newProfile = generateUniqueProfile(filters, usedNamesSet);
      setCurrentProfile(newProfile);
      setHistory((prev) => [newProfile, ...prev]);

      // Increment live platform generated counts
      setPlatformStats((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          next[k] = { ...next[k], generated: next[k].generated + 1 };
        });
        return next;
      });

      setIsGenerating(false);
    }, 150);
  }, [filters, usedNamesSet]);

  // Initial generation on launch
  useEffect(() => {
    if (!currentProfile) {
      handleGenerateNext();
    }
  }, [currentProfile, handleGenerateNext]);

  // Handle clipboard copy
  const handleCopy = async (text: string, label: string, platform?: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedLabel(label);
      setToastMessage(`${label} copied to clipboard!`);

      // Track platform copy count
      const platKey = platform || 'Instagram';
      setPlatformStats((prev) => ({
        ...prev,
        [platKey]: {
          ...prev[platKey],
          copied: (prev[platKey]?.copied || 0) + 1,
        },
      }));

      setTimeout(() => {
        setCopiedLabel(null);
        setToastMessage(null);
      }, 2000);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all generated history memory?')) {
      usedNamesSet.clear();
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
      setToastMessage('Generated history cleared');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  const handleOpenAuthModal = (mode: 'login' | 'signup' = 'signup') => {
    setAuthModalMode(mode);
    setIsAuthOpen(true);
  };

  const platformDataArr = [
    { name: 'Instagram', generated: platformStats['Instagram']?.generated || 0, copied: platformStats['Instagram']?.copied || 0, fill: '#E1306C' },
    { name: 'Facebook', generated: platformStats['Facebook']?.generated || 0, copied: platformStats['Facebook']?.copied || 0, fill: '#1877F2' },
    { name: 'TikTok', generated: platformStats['TikTok']?.generated || 0, copied: platformStats['TikTok']?.copied || 0, fill: '#00F2FE' },
    { name: 'LinkedIn', generated: platformStats['LinkedIn']?.generated || 0, copied: platformStats['LinkedIn']?.copied || 0, fill: '#0A66C2' },
    { name: 'X (Twitter)', generated: platformStats['X (Twitter)']?.generated || 0, copied: platformStats['X (Twitter)']?.copied || 0, fill: '#1DA1F2' },
  ];

  const totalGeneratedCount = Object.values(platformStats).reduce((acc: number, curr: { generated: number; copied: number }) => acc + curr.generated, 0);
  const totalCopiesCount = Object.values(platformStats).reduce((acc: number, curr: { generated: number; copied: number }) => acc + curr.copied, 0);

  const toolUsageDataArr: ToolUsageData[] = [
    { name: 'Check live UID Fb', count: toolUsageStats['Check live UID Fb'] || 0, color: '#1877F2' },
    { name: 'Check live UID IG', count: toolUsageStats['Check live UID IG'] || 0, color: '#E1306C' },
    { name: '2FA.Live Authenticator', count: toolUsageStats['2FA.Live Authenticator'] || 0, color: '#10B981' },
    { name: 'Get UID From Fb name', count: toolUsageStats['Get UID From Fb name'] || 0, color: '#8B5CF6' },
    { name: 'Check IP', count: toolUsageStats['Check IP'] || 0, color: '#F59E0B' },
    { name: 'ProfileNexus', count: toolUsageStats['ProfileNexus'] || toolUsageStats['Fake Name Generator'] || 0, color: '#6366F1' },
  ];

  const totalToolExecutionsCount = Object.values(toolUsageStats).reduce((acc: number, curr: number) => acc + curr, 0);

  const formattedTag = formatUserTag(tagConfig);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('fakenames_auth_user_v1');
    setToastMessage('Bye Bye! See you soon 👋');
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // AUTH WALL / PROTECTED ROUTING: If unauthenticated, render sleek Auth Landing Page
  if (!currentUser) {
    return (
      <>
        <AuthLandingPage
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setToastMessage(`Welcome back, ${user.name}! 50 Free Trial Credits Active.`);
            setTimeout(() => setToastMessage(null), 3000);
          }}
          referredByCode={referredByCode}
        />
        <Toast message={toastMessage} />
      </>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white ${
      layout === 'bold-industrial'
        ? 'bg-[#0A0A0A] text-[#F5F5F5]'
        : 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
    }`}>
      
      {/* Header with editable user tag, profile editor & auth */}
      <Header
        tagConfig={tagConfig}
        onOpenTagEditor={() => setIsTagModalOpen(true)}
        uniqueCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
        userAvatar={userProfileInfo.userAvatar}
        currentUser={currentUser}
        onOpenAuth={(mode) => handleOpenAuthModal(mode || 'login')}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onCopy={handleCopy}
        copiedLabel={copiedLabel}
        onOpenCreditModal={() => setIsCreditModalOpen(true)}
      />

      {/* Main Left Sidebar Dashboard View with Recharts Live Platform Analytics */}
      <DashboardSidebarLayout
        currentProfile={currentProfile}
        onGenerateNext={() => {
          handleGenerateNext();
          handleToolUsed('ProfileNexus');
        }}
        isGenerating={isGenerating}
        filters={filters}
        onChangeFilters={(f) => setFilters(f)}
        tagConfig={tagConfig}
        onOpenTagEditor={() => setIsTagModalOpen(true)}
        uniqueCount={history.length}
        history={history}
        onCopy={handleCopy}
        copiedLabel={copiedLabel}
        layout={layout}
        onSelectLayout={(l) => setLayout(l)}
        currentUser={currentUser}
        onOpenAuth={(mode) => handleOpenAuthModal(mode || 'login')}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onEditProfile={() => setIsEditProfileOpen(true)}
        platformData={platformDataArr}
        toolUsageData={toolUsageDataArr}
        totalToolExecutions={totalToolExecutionsCount}
        onToolUsed={handleToolUsed}
        currentUserName={userProfileInfo.userName}
        totalGenerated={totalGeneratedCount}
        totalCopies={totalCopiesCount}
        onClearHistory={handleClearHistory}
        onLoadProfile={(p) => {
          setCurrentProfile(p);
          setToastMessage(`Loaded profile for ${p.fullName}`);
          setTimeout(() => setToastMessage(null), 2000);
        }}
        onRefreshGlobalState={refreshUserFromStore}
        onUnauthorizedAccess={(msg) => {
          setToastMessage(msg);
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />


      {/* Mobile Sticky Quick Action Bar */}
      {currentProfile && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between gap-2 shadow-2xl">
          <button
            onClick={() => handleCopy(currentProfile.firstName, 'First Name')}
            className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition"
          >
            {copiedLabel === 'First Name' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="truncate">1st Name</span>
          </button>

          <button
            onClick={() => handleCopy(currentProfile.lastName, 'Last Name')}
            className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition"
          >
            {copiedLabel === 'Last Name' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="truncate">Last Name</span>
          </button>

          <button
            onClick={handleGenerateNext}
            disabled={isGenerating}
            className="flex-1 py-2 px-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 active:scale-95 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Next</span>
          </button>
        </div>
      )}

      {/* Modals & Toast */}
      <TagEditorModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        tagConfig={tagConfig}
        onSave={(newCfg) => {
          setTagConfig(newCfg);
          setToastMessage(`Tag updated to: ${formatUserTag(newCfg)}`);
          setTimeout(() => setToastMessage(null), 2000);
        }}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={currentProfile}
        onSaveProfile={(updatedProfile) => {
          setCurrentProfile(updatedProfile);
          // Update profile in history memory if exists
          setHistory((prev) =>
            prev.map((item) => (item.id === updatedProfile.id ? updatedProfile : item))
          );
          setToastMessage(`Profile details updated for ${updatedProfile.fullName}!`);
          setTimeout(() => setToastMessage(null), 2500);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          setToastMessage('Generator settings updated!');
          setTimeout(() => setToastMessage(null), 2000);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authModalMode}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setToastMessage(`Welcome back, ${user.name}!`);
          setTimeout(() => setToastMessage(null), 2500);
        }}
        onLogout={() => {
          setCurrentUser(null);
          setToastMessage('Logged out successfully');
          setTimeout(() => setToastMessage(null), 2000);
        }}
        referredByCode={referredByCode}
      />

      <CreditDepletedModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        user={currentUser}
        onCopyRefLink={(link) => handleCopy(link, 'Referral Link')}
      />

      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        history={history}
        tagConfig={tagConfig}
        onUpdateTagConfig={(newConfig) => {
          setTagConfig(newConfig);
          setToastMessage('Tag preset updated');
          setTimeout(() => setToastMessage(null), 2000);
        }}
        uniqueCount={history.length}
        currentUser={currentUser}
        onOpenAuth={() => {
          setIsDashboardOpen(false);
          setIsAuthOpen(true);
        }}
        onLoadProfile={(p) => {
          setCurrentProfile(p);
          setToastMessage(`Loaded profile for ${p.fullName}`);
          setTimeout(() => setToastMessage(null), 2000);
        }}
        onClearHistory={handleClearHistory}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onSelectProfile={(p) => setCurrentProfile(p)}
        onCopy={handleCopy}
        copiedLabel={copiedLabel}
      />

      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
        userName={userProfileInfo.userName}
        userEmail={userProfileInfo.userEmail}
        userAvatar={userProfileInfo.userAvatar}
        tagConfig={tagConfig}
        onSaveProfile={(updated) => {
          setUserProfileInfo({
            userName: updated.userName,
            userEmail: updated.userEmail,
            userAvatar: updated.userAvatar,
          });
          setTagConfig((prev) => ({
            ...prev,
            prefix: updated.tagPrefix,
          }));
          try {
            localStorage.setItem(
              'fakenames_user_profile_info_v1',
              JSON.stringify({
                userName: updated.userName,
                userEmail: updated.userEmail,
                userAvatar: updated.userAvatar,
              })
            );
          } catch (e) {
            console.error(e);
          }
          setToastMessage('User profile details updated successfully!');
          setTimeout(() => setToastMessage(null), 2500);
        }}
      />

      <Toast message={toastMessage} />

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} ProfileNexus • Non-Repeating Identity Engine</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-mono font-semibold text-indigo-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              Social Acc Signup Ready
            </span>
          </div>
        </div>
      </footer>

      {/* Zero-Credit AdSense Monetization Modal */}
      {isCreditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-slate-100 relative overflow-hidden">
            
            {/* Header Aura */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20 shrink-0">
                <Zap className="w-7 h-7 fill-slate-950 animate-bounce" />
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-extrabold uppercase">
                  Zero Credit Alert
                </span>
                <h3 className="text-xl font-black text-white">Out of credits!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Out of credits! Watch ad or complete a task to earn more execution credits.
                </p>
              </div>
            </div>

            {/* Simulated Google AdSense Responsive Banner Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 space-y-3 text-center relative overflow-hidden">
              <div className="text-[10px] font-mono font-bold text-amber-400/80 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Google AdSense Sponsored Banner</span>
              </div>

              {isWatchingAd ? (
                <div className="py-6 space-y-3">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                  <p className="text-xs font-mono font-bold text-slate-200">Playing Sponsored Video Ad... (3s)</p>
                </div>
              ) : (
                <div className="py-4 space-y-2 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-950 p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-sm font-extrabold text-white">🚀 Unlock ProfileNexus Identity Suite Pro</div>
                  <p className="text-[11px] text-slate-300">Non-repeating identities & live 2FA validation suite.</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleWatchAdToEarn}
                disabled={isWatchingAd}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{isWatchingAd ? 'Crediting Account...' : 'Watch Sponsored Ad (+5 Credits)'}</span>
              </button>

              <button
                onClick={() => {
                  setIsCreditModalOpen(false);
                  setIsDashboardOpen(true);
                }}
                className="w-full py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg transition active:scale-98 flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" />
                <span>Earn Credits via CPA Tasks</span>
              </button>

              <button
                onClick={() => setIsCreditModalOpen(false)}
                className="w-full py-2 text-center text-xs font-extrabold text-slate-400 hover:text-slate-200 transition"
              >
                Close & Return Later
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

