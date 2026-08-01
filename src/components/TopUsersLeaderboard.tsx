import React, { useState } from 'react';
import { Trophy, Search, Sparkles, CheckCircle2, User, Flame, ArrowUpRight } from 'lucide-react';
import { getAllUsers } from '../utils/userStore';
import { UserAvatar } from './UserAvatar';

export interface TopUserItem {
  rank: number;
  name: string;
  tag: string;
  avatar: string;
  avatarType?: 'image' | 'video';
  score: number;
  topTool: string;
  isOnline: boolean;
  country: string;
}

interface TopUsersLeaderboardProps {
  currentUserName?: string;
  currentUserTag?: string;
}

export const TopUsersLeaderboard: React.FC<TopUsersLeaderboardProps> = ({
  currentUserName,
  currentUserTag
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const dbUsers = getAllUsers();
  
  // Sort users dynamically by credits & tool execution score
  const sortedDbUsers = [...dbUsers].sort((a, b) => {
    const scoreA = (a.credits || 0) + (a.referralCount || 0) * 500 + (a.savedProfilesCount || 0) * 10;
    const scoreB = (b.credits || 0) + (b.referralCount || 0) * 500 + (b.savedProfilesCount || 0) * 10;
    return scoreB - scoreA;
  });

  const usersList: TopUserItem[] = sortedDbUsers.slice(0, 30).map((u, idx) => ({
    rank: idx + 1,
    name: u.name,
    tag: u.referralCode || 'REF500',
    avatar: u.avatarUrl,
    avatarType: u.avatarType,
    score: (u.credits || 0) + (u.referralCount || 0) * 500 + (u.savedProfilesCount || 0) * 10,
    topTool: u.role === 'ADMIN' ? 'Check live UID Fb' : '2FA.Live Authenticator',
    isOnline: u.role === 'ADMIN' || idx < 3,
    country: u.role === 'ADMIN' ? 'US' : 'BD',
  }));

  const filteredUsers = usersList.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.topTool.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <Trophy className="w-5 h-5 animate-bounce" />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Top 30 Active Users Leaderboard
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time activity ranking based on tool executions & profile generations
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users or tags..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Leaderboard Table / Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase font-extrabold text-slate-400 tracking-wider">
              <th className="py-3 px-3">Rank</th>
              <th className="py-3 px-4">User Name</th>
              <th className="py-3 px-3">Tag Prefix</th>
              <th className="py-3 px-4">Top Used Tool</th>
              <th className="py-3 px-3 text-right">Executions</th>
              <th className="py-3 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {filteredUsers.map((user) => {
              const isTop3 = user.rank <= 3;
              const isFirst = user.rank === 1;

              return (
                <tr
                  key={user.rank}
                  className={`transition ${
                    isFirst
                      ? 'bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-amber-50/60 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-amber-950/30 font-bold'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Rank Column */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {user.rank === 1 && <span className="text-base">🥇</span>}
                      {user.rank === 2 && <span className="text-base">🥈</span>}
                      {user.rank === 3 && <span className="text-base">🥉</span>}
                      <span
                        className={`font-mono text-xs font-black ${
                          isTop3 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'
                        }`}
                      >
                        #{user.rank}
                      </span>
                    </div>
                  </td>

                  {/* User Name & Avatar Column */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar
                        name={user.name}
                        avatarUrl={user.avatar}
                        avatarType={user.avatarType}
                        sizeClassName="w-8 h-8"
                      />
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {isFirst && (
                            <span className="px-1.5 py-0.2 rounded-md bg-indigo-600 text-[9px] text-white font-mono uppercase">
                              YOU / ADMIN
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tag Column */}
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-extrabold border border-indigo-100 dark:border-indigo-900/60">
                      {user.tag}
                    </span>
                  </td>

                  {/* Top Used Tool */}
                  <td className="py-3 px-4">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">
                      {user.topTool}
                    </span>
                  </td>

                  {/* Executions / Score */}
                  <td className="py-3 px-3 text-right">
                    <span className="font-black text-slate-900 dark:text-slate-100 font-mono">
                      {user.score.toLocaleString()}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    {user.isOnline ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-400 font-medium text-[10px]">
                        Offline
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
