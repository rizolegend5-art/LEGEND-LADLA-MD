/**
 * Pair Command — Auto-detect sender number and send pairing code
 * Usage: .pair (no number needed, auto-detects from sender)
 */
module.exports = async function (sock, chatId, msg, q) {
  try {
    // Auto-detect sender's number from message key
    let number = '';

    // Priority 1: If user provided a number argument, use it
    const argNum = (q || '').replace(/[^0-9]/g, '');
    if (argNum && argNum.length >= 10) {
      number = argNum;
    }
    // Priority 2: Auto-detect from sender's participant (group chat)
    else if (msg.key && msg.key.participant) {
      number = msg.key.participant.replace(/[^0-9]/g, '');
    }
    // Priority 3: Auto-detect from remoteJid (private chat)
    else if (msg.key && msg.key.remoteJid) {
      number = msg.key.remoteJid.replace(/[^0-9]/g, '');
    }

    // Remove country code suffix (e.g., remove trailing digits from phone:something@whatsapp.net)
    number = number.replace(/:[0-9]+$/, '');

    // Keep the full number with country code (e.g., 923001234567)
    // Don't strip the country code - keep it as is
    if (!number || number.length < 10) {
      return sock.sendMessage(chatId, { 
        text: '❌ Apna number detect nahi ho raha. Please apna number type karein:\n\n📌 Example: .pair 923001234567' 
      }, { quoted: msg });
    }

    if (!sock.requestPairingCode) {
      return sock.sendMessage(chatId, { text: '❌ Pairing code is not available.' }, { quoted: msg });
    }

    // Show loading animation
    const loadEmojis = ['⏳', '⌛', '🚀', '✨'];
    for (const emoji of loadEmojis) {
      try {
        await sock.sendMessage(chatId, { react: { text: emoji, key: msg.key } });
      } catch (e) {}
    }

    const code = await sock.requestPairingCode(number);
    const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;
    
    await sock.sendMessage(chatId, {
        text: `🔗 *MASOOM X MASOOMA PAIRING CODE*\n\n` +
        `🏷️ *Pairing Brand:* MASOOMMASOOMA\n` +
        `📱 *Number:* ${number}\n\n` +
        `┌─────────────────────┐\n` +
        `│  \`${formattedCode}\`  │\n` +
        `└─────────────────────┘\n\n` +
        `📋 *Code copy karo (upar tap karo)*\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📱 *WhatsApp mein enter karo:*\n` +
        `1️⃣ WhatsApp kholein\n` +
        `2️⃣ Settings → Linked Devices\n` +
        `3️⃣ "Link with Phone Number" dabao\n` +
        `4️⃣ Upar wala code enter karo\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `⚡ *MASOOM X MASOOMA*`
    }, { quoted: msg });
  } catch (e) {
    await sock.sendMessage(chatId, { text: '❌ Pair command error: ' + e.message }, { quoted: msg });
  }
};
