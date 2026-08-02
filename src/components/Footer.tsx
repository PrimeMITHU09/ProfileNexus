import React, { useEffect, useState } from 'react';
import { Layers, ShieldCheck, FileText, Mail, Info, Heart, Zap } from 'lucide-react';
import { isAdCooldownActive, getAdCooldownRemainingMinutes } from '../utils/adManager';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onOpenAbout,
}) => {
  const [cooldownMinutes, setCooldownMinutes] = useState<number>(0);
  const [isCooldownActive, setIsCooldownActive] = useState<boolean>(false);

  useEffect(() => {
    const checkCooldown = () => {
      const active = isAdCooldownActive();
      setIsCooldownActive(active);
      if (active) {
        setCooldownMinutes(getAdCooldownRemainingMinutes());
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 py-10 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Section: Brand & Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                ProfileNexus
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An all-in-one platform for synthetic profile generation, real-time social account status verification, 2FA.Live TOTP authentication, and IP security diagnostic tools.
            </p>

            {/* AdSense Compliance Badge */}
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                AdSense Verified: <code className="text-amber-400">ca-pub-4741085747836613</code>
              </span>
              {isCooldownActive && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  Ad-Free ({cooldownMinutes}m)
                </span>
              )}
            </div>
          </div>

          {/* Quick Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-indigo-400 transition flex items-center gap-1.5 text-slate-400"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-indigo-400 transition flex items-center gap-1.5 text-slate-400"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-indigo-400 transition flex items-center gap-1.5 text-slate-400"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Support</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-indigo-400 transition flex items-center gap-1.5 text-slate-400"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>About ProfileNexus</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Support & Inquiries
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p>Email: <span className="text-slate-200 font-mono">support@profilenexus.com</span></p>
              <p>Telegram: <span className="text-slate-200 font-mono">@ProfileNexus_bot</span></p>
              <p className="text-[11px] text-slate-500 font-mono pt-1">Response Time: &lt; 24 hours</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ProfileNexus Suite. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            <span>for privacy & security professionals</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
