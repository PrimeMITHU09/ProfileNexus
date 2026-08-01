import React, { useState } from 'react';
import { getApiUrl } from '../utils/apiConfig';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  avatarType?: 'image' | 'video';
  sizeClassName?: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  avatarType,
  sizeClassName = 'w-8 h-8',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const initialLetter = (name || 'U').charAt(0).toUpperCase();

  // Format avatar URL with proxy if it comes from Telegram CDN to bypass CORS/black screen
  const getProcessedUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('https://api.telegram.org') || url.startsWith('https://t.me')) {
      return getApiUrl(`/api/proxy-avatar?url=${encodeURIComponent(url)}`);
    }
    return url;
  };

  const processedUrl = getProcessedUrl(avatarUrl);
  const isVideo = avatarType === 'video' || (processedUrl && (processedUrl.includes('.mp4') || processedUrl.includes('.webm')));

  // Render Fallback Gradient Avatar with Initial Letter if no URL or error occurs
  if (!processedUrl || hasError) {
    return (
      <div
        className={`${sizeClassName} rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white font-black flex items-center justify-center text-xs shadow-sm shrink-0 border border-indigo-400/50 ${className}`}
      >
        <span>{initialLetter}</span>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className={`${sizeClassName} rounded-full overflow-hidden border border-indigo-500 shrink-0 shadow-sm ${className}`}>
        <video
          src={processedUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <img
      src={processedUrl}
      alt={name}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      className={`${sizeClassName} rounded-full border border-indigo-500 object-cover shrink-0 shadow-sm ${className}`}
    />
  );
};
