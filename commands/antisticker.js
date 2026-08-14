/**
 * Group Anti-Sticker Guard.
 *
 * Usage:
 *   .antisticker on
 *   .antisticker off
 *   .antisticker
 *
 * When enabled, any sticker sent by a non-admin member in the group
 * will be automatically deleted.
 */
module.exports = async function antistickerCommand(sock, from, msg, isAdmin, botData, saveBotData, args) {
    if (!from.endsWith('@g.us')) {
        return sock.sendMessage(from, { text: '❌ Yeh command sirf group mein use hoti hai.' }, { quoted: msg });
    }
    if (!isAdmin) {
        return sock.sendMessage(from, { text: '❌ Sirf group admins anti-sticker setting change kar sakte hain.' }, { quoted: msg });
    }

    // Initialize antiStickerGroups if missing
    if (!botData.antiStickerGroups) botData.antiStickerGroups = {};

    const action = String(args?.[0] || '').toLowerCase();

    if (action === 'on') {
        botData.antiStickerGroups[from] = true;
        saveBotData();
        return sock.sendMessage(from, {
            text: '✅ *Anti-Sticker: ON*\n\nAb group mein bheja gaya har sticker automatically delete hoga.\nAdmin stickers safe rahenge.'
        }, { quoted: msg });
    }

    if (action === 'off') {
        botData.antiStickerGroups[from] = false;
        saveBotData();
        return sock.sendMessage(from, {
            text: '❌ *Anti-Sticker: OFF*\n\nAb stickers delete nahi honge.'
        }, { quoted: msg });
    }

    // Show current status with Urdu usage guide
    const status = botData.antiStickerGroups[from] ? 'ON ✅' : 'OFF ❌';
    return sock.sendMessage(from, {
        text: `🛡️ *Anti-Sticker — Usage Guide* 🛡️

━━━━━━━━━━━━━━━━━━━━
📌 *Current Status:* ${status}

📋 *Usage (Istemaal):*

🟢 *.antisticker on*
   → Ab group mein koi bhi non-admin sticker bhejega tu wo automatically delete ho jayega.
   → Admin stickers safe rahenge, delete nahi honge.

🔴 *.antisticker off*
   → Anti-sticker band ho jayega.
   → Ab stickers delete nahi honge.

━━━━━━━━━━━━━━━━━━━━
💡 *Tip:* Sirf admins ye command use kar sakte hain.`
    }, { quoted: msg });
};
