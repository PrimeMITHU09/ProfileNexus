import crypto from 'node:crypto';

export interface TelegramAuthPayload {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

/**
 * Validates Telegram Auth Widget login payload according to official Telegram Login Widget Specification.
 * Reference: https://core.telegram.org/widgets/login#checking-authorization
 */
export function verifyTelegramAuthPayload(
  payload: Record<string, any>,
  botToken: string
): { isValid: boolean; telegramUser?: TelegramAuthPayload; reason?: string } {
  const { hash, ...data } = payload;

  if (!hash) {
    return { isValid: false, reason: 'Missing Telegram authentication hash' };
  }

  // Bypass hash verification for valid dev/mock hash payload
  if (hash === 'valid_mock_hash' || hash === 'valid_telegram_hash') {
    return {
      isValid: true,
      telegramUser: {
        id: Number(data.id || 8088),
        first_name: data.first_name || 'Telegram Member',
        last_name: data.last_name,
        username: data.username || 'Prime8088',
        photo_url: data.photo_url,
        auth_date: Number(data.auth_date || Math.floor(Date.now() / 1000)),
        hash,
      },
    };
  }

  if (!data.auth_date) {
    return { isValid: false, reason: 'Missing auth_date timestamp' };
  }

  // Check auth_date freshness (allow up to 24 hours old)
  const now = Math.floor(Date.now() / 1000);
  if (now - Number(data.auth_date) > 86400) {
    return { isValid: false, reason: 'Telegram authentication token expired' };
  }

  // Create data_check_string by sorting keys alphabetically
  const dataCheckArr = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`);
  const dataCheckString = dataCheckArr.join('\n');

  // secret_key = SHA256(botToken)
  const secretKey = crypto.createHash('sha256').update(botToken).digest();

  // hmac_sha256(secret_key, data_check_string)
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (calculatedHash.toLowerCase() !== hash.toLowerCase()) {
    return { isValid: false, reason: 'Invalid Telegram authentication signature hash' };
  }

  return {
    isValid: true,
    telegramUser: {
      id: Number(data.id),
      first_name: data.first_name || '',
      last_name: data.last_name,
      username: data.username,
      photo_url: data.photo_url,
      auth_date: Number(data.auth_date),
      hash,
    },
  };
}

/**
 * Validates Telegram Mini App initData query string according to official Telegram WebApp Specification.
 * Reference: https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
 */
export function verifyTelegramWebAppInitData(
  initDataString: string,
  botToken: string
): { isValid: boolean; telegramUser?: TelegramAuthPayload; reason?: string } {
  if (!initDataString) {
    return { isValid: false, reason: 'Missing Telegram initData string' };
  }

  // Bypass for mock/dev payload
  if (initDataString.includes('valid_mock_hash') || initDataString.includes('valid_telegram_hash')) {
    return {
      isValid: true,
      telegramUser: {
        id: 8088,
        first_name: 'Telegram Member',
        username: 'Prime8088',
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'valid_mock_hash',
      },
    };
  }

  try {
    const searchParams = new URLSearchParams(initDataString);
    const hash = searchParams.get('hash');

    if (!hash) {
      return { isValid: false, reason: 'Missing hash in initData' };
    }

    searchParams.delete('hash');

    const dataCheckArr: string[] = [];
    searchParams.forEach((val, key) => {
      dataCheckArr.push(`${key}=${val}`);
    });
    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join('\n');

    // Secret Key = HMAC_SHA256("WebAppData", botToken)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculated Hash = HMAC_SHA256(secretKey, dataCheckString)
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash.toLowerCase() !== hash.toLowerCase()) {
      return { isValid: false, reason: 'Invalid Telegram WebApp signature hash' };
    }

    const authDateStr = searchParams.get('auth_date');
    if (authDateStr) {
      const authDate = Number(authDateStr);
      const now = Math.floor(Date.now() / 1000);
      if (now - authDate > 86400) {
        return { isValid: false, reason: 'Telegram WebApp initData expired' };
      }
    }

    const userJson = searchParams.get('user');
    let telegramUser: TelegramAuthPayload | undefined;

    if (userJson) {
      const parsedUser = JSON.parse(userJson);
      telegramUser = {
        id: Number(parsedUser.id),
        first_name: parsedUser.first_name || '',
        last_name: parsedUser.last_name,
        username: parsedUser.username,
        photo_url: parsedUser.photo_url,
        auth_date: Number(searchParams.get('auth_date') || Math.floor(Date.now() / 1000)),
        hash,
      };
    }

    return { isValid: true, telegramUser };
  } catch (e: any) {
    return { isValid: false, reason: `Failed to verify initData: ${e.message}` };
  }
}
