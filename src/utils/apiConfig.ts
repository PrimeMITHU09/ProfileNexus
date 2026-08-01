/**
 * Centralized API base URL resolver supporting both Vite environment variables (VITE_API_URL)
 * and Next.js / Vercel environment variables (NEXT_PUBLIC_API_URL).
 */
export const getApiUrl = (endpoint: string): string => {
  const baseUrl =
    (import.meta as any).env?.VITE_API_URL ||
    (process as any).env?.NEXT_PUBLIC_API_URL ||
    '';

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (baseUrl) {
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBase}${cleanEndpoint}`;
  }
  return cleanEndpoint;
};
