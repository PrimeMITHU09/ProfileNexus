/**
 * ProfileNexus AdSense Frequency Capping & Cooldown Manager
 * Enforces a 10-minute cooldown period between high-frequency ad triggers
 * to ensure 100% compliance with Google AdSense user experience guidelines.
 */

const LAST_AD_KEY = 'profilenexus_last_ad_shown_time';
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Checks if the ad cooldown period is currently active.
 * Returns true if an ad was displayed less than 10 minutes ago.
 */
export function isAdCooldownActive(): boolean {
  try {
    const lastTimeStr = localStorage.getItem(LAST_AD_KEY);
    if (!lastTimeStr) return false;

    const lastTime = parseInt(lastTimeStr, 10);
    if (isNaN(lastTime)) return false;

    const timePassed = Date.now() - lastTime;
    return timePassed < COOLDOWN_MS;
  } catch (e) {
    return false;
  }
}

/**
 * Calculates remaining cooldown time in minutes (rounded up).
 */
export function getAdCooldownRemainingMinutes(): number {
  try {
    const lastTimeStr = localStorage.getItem(LAST_AD_KEY);
    if (!lastTimeStr) return 0;

    const lastTime = parseInt(lastTimeStr, 10);
    if (isNaN(lastTime)) return 0;

    const remainingMs = COOLDOWN_MS - (Date.now() - lastTime);
    if (remainingMs <= 0) return 0;

    return Math.ceil(remainingMs / (60 * 1000));
  } catch (e) {
    return 0;
  }
}

/**
 * Records an ad impression timestamp to start the 10-minute cooldown timer.
 */
export function recordAdImpression(): void {
  try {
    localStorage.setItem(LAST_AD_KEY, Date.now().toString());
  } catch (e) {
    console.error('Error saving ad impression timestamp:', e);
  }
}
