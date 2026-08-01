import React, { useEffect, useState } from 'react';
import { Sparkles, Megaphone } from 'lucide-react';

interface AdBannerProps {
  slotId?: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slotId = 'default-slot', className = '' }) => {
  const [adsEnabled, setAdsEnabled] = useState<boolean>(true);
  const [scriptCode, setScriptCode] = useState<string>('');

  useEffect(() => {
    // Fetch live AdSense settings from backend
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.adsEnabled !== undefined) {
          setAdsEnabled(data.adsEnabled);
        }
        if (data.adsScriptCode) {
          setScriptCode(data.adsScriptCode);
        }
      })
      .catch(() => {
        // Default to showing Ad banner placeholder
      });
  }, []);

  if (!adsEnabled) return null;

  return (
    <div className={`w-full my-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 text-white shadow-lg overflow-hidden relative ${className}`}>
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 font-extrabold text-[10px] uppercase border border-amber-500/30 flex items-center gap-1">
            <Megaphone className="w-3 h-3 text-amber-400" />
            SPONSORED AD
          </span>
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
            ProfileNexus Verified Partner Announcement
          </span>
        </div>

        <span className="text-[10px] font-mono text-slate-500 uppercase">
          Slot ID: {slotId}
        </span>
      </div>

      {scriptCode ? (
        <div
          className="mt-3 text-center text-xs"
          dangerouslySetInnerHTML={{ __html: scriptCode }}
        />
      ) : (
        <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
          <div className="font-extrabold text-sm text-indigo-300 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Premium Identity & Automation Tools Suite</span>
          </div>
          <p className="text-slate-400 text-xs">
            Earn 500 Credits per referral by inviting colleagues via Telegram!
          </p>
        </div>
      )}
    </div>
  );
};
