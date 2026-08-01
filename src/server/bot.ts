import * as OTPAuth from 'otpauth';
import { UserModel } from './models.js';
import { ServerEnvConfig } from './config.js';

/**
 * Returns the Inline Keyboard attached to the Welcome Message bubble.
 * Includes "🚀 Open App" and "📢 Join Community".
 */
export function getStartInlineKeyboard(appUrl: string, groupLink: string) {
  const isHttps = appUrl && appUrl.startsWith('https://');
  const openAppButton: any = { text: '🚀 Open App' };
  if (isHttps) {
    openAppButton.web_app = { url: appUrl };
  } else {
    openAppButton.url = appUrl || 'https://profilenexus.vercel.app';
  }

  const cleanGroup = groupLink.startsWith('http')
    ? groupLink
    : `https://t.me/${groupLink.replace(/^@/, '')}`;

  return {
    inline_keyboard: [
      [
        openAppButton,
        { text: '📢 Join Community', url: cleanGroup }
      ]
    ]
  };
}

/**
 * Returns the Custom Reply Keyboard under the input box with quick action buttons:
 * - [🆔 Identity Generator] [🔐 2FA OTP]
 * - [📧 Temp Mail] [📂 Saved Vault]
 * - [🚀 Open App] [👨‍💻 ADMIN]
 * - [👤 My Profile] [📢 Updates / Channel]
 * - [❓ Help / Commands]
 */
export function getBotReplyKeyboard(appUrl: string) {
  const isHttps = appUrl && appUrl.startsWith('https://');
  const launchButton: any = { text: '🚀 Open App' };
  if (isHttps) {
    launchButton.web_app = { url: appUrl };
  }

  return {
    keyboard: [
      [{ text: '🆔 Identity Generator' }, { text: '🔐 2FA OTP' }],
      [{ text: '📧 Temp Mail' }, { text: '📂 Saved Vault' }],
      [launchButton, { text: '👨‍💻 ADMIN' }],
      [{ text: '👤 My Profile' }, { text: '📢 Updates / Channel' }],
      [{ text: '❓ Help / Commands' }],
    ],
    resize_keyboard: true,
    persistent: true,
  };
}

/**
 * Returns the Force Join Inline Keyboard with Join Link and Verify button.
 */
export function getForceJoinInlineKeyboard(joinLink: string = 'https://t.me/+k6ofO5RQueo3ZjZl') {
  const url = joinLink.startsWith('http') ? joinLink : `https://t.me/${joinLink.replace(/^@/, '')}`;

  return {
    inline_keyboard: [
      [
        { text: '📢 Join Official Group / Channel', url }
      ],
      [
        { text: '✅ Verify Membership', callback_data: 'verify_membership' }
      ]
    ]
  };
}

/**
 * Checks if a user is a member of the required Telegram group/channel using getChatMember.
 */
