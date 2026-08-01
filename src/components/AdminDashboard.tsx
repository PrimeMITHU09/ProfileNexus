import React, { useState, useEffect } from 'react';
import { AuthUser, IpRecord, ToolStatus, AuditLog } from '../types';
import { UserAvatar } from './UserAvatar';
import {
  getAllUsers,
  saveUser,
  getToolStatuses,
  toggleToolMaintenance,
  getAuditLogs,
  logAuditAction
} from '../utils/userStore';
import {
  getIpRecords,
  toggleIpBlacklist
} from '../utils/ipGuard';
import {
  ShieldAlert,
  Users,
  Zap,
  Globe,
  Activity,
  ToggleLeft,
  ToggleRight,
  Plus,
  Minus,
  Ban,
  CheckCircle,
  Crown,
  Search,
  Filter,
  RefreshCw,
  Video,
  FileText,
  AlertTriangle,
  Server,
  Lock,
  Unlock,
  UserCheck,
  Send,
  Sliders,
  Terminal,
  ShieldCheck,
  Megaphone
} from 'lucide-react';

interface AdminDashboardProps {
  currentAdmin: AuthUser;
  onRefreshGlobalState?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdmin,
  onRefreshGlobalState,
}) => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [ipRecords, setIpRecords] = useState<IpRecord[]>([]);
  const [toolStatuses, setToolStatuses] = useState<ToolStatus[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Ads Manager State
  const [adsEnabled, setAdsEnabled] = useState<boolean>(true);
  const [adsScriptCode, setAdsScriptCode] = useState<string>('');
  const [adsSavedNotice, setAdsSavedNotice] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');
  const [adminTab, setAdminTab] = useState<'users' | 'ip-inspector' | 'api-health' | 'tool-toggles' | 'ads-manager' | 'audit-logs'>('users');

  // Custom credit modal state
  const [creditInputModal, setCreditInputModal] = useState<{ isOpen: boolean; userId: string; userName: string; currentCredits: number } | null>(null);
  const [customCreditAmount, setCustomCreditAmount] = useState<number>(100);

  const loadData = () => {
    setUsers(getAllUsers());
    setIpRecords(getIpRecords());
    setToolStatuses(getToolStatuses());
    setAuditLogs(getAuditLogs());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Credit Modifications
  const handleModifyCredits = (userId: string, delta: number) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const newCredits = Math.max(0, target.credits + delta);
    const updated = { ...target, credits: newCredits };
    saveUser(updated);
    logAuditAction('CREDITS_MODIFIED', currentAdmin.name, target.email, `Adjusted credits by ${delta > 0 ? '+' + delta : delta} (New Balance: ${newCredits})`);
    loadData();
    if (onRefreshGlobalState) onRefreshGlobalState();
  };

  // Toggle Unlimited/Premium
  const handleToggleUnlimited = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const updated = { ...target, isUnlimited: !target.isUnlimited };
    saveUser(updated);
    logAuditAction('PREMIUM_TOGGLED', currentAdmin.name, target.email, `Set Unlimited Access to ${!target.isUnlimited}`);
    loadData();
    if (onRefreshGlobalState) onRefreshGlobalState();
  };

  // Toggle Role
  const handleToggleRole = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const newRole = target.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const updated = { ...target, role: newRole as 'ADMIN' | 'USER' };
    saveUser(updated);
    logAuditAction('ROLE_CHANGED', currentAdmin.name, target.email, `Changed role from ${target.role} to ${newRole}`);
    loadData();
    if (onRefreshGlobalState) onRefreshGlobalState();
  };

  // Toggle Ban/Unban
  const handleToggleBan = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const updated = { ...target, isBanned: !target.isBanned };
    saveUser(updated);
    logAuditAction('BAN_STATUS_CHANGED', currentAdmin.name, target.email, `Account ${!target.isBanned ? 'BANNED' : 'UNBANNED'}`);
    loadData();
    if (onRefreshGlobalState) onRefreshGlobalState();
  };

  // Toggle Tool Maintenance Switch
  const handleToggleToolMaintenance = (toolId: string) => {
    const updated = toggleToolMaintenance(toolId);
    setToolStatuses(updated);
    logAuditAction('TOOL_MAINTENANCE_TOGGLED', currentAdmin.name, undefined, `Toggled maintenance status for tool: ${toolId}`);
    if (onRefreshGlobalState) onRefreshGlobalState();
  };

  // Toggle IP Blacklist
  const handleToggleIpBlacklist = (ip: string) => {
    const updated = toggleIpBlacklist(ip);
    setIpRecords(updated);
    logAuditAction('IP_BLACKLIST_TOGGLED', currentAdmin.name, undefined, `Toggled blacklist status for IP: ${ip}`);
    if (onRefreshGlobalState) onRefreshGlobalState();
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.telegramUsername && u.telegramUsername.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.registeredIp.includes(searchTerm);
    const matchesRole = roleFilter === 'ALL' ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 border border-indigo-500/30 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 shadow-lg">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">Admin Control Panel</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs border border-emerald-500/30">
                  ● SYSTEM ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Full user telemetry, live credit management, IP anti-abuse inspector & tool remote switches
              </p>
            </div>
          </div>

          <button
            onClick={loadData}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync Live Telemetry</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {users.length}
          </div>
          <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            {users.filter((u) => u.role === 'ADMIN').length} Admins • {users.filter((u) => u.isUnlimited).length} Premium
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total Active Credits</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {users.reduce((acc, u) => acc + (u.credits || 0), 0).toLocaleString()}
          </div>
          <div className="text-[10px] font-semibold text-slate-500">
            Across all active members
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Monitored IPs</span>
            <Globe className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {ipRecords.length}
          </div>
          <div className="text-[10px] font-semibold text-red-500">
            {ipRecords.filter((r) => r.isBlacklisted).length} IPs Blacklisted
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Tools Health</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {toolStatuses.filter((t) => !t.isMaintenance).length} / {toolStatuses.length}
          </div>
          <div className="text-[10px] font-semibold text-slate-500">
            {toolStatuses.filter((t) => t.isMaintenance).length} in Maintenance
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
            adminTab === 'users'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Activity & Credits</span>
        </button>

        <button
          onClick={() => setAdminTab('ip-inspector')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
            adminTab === 'ip-inspector'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>IP Inspector & Anti-Abuse</span>
        </button>

        <button
          onClick={() => setAdminTab('tool-toggles')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
            adminTab === 'tool-toggles'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Remote Tool Toggles</span>
        </button>

        <button
          onClick={() => setAdminTab('api-health')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
            adminTab === 'api-health'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>API Health & Latency</span>
        </button>

        <button
          onClick={() => setAdminTab('ads-manager')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
            adminTab === 'ads-manager'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Megaphone className="w-4 h-4 text-amber-500" />
          <span>Ads Script & Banner Toggle</span>
        </button>

        <button
          onClick={() => setAdminTab('audit-logs')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
            adminTab === 'audit-logs'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: User Activity & Manual Credit Management */}
      {adminTab === 'users' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, Telegram, IP, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
              <span className="font-bold text-slate-500">Role Filter:</span>
              {(['ALL', 'ADMIN', 'USER'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    roleFilter === role
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* User Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">User Profile & Avatar</th>
                  <th className="p-3.5">Telegram / Email</th>
                  <th className="p-3.5">Registered IP</th>
                  <th className="p-3.5">Credits / Access</th>
                  <th className="p-3.5">Referrals</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${u.isBanned ? 'bg-red-500/5' : ''}`}>
                    
                    {/* User Avatar (Image or Live Video) & Live Status Indicator */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <UserAvatar
                            name={u.name}
                            avatarUrl={u.avatarUrl}
                            avatarType={u.avatarType}
                            sizeClassName="w-10 h-10"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                              u.id === currentAdmin.id || u.role === 'ADMIN'
                                ? 'bg-emerald-500 animate-pulse shadow-sm'
                                : 'bg-slate-400'
                            }`}
                            title={u.id === currentAdmin.id || u.role === 'ADMIN' ? 'Status: Online Active' : 'Status: Offline'}
                          />
                        </div>

                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.isUnlimited && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 text-[9px] font-black uppercase">
                                PRO
                              </span>
                            )}
                            {u.isBanned && (
                              <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-500 text-[9px] font-black uppercase">
                                BANNED
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            ID: {u.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Telegram & Email */}
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        {u.telegramUsername ? (
                          <span className="inline-flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400">
                            <Send className="w-3 h-3" />
                            @{u.telegramUsername}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">No Telegram</span>
                        )}
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[160px]">
                          {u.email}
                        </div>
                      </div>
                    </td>

                    {/* Registered IP */}
                    <td className="p-3.5">
                      <span className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                        {u.registeredIp || '127.0.0.1'}
                      </span>
                    </td>

                    {/* Credits / Access */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-black text-amber-600 dark:text-amber-400 text-sm">
                          <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                          <span>{u.isUnlimited ? '∞ Unlimited' : `${u.credits} Credits`}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px]">
                          <button
                            onClick={() => handleModifyCredits(u.id, 100)}
                            className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded hover:bg-emerald-500/20 font-bold"
                          >
                            +100
                          </button>
                          <button
                            onClick={() => handleModifyCredits(u.id, 500)}
                            className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded hover:bg-emerald-500/20 font-bold"
                          >
                            +500
                          </button>
                          <button
                            onClick={() => setCreditInputModal({ isOpen: true, userId: u.id, userName: u.name, currentCredits: u.credits })}
                            className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-500/20 font-bold"
                          >
                            Custom
                          </button>
                          <button
                            onClick={() => handleModifyCredits(u.id, -50)}
                            className="px-1.5 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded hover:bg-red-500/20 font-bold"
                          >
                            -50
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Referrals */}
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {u.referralCount || 0} Invites
                        </div>
                        <div className="text-[10px] font-mono text-indigo-500 font-semibold">
                          Code: {u.referralCode || 'N/A'}
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleRole(u.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider transition ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {u.role}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleUnlimited(u.id)}
                          title={u.isUnlimited ? 'Revoke Premium' : 'Grant Unlimited Premium'}
                          className={`p-1.5 rounded-lg transition ${
                            u.isUnlimited
                              ? 'bg-amber-500 text-white shadow-md'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-500'
                          }`}
                        >
                          <Crown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleBan(u.id)}
                          title={u.isBanned ? 'Unban User' : 'Ban User'}
                          className={`p-1.5 rounded-lg transition ${
                            u.isBanned
                              ? 'bg-red-600 text-white shadow-md'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500'
                          }`}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: IP Inspector & Anti-Abuse */}
      {adminTab === 'ip-inspector' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-sky-400" />
                <span>Anti-Abuse IP Guard & Multi-Account Inspector</span>
              </h3>
              <p className="text-xs text-slate-400">
                Prevents creation of multiple free trial accounts from the exact same IP address.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/30">
              {ipRecords.filter((r) => r.isBlacklisted).length} Blacklisted IPs
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 uppercase text-[10px]">
                  <th className="p-3.5">IP Address</th>
                  <th className="p-3.5">Associated Accounts</th>
                  <th className="p-3.5">Location / Network</th>
                  <th className="p-3.5">Last Registration</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {ipRecords.map((r) => (
                  <tr key={r.ip} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {r.ip}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        r.userCount > 1 ? 'bg-amber-500/20 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {r.userCount} Account(s)
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 dark:text-slate-400">
                      {r.location || 'Unknown Location'}
                    </td>
                    <td className="p-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {new Date(r.lastAttemptAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">
                      {r.isBlacklisted ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-[10px] border border-red-500/20">
                          ⛔ Blacklisted
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                          ✓ Allowed
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleToggleIpBlacklist(r.ip)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                          r.isBlacklisted
                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                            : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20'
                        }`}
                      >
                        {r.isBlacklisted ? 'Unblock / Whitelist' : 'Blacklist IP'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Remote Tool Toggles (Emergency Switches) */}
      {adminTab === 'tool-toggles' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
            <h3 className="font-bold flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-500" />
              <span>Remote Tool Emergency Switches & Maintenance Mode</span>
            </h3>
            <p className="text-xs mt-1 text-amber-800 dark:text-amber-300">
              Toggle any tool into Maintenance Mode to lock tool execution for all non-admin users instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toolStatuses.map((tool) => (
              <div
                key={tool.id}
                className={`p-5 rounded-2xl border transition shadow-sm space-y-4 ${
                  tool.isMaintenance
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-500/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                      Category: {tool.category}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                      {tool.name}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleToggleToolMaintenance(tool.id)}
                    className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition active:scale-95 ${
                      tool.isMaintenance
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                        : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    }`}
                  >
                    {tool.isMaintenance ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>MAINTENANCE ON</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>TOOL ACTIVE</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="text-[10px] text-slate-400 font-bold">Success Rate</div>
                    <div className="font-extrabold text-emerald-500">{tool.successRate}%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="text-[10px] text-slate-400 font-bold">Avg Latency</div>
                    <div className="font-extrabold text-sky-500">{tool.avgLatency} ms</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="text-[10px] text-slate-400 font-bold">Total Calls</div>
                    <div className="font-extrabold text-slate-700 dark:text-slate-300">{tool.totalCalls}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: API Health & Real-time Status Monitor */}
      {adminTab === 'api-health' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800">
            <h3 className="font-bold flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <span>Real-time API Health & Latency Monitor</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live status for Facebook Graph UID, Instagram Scraper, 2FA OTP Engine & IP Lookup
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {toolStatuses.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                    {t.lastStatus}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Target Uptime:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">99.9%</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Average Latency:</span>
                    <span className="font-mono font-bold text-sky-500">{t.avgLatency}ms</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Failed Requests:</span>
                    <span className="font-mono font-bold text-red-500">{t.failedCalls}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${t.successRate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Ads Script & Banner Toggle */}
      {adminTab === 'ads-manager' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold flex items-center gap-2 text-base">
                <Megaphone className="w-5 h-5 text-amber-500" />
                <span>AdSense & Monetag Banner Manager</span>
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                Toggle site-wide banner ads On/Off or inject custom AdSense / Monetag HTML script snippets.
              </p>
            </div>

            <button
              onClick={() => {
                const nextState = !adsEnabled;
                setAdsEnabled(nextState);
                fetch('/api/admin/settings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ adsEnabled: nextState, adsScriptCode }),
                }).catch(() => {});
                logAuditAction('ADS_TOGGLED', currentAdmin.name, undefined, `Set Ads Enabled to ${nextState}`);
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 transition active:scale-95 ${
                adsEnabled
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {adsEnabled ? '✓ ADS ENABLED' : '⛔ ADS DISABLED'}
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            {adsSavedNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold text-xs">
                {adsSavedNotice}
              </div>
            )}

            <div>
              <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
                Custom HTML / JS AdScript Snippet (AdSense / Monetag / PropellerAds)
              </label>
              <textarea
                rows={5}
                placeholder="<script async src='https://pagead2.googlesyndication.com/...'></script>"
                value={adsScriptCode}
                onChange={(e) => setAdsScriptCode(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  fetch('/api/admin/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ adsEnabled, adsScriptCode }),
                  }).catch(() => {});
                  logAuditAction('ADS_SCRIPT_UPDATED', currentAdmin.name, undefined, 'Updated AdSense HTML script snippet');
                  setAdsSavedNotice('AdSense script code saved successfully!');
                  setTimeout(() => setAdsSavedNotice(null), 3000);
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition active:scale-95"
              >
                Save Ad Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Audit Logs */}
      {adminTab === 'audit-logs' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800">
            <h3 className="font-bold flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <span>Admin Action Audit Logs</span>
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden text-xs">
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 flex items-center justify-between gap-4 font-mono">
                  <div>
                    <span className="font-bold text-indigo-500">[{log.action}]</span>{' '}
                    <span className="text-slate-800 dark:text-slate-200">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Credit Input Modal */}
      {creditInputModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Transfer Custom Credits</span>
            </h3>
            <p className="text-xs text-slate-500">
              User: <strong className="text-slate-800 dark:text-slate-200">{creditInputModal.userName}</strong> (Current: {creditInputModal.currentCredits} Cr)
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Credit Amount to Add
              </label>
              <input
                type="number"
                value={customCreditAmount}
                onChange={(e) => setCustomCreditAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 justify-end pt-2">
              <button
                onClick={() => setCreditInputModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleModifyCredits(creditInputModal.userId, customCreditAmount);
                  setCreditInputModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition active:scale-95"
              >
                Transfer Credits
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
