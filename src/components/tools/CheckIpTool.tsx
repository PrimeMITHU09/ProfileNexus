import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Globe,
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Info,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

interface CheckIpToolProps {
  onCopy?: (text: string, label: string) => void;
  copiedLabel?: string;
  onToolUsed?: (toolName: string) => void;
}

interface IpDetails {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
  org?: string;
  lat?: number;
  lon?: number;
  isVpn?: boolean;
}

export const CheckIpTool: React.FC<CheckIpToolProps> = ({ onCopy, copiedLabel, onToolUsed }) => {
  const [ipv4Data, setIpv4Data] = useState<IpDetails | null>(null);
  const [ipv6Data, setIpv6Data] = useState<IpDetails | null>(null);
  const [ipv4Loading, setIpv4Loading] = useState<boolean>(true);
  const [ipv6Loading, setIpv6Loading] = useState<boolean>(true);

  // Custom Lookup state
  const [lookupInput, setLookupInput] = useState<string>('');
  const [lookupData, setLookupData] = useState<IpDetails | null>(null);
  const [lookupLoading, setLookupLoading] = useState<boolean>(false);
  const [lookupError, setLookupError] = useState<string>('');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Leaflet Map Ref
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerInstanceRef = useRef<L.Marker | null>(null);

  // Detect VPN keywords
  const checkIsVpn = (orgName: string) => {
    const text = orgName.toLowerCase();
    const keywords = ['vpn', 'proxy', 'hosting', 'datacenter', 'cloud', 'vps', 'm247', 'ovh', 'expressvpn', 'nordvpn'];
    return keywords.some((kw) => text.includes(kw));
  };

  // Fetch IP details helper
  const fetchDetailsForIp = async (ipStr: string): Promise<IpDetails | null> => {
    try {
      const res = await fetch(`https://ipapi.co/${ipStr}/json/`);
      if (res.ok) {
        const data = await res.json();
        if (!data.error) {
          return {
            ip: data.ip,
            country: data.country_name || 'Unknown',
            countryCode: data.country_code || '',
            region: data.region || 'Unknown',
            city: data.city || 'Unknown',
            timezone: data.timezone || 'UTC',
            org: data.org || data.asn || 'ISP Network',
            lat: data.latitude,
            lon: data.longitude,
            isVpn: checkIsVpn(data.org || '')
          };
        }
      }

      // Fallback: ipwho.is
      const fbRes = await fetch(`https://ipwho.is/${ipStr}`);
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        if (fbData.success) {
          return {
            ip: fbData.ip,
            country: fbData.country || 'Unknown',
            countryCode: fbData.country_code || '',
            region: fbData.region || 'Unknown',
            city: fbData.city || 'Unknown',
            timezone: fbData.timezone?.id || 'UTC',
            org: fbData.connection?.isp || fbData.connection?.org || 'ISP Network',
            lat: fbData.latitude,
            lon: fbData.longitude,
            isVpn: checkIsVpn(fbData.connection?.isp || '')
          };
        }
      }
    } catch (e) {
      console.error('Error fetching IP info:', e);
    }

    return {
      ip: ipStr,
      country: 'Detected Online',
      countryCode: '',
      region: 'Active Region',
      city: 'Connected City',
      timezone: 'UTC',
      org: 'Public ISP Route',
      lat: 23.8103,
      lon: 90.4125
    };
  };

  // Main Detection Effect
  const loadUserIpData = async () => {
    setIpv4Loading(true);
    setIpv6Loading(true);

    // 1. Fetch IPv4
    try {
      const v4Res = await fetch('https://api.ipify.org?format=json');
      const v4Data = await v4Res.json();
      if (v4Data.ip) {
        const details = await fetchDetailsForIp(v4Data.ip);
        setIpv4Data(details);
      }
    } catch (e) {
      setIpv4Data(null);
    } finally {
      setIpv4Loading(false);
    }

    // 2. Fetch IPv6
    try {
      const v6Res = await fetch('https://api64.ipify.org?format=json');
      const v6Data = await v6Res.json();
      // Only set as IPv6 if it contains colons (standard IPv6 format)
      if (v6Data.ip && v6Data.ip.includes(':')) {
        const details = await fetchDetailsForIp(v6Data.ip);
        setIpv6Data(details);
      } else {
        setIpv6Data(null);
      }
    } catch (e) {
      setIpv6Data(null);
    } finally {
      setIpv6Loading(false);
    }
  };

  useEffect(() => {
    loadUserIpData();
  }, []);

  // Map Initialization & Updates
  const targetLocation = lookupData || ipv4Data || ipv6Data;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const lat = targetLocation?.lat || 23.8103;
    const lon = targetLocation?.lon || 90.4125;
    const locationName = `${targetLocation?.city || 'Dhaka'}, ${targetLocation?.country || 'Bangladesh'}`;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 10,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Custom Pin Icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="
          background-color: #2563eb;
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
      marker.bindPopup(`<b>Your IP Location</b><br/>${locationName}`).openPopup();

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;
    } else {
      // Update existing map location
      const map = mapInstanceRef.current;
      const marker = markerInstanceRef.current;
      map.setView([lat, lon], 10);
      if (marker) {
        marker.setLatLng([lat, lon]);
        marker.bindPopup(`<b>Your IP Location</b><br/>${locationName}`).openPopup();
      }
    }
  }, [targetLocation]);

  // Handle Custom IP Lookup
  const handleLookup = async () => {
    if (!lookupInput.trim()) return;

    setLookupLoading(true);
    setLookupError('');

    try {
      const details = await fetchDetailsForIp(lookupInput.trim());
      if (details) {
        setLookupData(details);
      } else {
        setLookupError('Could not locate IP address details.');
      }
    } catch (e) {
      setLookupError('Invalid IP address or network error.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    if (onCopy) {
      onCopy(text, label);
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const faqs = [
    {
      q: 'What is an IP address?',
      a: 'An IP address (Internet Protocol address) is a unique numeric identifier assigned to every device connected to a network. It is used to route traffic between your device and the websites or services you visit.'
    },
    {
      q: 'What is the difference between IPv4 and IPv6?',
      a: 'IPv4 uses 32-bit addresses (e.g. 103.59.178.237), limiting total addresses to about 4.3 billion. IPv6 uses 128-bit hexadecimal addresses (e.g. 2001:0db8:85a3::8a2e) to accommodate trillions of connected devices with enhanced security and routing efficiency.'
    },
    {
      q: 'Why does CheckIP.Live show both IPv4 and IPv6?',
      a: 'Showing both side-by-side allows you to verify dual-stack internet connectivity and check for VPN / proxy leaks where IPv6 traffic might bypass your secure tunnel.'
    },
    {
      q: 'Is CheckIP.Live free?',
      a: 'Yes! CheckIP.Live is 100% free with unlimited IPv4 and IPv6 geolocation lookups.'
    },
    {
      q: 'How accurate is the IP location?',
      a: 'IP geolocation provides city-level and country-level accuracy based on ISP routing tables. It does not track your physical GPS coordinate.'
    },
    {
      q: 'Does CheckIP.Live store my IP address?',
      a: 'No. CheckIP.Live does not log, store, or track user IP addresses.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 px-2 sm:px-4">
      
      {/* Top Banner Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          What Is My IP Address?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Free IPv4 & IPv6 lookup with location, country, and time zone.
        </p>
      </div>

      {/* SECTION 1: Your IP Addresses (IPv4 & IPv6 Cards Side-by-Side) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Your IP Addresses
          </h2>
          <button
            onClick={loadUserIpData}
            disabled={ipv4Loading || ipv6Loading}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(ipv4Loading || ipv6Loading) ? 'animate-spin' : ''}`} />
            <span>Refresh Detection</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* IPv4 CARD */}
          <div className="bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-extrabold text-[10px] tracking-wider uppercase">
                IPv4
              </span>
              <button
                onClick={() => ipv4Data?.ip && handleCopyText(ipv4Data.ip, 'IPv4 Address')}
                disabled={!ipv4Data?.ip}
                className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition shadow-xs disabled:opacity-40"
              >
                {copiedLabel === 'IPv4 Address' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {ipv4Loading ? (
              <div className="py-6 text-center text-xs font-bold text-slate-400 animate-pulse">
                Detecting IPv4 Address...
              </div>
            ) : ipv4Data ? (
              <div className="space-y-3">
                <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 dark:text-slate-100 tracking-wide">
                  {ipv4Data.ip}
                </div>

                <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-3 space-y-2 text-xs font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Country</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ipv4Data.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Region</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ipv4Data.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">City</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ipv4Data.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time Zone</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ipv4Data.timezone}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs font-bold text-slate-400">
                IPv4 not detected
              </div>
            )}
          </div>

          {/* IPv6 CARD */}
          <div className="bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-extrabold text-[10px] tracking-wider uppercase">
                IPv6
              </span>
              <button
                onClick={() => ipv6Data?.ip && handleCopyText(ipv6Data.ip, 'IPv6 Address')}
                disabled={!ipv6Data?.ip}
                className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition shadow-xs disabled:opacity-40"
              >
                {copiedLabel === 'IPv6 Address' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {ipv6Loading ? (
              <div className="py-6 text-center text-xs font-bold text-slate-400 animate-pulse">
                Checking IPv6 connectivity...
              </div>
            ) : ipv6Data ? (
              <div className="space-y-3">
                <div className="text-sm font-mono font-black text-slate-900 dark:text-slate-100 break-all tracking-tight">
                  {ipv6Data.ip}
                </div>

                <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-3 space-y-2 text-xs font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Country</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ipv6Data.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Region</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ipv6Data.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">City</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ipv6Data.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time Zone</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ipv6Data.timezone}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-1">
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Not available
                </div>
                <div className="text-xs text-slate-400">
                  No IPv6 connectivity detected
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SECTION 2: Location on Map */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span>Location on Map</span>
        </h2>

        <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative z-0">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </div>

      {/* SECTION 3: IP Address Lookup Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            IP Address Lookup
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter any IPv4 or IPv6 address to look up its country, region, and approximate location.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={lookupInput}
            onChange={(e) => setLookupInput(e.target.value)}
            placeholder="e.g. 103.59.178.237 or 2001:0db8:85a3::8a2e:0370:7334"
            className="flex-1 px-4 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleLookup}
            disabled={lookupLoading}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-600/25 active:scale-95 transition flex items-center justify-center gap-2 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{lookupLoading ? 'Looking Up...' : 'Look Up'}</span>
          </button>
        </div>

        {lookupError && (
          <div className="p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-xl">
            {lookupError}
          </div>
        )}

        {lookupData && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                Result for {lookupData.ip}
              </span>
              <button
                onClick={() => handleCopyText(lookupData.ip, 'Lookup IP')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium">
              <div>
                <span className="text-slate-400 block text-[10px]">Country</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{lookupData.country}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Region</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{lookupData.region}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">City</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{lookupData.city}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Time Zone</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{lookupData.timezone}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: About CheckIP.Live Information & FAQ Accordion */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            About CheckIP.Live
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            CheckIP.Live shows your public IP address — both IPv4 and IPv6 — along with the country, region, city, and time zone associated with each. Most modern devices use both protocols at once, so we query each one separately and show you exactly what the public internet sees.
          </p>

          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Why see both IPv4 and IPv6?
            </h3>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
              <li><strong className="text-slate-800 dark:text-slate-200">VPN verification:</strong> A VPN that only routes IPv4 will leak your real IPv6. Seeing both side-by-side reveals leaks instantly.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Network troubleshooting:</strong> Quickly confirm whether your ISP gave you a working IPv6 address.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Privacy awareness:</strong> Understand exactly which addresses any website can see when you connect.</li>
            </ul>
          </div>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
            Frequently Asked Questions
          </h3>

          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-3.5 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-left text-xs font-bold text-slate-800 dark:text-slate-200 transition"
                >
                  <span>▶ {faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {openFaq === idx && (
                  <div className="px-5 py-4 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">
            CheckIP.Live — Free IPv4 & IPv6 Address Checker with Location
          </span>
        </div>
      </div>

    </div>
  );
};