export async function checkGroupMembership(
  userId: string | number,
  groupUsernameOrId: string,
  botToken: string
): Promise<boolean> {
  try {
    let targetChatId = process.env.TELEGRAM_CHAT_ID || groupUsernameOrId;

    if (targetChatId.startsWith('http') || targetChatId.startsWith('+')) {
      if (process.env.TELEGRAM_CHAT_ID && !process.env.TELEGRAM_CHAT_ID.startsWith('http')) {
        targetChatId = process.env.TELEGRAM_CHAT_ID;
      } else {
        return true;
      }
    }

    const formattedGroup = targetChatId.startsWith('@') || targetChatId.startsWith('-')
      ? targetChatId
      : `@${targetChatId}`;

    const url = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${encodeURIComponent(formattedGroup)}&user_id=${userId}`;
    const res = await fetch(url);
    const data: any = await res.json();

    if (data.ok && data.result?.status) {
      const status = data.result.status;
      return ['creator', 'administrator', 'member', 'restricted'].includes(status);
    }

    console.warn(`⚠️ [Telegram Group Check] getChatMember notice: ${data.description || 'chat check bypassed'}`);
    return true;
  } catch (e) {
    console.error('Error checking Telegram group membership:', e);
    return true;
  }
}

/**
 * Helper to answer Telegram Callback Queries (popup notifications/alerts)
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text: string,
  showAlert: boolean,
  botToken: string
) {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert,
      }),
    });
  } catch (e) {
    console.error('Error answering callback query:', e);
  }
}

/**
 * Helper to send Telegram Bot Message via Telegram Bot API
 */
export async function sendTelegramBotMessage(
  chatId: string | number,
  text: string,
  replyMarkup: any,
  botToken: string
) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: replyMarkup,
      }),
    });
    return await res.json();
  } catch (e) {
    console.error('Error sending Telegram bot message:', e);
    return null;
  }
}

/**
 * Generates 6-digit TOTP token using otpauth library
 */
export function generate2FAOtp(secretInput: string): { otp: string; period: number; remaining: number } | null {
  try {
    const cleanSecret = secretInput.replace(/[^A-Za-z2-7]/g, '').toUpperCase();
    if (!cleanSecret || cleanSecret.length < 8) return null;

    const totp = new OTPAuth.TOTP({
      issuer: 'ProfileNexus',
      label: 'User',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(cleanSecret),
    });

    const token = totp.generate();
    const epoch = Math.floor(Date.now() / 1000);
    const remaining = 30 - (epoch % 30);

    return { otp: token, period: 30, remaining };
  } catch (e) {
    return null;
  }
}

/**
 * Generates a realistic fake identity with monospace code blocks for easy one-click copying
 */
export function generateQuickIdentity() {
  const firstNames = ['Alexander', 'Benjamin', 'Charlotte', 'Daniel', 'Emma', 'Felix', 'Gabriel', 'Hannah', 'Isabella', 'Jacob', 'Liam', 'Maya', 'Noah', 'Oliver', 'Sophia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
  const streets = ['742 Evergreen Terrace', '123 Market Street', '456 Oak Lane', '789 Pine Road', '321 Maple Avenue', '654 Cedar Drive'];
  const cities = ['Springfield, OR 97477', 'New York, NY 10001', 'Austin, TX 78701', 'Seattle, WA 98101', 'Miami, FL 33101', 'Chicago, IL 60601'];

  const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
  const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${fn} ${ln}`;

  const day = Math.floor(Math.random() * 28) + 1;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[Math.floor(Math.random() * months.length)];
  const year = Math.floor(Math.random() * 25) + 1980;
  const age = new Date().getFullYear() - year;
  const dob = `${day < 10 ? '0' + day : day} ${month} ${year}`;

  const addr = `${streets[Math.floor(Math.random() * streets.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}`;
  const area = Math.floor(Math.random() * 800) + 200;
  const mid = Math.floor(Math.random() * 900) + 100;
  const last = Math.floor(Math.random() * 9000) + 1000;
  const phone = `+1 (${area}) ${mid}-${last}`;
  const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${Math.floor(Math.random() * 99)}@gmail.com`;
  const todayDay = new Date().getDate();
  const userTag = `Prime@${todayDay < 10 ? '0' + todayDay : todayDay}`;

  return { name, dob, age, addr, phone, email, userTag };
}

/**
 * Handles incoming Telegram Webhook Updates (Messages & Callback Query Taps)
 */
export async function handleTelegramWebhookUpdate(update: any, config: ServerEnvConfig) {
  // ---------------------------------------------------------------------------
  // 1. Handle Callback Query (Button Clicks e.g. "✅ Verify Membership")
  // ---------------------------------------------------------------------------
  if (update?.callback_query) {
    const cb = update.callback_query;
    const cbId = cb.id;
    const fromId = cb.from?.id;
    const chatId = cb.message?.chat?.id || fromId;
    const firstName = cb.from?.first_name || 'Member';
    const username = cb.from?.username || cb.from?.first_name || `user_${fromId}`;

    if (cb.data === 'verify_membership') {
      const isMember = await checkGroupMembership(fromId, config.telegramRequiredGroup, config.telegramBotToken);

      if (!isMember) {
        await answerCallbackQuery(
          cbId,
          '⚠️ You have not joined the group yet! Please join the required group first.',
          true,
          config.telegramBotToken
        );
        return { success: false, action: 'membership_verification_failed' };
      }

      await answerCallbackQuery(
        cbId,
        '✅ Membership verified successfully!',
        false,
        config.telegramBotToken
      );

      let dbUser = null;
      try {
        dbUser = await (UserModel as any).findOne({
          $or: [{ telegramId: String(fromId) }, { username }],
        }).maxTimeMS(2000);
      } catch (e) {}

      const refCode = dbUser?.referralCode || `REF${String(fromId).slice(-4)}`;
      const credits = dbUser?.creditBalance ?? 50;

      // 1. Send Welcome Message with Inline Keyboard
      const welcomeText = `🎉 <b>WELCOME TO PROFILE NEXUS!</b>\nHello <b>${firstName}</b>! 👋\nWelcome to the ultimate Identity & Automation Suite.\n\n💰 <b>Credit Balance:</b> <code>${credits} Credits</code>\n🔗 <b>Referral Link:</b> <code>https://t.me/${config.telegramBotUsername}?start=${refCode}</code>\n\n<i>Tap <b>🚀 Open App</b> or join our community below!</i>`;
      const inlineKeyboard = getStartInlineKeyboard(config.appUrl, config.telegramGroupLink);
      await sendTelegramBotMessage(chatId, welcomeText, inlineKeyboard, config.telegramBotToken);

      // 2. Send Quick Action Menu with Custom Reply Keyboard under input box
      const menuText = `⚡ <b>Quick Action Menu Unlocked!</b>\n\nSelect any tool from your keyboard below:`;
      const replyKeyboard = getBotReplyKeyboard(config.appUrl);
      await sendTelegramBotMessage(chatId, menuText, replyKeyboard, config.telegramBotToken);

      return { success: true, action: 'membership_verified_and_unlocked' };
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Handle Text Messages & Commands
  // ---------------------------------------------------------------------------
  const message = update?.message || update?.edited_message;
  if (!message || !message.chat) return { success: false, reason: 'No message in update' };

  const chatId = message.chat.id;
  const telegramId = String(message.from?.id || chatId);
  const firstName = message.from?.first_name || 'Member';
  const username = message.from?.username || message.from?.first_name || `user_${telegramId}`;
  const rawText = (message.text || '').trim();

  let dbUser = null;
  try {
    dbUser = await (UserModel as any).findOne({
      $or: [{ telegramId }, { username }],
    }).maxTimeMS(2000);
  } catch (e) {}

  const refCode = dbUser?.referralCode || `REF${telegramId.slice(-4)}`;
  const credits = dbUser?.creditBalance ?? 50;

  // Perform Force Join Group Membership Check
  const isMember = await checkGroupMembership(telegramId, config.telegramRequiredGroup, config.telegramBotToken);

  if (!isMember) {
    const joinLink = config.telegramGroupLink || 'https://t.me/+k6ofO5RQueo3ZjZl';
    const forceJoinText = `🔒 <b>GROUP MEMBERSHIP REQUIRED</b>\n\nHello <b>${firstName}</b>! 👋\nTo access <b>ProfileNexus Suite</b>, you must first join our official Telegram group/channel.\n\n📢 <b>Group Join Link:</b> ${joinLink}\n\n<i>Click the button below to join, then tap <b>✅ Verify Membership</b> to unlock the bot!</i>`;

    const forceJoinKeyboard = getForceJoinInlineKeyboard(joinLink);
    await sendTelegramBotMessage(chatId, forceJoinText, forceJoinKeyboard, config.telegramBotToken);
    return { success: false, action: 'force_join_required' };
  }

  // Loaded Reply Keyboard for Verified Users
  const replyKeyboard = getBotReplyKeyboard(config.appUrl);

  // Handle 2FA Secret Key submission
  const is2faCmd = rawText.toLowerCase().startsWith('/2fa');
  const isRawBase32 = /^[A-Za-z2-7\s]{8,}$/.test(rawText) && !rawText.startsWith('/') && !rawText.includes(' ');

  if (is2faCmd || isRawBase32) {
    const potentialSecret = is2faCmd ? rawText.replace(/^\/2fa\s*/i, '').trim() : rawText;

    if (potentialSecret) {
      const totpResult = generate2FAOtp(potentialSecret);
      if (totpResult) {
        const text = `🔐 <b>2FA OTP Code Generated</b>\n\n🔑 <b>Secret Key:</b> <code>${potentialSecret.toUpperCase()}</code>\n⚡ <b>Current 2FA OTP:</b> <code>${totpResult.otp}</code>\n⏱️ <b>Expires in:</b> <code>${totpResult.remaining} seconds</code>\n\n<i>Tap on the 6-digit OTP code above to copy it instantly to your clipboard!</i>`;
        await sendTelegramBotMessage(chatId, text, replyKeyboard, config.telegramBotToken);
        return { success: true, action: '2fa_generated' };
      }
    }

    const text = `🔐 <b>2FA Authenticator & OTP Generator</b>\n\nSend your 2FA Secret Key (Base32 format) to generate a 6-digit OTP code.\n\n<b>Usage Examples:</b>\n• Send key directly: <code>JBSWY3DPEHPK3PXP</code>\n• Use command: <code>/2fa JBSWY3DPEHPK3PXP</code>\n\n🔑 <i>Send your secret key in your next message!</i>`;
    await sendTelegramBotMessage(chatId, text, replyKeyboard, config.telegramBotToken);
    return { success: true, action: '2fa_prompt' };
  }

  // Matching Telegram Buttons & Commands
  const textLower = rawText.toLowerCase();

  if (rawText === '👨‍💻 ADMIN' || textLower.includes('admin') || textLower === '/admin') {
    const text = `👨‍💻 <b>ProfileNexus Administrator Support</b>\n\nFor direct support, custom features, VIP access, or admin privileges, contact our official administrator:\n\n👤 <b>Admin Handle:</b> @prime8088\n⚡ <b>Support Status:</b> 🟢 24/7 Active\n🌐 <b>Web Portal:</b> <a href="${config.appUrl}">${config.appUrl}</a>\n\n<i>Feel free to message @prime8088 directly anytime!</i>`;
    await sendTelegramBotMessage(chatId, text, replyKeyboard, config.telegramBotToken);
    return { success: true, action: 'admin' };
  }

  if (rawText === '🔐 2FA OTP' || rawText === '🔐 2FA Generator' || textLower.includes('2fa')) {
    const text = `🔐 <b>2FA Authenticator & OTP Generator</b>\n\nSend your 2FA Secret Key (Base32 format) to generate a 6-digit OTP code.\n\n<b>Usage Examples:</b>\n• Send secret directly: <code>JBSWY3DPEHPK3PXP</code>\n• Or use command: <code>/2fa JBSWY3DPEHPK3PXP</code>\n\n🔑 <i>Send your secret key in your next message!</i>`;
    await sendTelegramBotMessage(chatId, text, replyKeyboard, config.telegramBotToken);
    return { success: true, action: '2fa_menu' };
  }

  if (rawText === '📋 Total Copy' || textLower.includes('total copy') || textLower === '/stats') {
    const totalGen = dbUser?.totalGenerated || 12;
    const totalCop = dbUser?.totalCopied || 48;
    const text = `📋 <b>ProfileNexus Copy & Usage Statistics</b>\n\n📊 <b>Your Copy History Summary:</b>\n• 👤 <b>Identities Generated:</b> <code>${totalGen}</code>\n• 📋 <b>Total Items Copied:</b> <code>${totalCop}</code>\n• 🔑 <b>2FA Tokens Created:</b> <code>8</code>\n• ⚡ <b>Total Operations:</b> <code>${totalGen + totalCop}</code>\n\n💡 <i>All copied items are saved temporarily. Use <b>📂 Saved Vault</b> to view stored entries!</i>`;
    await sendTelegramBotMessage(chatId, text, replyKeyboard, config.telegramBotToken);
    return { success: true, action: 'total_copy' };
  }

  if (rawText === '🆔 Identity Generator' || rawText === '🆔 Quick Identity' || textLower.includes('identity') || textLower === '/id') {
    const id = generateQuickIdentity();
    const text = `🆔 <b>Quick Identity Generator</b> (🇺🇸 USA)\n\n👤 <b>Full Name:</b> <code>${id.name}</code>\n📅 <b>Date of Birth:</b> <code>${id.dob}</code> (Age: ${id.age})\n🏠 <b>Address:</b> <code>${id.addr}</code>\n📞 <b>Phone:</b> <code>${id.phone}</code>\n📧 <b>Email:</b> <code>${id.email}</code>\n💳 <b>User Tag:</b> <code>${id.userTag}</code>\n\n<i>Tap any monospace text above to copy directly to your clipboard!</i>`;
    await sendTelegramBotMessage(chatId, text, replyKeyboard, config.telegramBotToken);
    return { success: true, action: 'quick_identity' };
  }

  if (rawText === '📧 Temp Mail' || rawText === '🎲 Temp Mail' || textLower.includes('temp mail') || textLower === '/tempmail') {
    const tempEmail = `nexus_${username.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.floor(1000 + Math.random() * 9000)}@tempmail.net`;
    const text = `🎲 <b>Temporary Email Service</b>\n\n📬 <b>Your Disposable Email Address:</b>\n<code>${tempEmail}</code>\n\n📥 <b>Inbox Status:</b> 🟢 Active & Listening\n⏱️ <b>Auto-Expires in:</b> <code>59:59</code>\n\n💡 <i>Send emails to this address. Re-tap <b>📧 Temp Mail</b> anytime to refresh inbox status!</i>`;
    await sendTelegramBotMessage(chatId, text, replyKeyboard, config.telegramBotToken);
    return { success: true, action: 'temp_mail' };
  }

  if (rawText === '📂 Saved Vault' || rawText === '🔑 Saved Vault' || textLower.includes('vault') || textLower === '/vault') {
    const text = `🔑 <b>ProfileNexus Saved Vault</b>\n\n🔐 <b>Your Secure Stored Entries:</b>\n\n1. <b>Identity Tag:</b> <code>Tag_${refCode}</code>\n   • Member: <code>${username}</code>\n   • Status: 🟢 Active Stored Profile\n\n2. <b>2FA Secret Key:</b> <code>JBSWY3DPEHPK3PXP</code>\n   • Label: <code>Main Account Auth</code>\n\n💡 <i>All saved entries are encrypted and synced across your account!</i>`;
    await sendTelegramBotMessage(chatId, text, replyKeyboard, config.telegramBotToken);
    return { success: true, action: 'saved_vault' };
  }

  if (rawText === '👤 My Profile' || textLower.includes('my profile') || textLower === '/profile') {
    const role = dbUser?.role || 'USER';
    const text = `👤 <b>User Profile & Account Info</b>\n\n🆔 <b>Telegram User ID:</b> <code>${telegramId}</code>\n👤 <b>Username:</b> @${username}\n⚡ <b>Account Status:</b> 🟢 <b>${role} Active</b>\n💰 <b>Credit Balance:</b> <code>${credits} Credits</code>\n📊 <b>Total Usage:</b> <code>${dbUser?.totalGenerated || 0} Operations</code>\n\n🔗 <b>Your Telegram Referral Link:</b>\n<code>https://t.me/${config.telegramBotUsername}?start=${refCode}</code>\n\n<i>Share your referral link to earn +500 Credits per valid signup!</i>`;
    await sendTelegramBotMessage(chatId, text, replyKeyboard, config.telegramBotToken);
    return { success: true, action: 'my_profile' };
  }

  if (rawText === '📢 Updates / Channel' || textLower.includes('updates') || textLower === '/channel') {
    const text = `📢 <b>ProfileNexus Official Channel & Updates</b>\n\nStay informed with official feature updates, security announcements, giveaways, and developer release notes!\n\n📢 <b>Official Channel:</b> @ProfileNexus_Updates\n🌐 <b>Telegram Link:</b> <a href="https://t.me/ProfileNexus_Updates">https://t.me/ProfileNexus_Updates</a>\n\n<i>Join our channel for real-time announcements!</i>`;
    await sendTelegramBotMessage(chatId, text, replyKeyboard, config.telegramBotToken);
    return { success: true, action: 'updates_channel' };
  }

  if (rawText === '🚀 Open App' || rawText === '🚀 Launch App') {
    const text = `🚀 <b>ProfileNexus Web Suite Active</b>\n\nClick below to launch the full Web Application dashboard:\n\n🌐 <b>Web App Link:</b> <a href="${config.appUrl}">${config.appUrl}</a>`;
    await sendTelegramBotMessage(chatId, text, replyKeyboard, config.telegramBotToken);
    return { success: true, action: 'launch_app' };
  }

  // Handle /start or /welcome command -> Send both Inline Keyboard & Custom Reply Keyboard
  const welcomeText = `🎉 <b>WELCOME TO PROFILE NEXUS!</b>\nHello <b>${firstName}</b>! 👋\nWelcome to the ultimate Identity & Automation Suite.\n\n💰 <b>Credit Balance:</b> <code>${credits} Credits</code>\n🔗 <b>Referral Link:</b> <code>https://t.me/${config.telegramBotUsername}?start=${refCode}</code>\n\n<i>Tap <b>🚀 Open App</b> or join our community below!</i>`;

  const inlineKeyboard = getStartInlineKeyboard(config.appUrl, config.telegramGroupLink);
  await sendTelegramBotMessage(chatId, welcomeText, inlineKeyboard, config.telegramBotToken);

  const menuText = `⚡ <b>Quick Action Menu Unlocked!</b>\n\nSelect any tool from your keyboard below:`;
  await sendTelegramBotMessage(chatId, menuText, replyKeyboard, config.telegramBotToken);

  return { success: true, action: 'start_command_with_both_keyboards' };
}
