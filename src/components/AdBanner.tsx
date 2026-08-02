import React, { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles, Megaphone, Info } from 'lucide-react';
import { isAdCooldownActive, getAdCooldownRemainingMinutes, recordAdImpression } from '../utils/adManager';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdBannerProps {
  slotId?: string;
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  enforceCooldown?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = '1234567890',
  className = '',
  format = 'auto',
  responsive = true,
  enforceCooldown = false,
}) => {
  const [adLoaded, setAdLoaded] = useState<boolean>(false);
  const [adError, setAdError] = useState<boolean>(false);
  const [cooldownActive, setCooldownActive] = useState<boolean>(false);
  const [remainingCooldownMinutes, setRemainingCooldownMinutes] = useState<number>(0);

  useEffect(() => {
    // Check if cooldown enforcement is enabled for this slot
    if (enforceCooldown && isAdCooldownActive()) {
      setCooldownActive(true);
      setRemainingCooldownMinutes(getAdCooldownRemainingMinutes());
      return;
    }

    try {
      // Safely initialize AdSense push
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setAdLoaded(true);
      recordAdImpression();
    } catch (e) {
      console.warn('AdSense initialization notice:', e);
      setAdError(true);
    }
  }, [slotId, enforceCooldown]);

  // Render Cooldown Notice if Ad Frequency Capping is active
  if (cooldownActive) {
    return (
      <div className={`w-full my-3 p-3 rounded-xl bg-slate-900/60 border border-indigo-500/20 text-slate-300 shadow-sm overflow-hidden text-xs flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] uppercase border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Ad-Free Mode
          </span>
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
            Smart Frequency Capping Active ({remainingCooldownMinutes}m cooldown remaining)
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          Google AdSense Compliant
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full my-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 text-white shadow-lg overflow-hidden relative ${className}`}>
      {/* Top Banner Header */}
      <div className="flex items-center justify-between gap-3 text-xs mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-amber-500/20 text-amber-400 font-extrabold text-[10px] uppercase border border-amber-500/30 flex items-center gap-1">
            <Megaphone className="w-3 h-3 text-amber-400" />
            SPONSORED ADVERTISEMENT
          </span>
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
            ProfileNexus Verified Ad
          </span>
        </div>

        <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-500" />
          AdSense Unit
        </span>
      </div>

      {/* Official AdSense Container */}
      <div className="w-full flex justify-center items-center min-h-[90px] bg-slate-950/40 rounded-xl border border-white/5 p-2 overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client="ca-pub-4741085747836613"
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>

      {/* Fallback / Verification Notice when in preview or blocked */}
      {adError && (
        <div className="mt-2 text-center text-[11px] text-slate-400 font-mono">
          AdSense Publisher ID <code className="text-amber-400 font-bold">ca-pub-4741085747836613</code> active. Ads will populate after site approval.
        </div>
      )}
    </div>
  );
};
