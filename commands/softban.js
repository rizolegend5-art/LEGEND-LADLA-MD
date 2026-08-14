// softban.js — Kick and re-invite user, OR auto-softban mode on/off
const fs = require('fs');
const path = require('path');
const SOFTBAN_FILE = path.join(__dirname, '../data/softban_settings.json');

function loadSettings() { try { return JSON.parse(fs.readFileSync(SOFTBAN_FILE, 'utf8')); } catch { return {}; } }
function saveSettings(data) { fs.mkdirSync(path.dirname(SOFTBAN_FILE), { recursive: true }); fs.writeFileSync(SOFTBAN_FILE, JSON.stringify(data, null, 2)); }

function getReplyTarget(m) {
    if (!m) return null;
    const types = ['extendedTextMessage', 'imageMessage', 'videoMessage', 'stickerMessage', 'audioMessage', 'documentMessage'];
    for (const t of types) {
        if (m[t]?.contextInfo?.participant) return m[t].contextInfo.participant;
        if (m[t]?.contextInfo?.mentionedJid?.[0]) return m[t].contextInfo.mentionedJid[0];
    }
    if (m.ephemeralMessage?.message) return getReplyTarget(m.ephemeralMessage.message);
    if (m.viewOnceMessage?.message) return getReplyTarget(m.viewOnceMessage.message);
    if (m.viewOnceMessageV2?.message) return getReplyTarget(m.viewOnceMessageV2.message);
    return null;
}

module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins softban kar sakte hain.' }, { quoted: msg });

    const action = (q || '').toLowerCase();

    if (action === 'on') {
        const settings = loadSettings();
        settings[chatId] = true;
        saveSettings(settings);
        return sock.sendMessage(chatId, { text: '✅ *Auto-Softban ON*\n\nAb agar banned member group mein aaye to auto softban hoga.' }, { quoted: msg });
    } else if (action === 'off') {
        const settings = loadSettings();
        delete settings[chatId];
        saveSettings(settings);
        return sock.sendMessage(chatId, { text: '❌ *Auto-Softban OFF*\n\nAb koi auto-softban nahi hoga.' }, { quoted: msg });
    }

    const groupMeta = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botAdmin = groupMeta.participants.find(p => p.id === botId)?.admin;
    if (!botAdmin) return sock.sendMessage(chatId, { text: '❌ Bot ko admin banana parhega.' }, { quoted: msg });

    let target = getReplyTarget(msg.message);
    if (!target) return sock.sendMessage(chatId, { text: `🔄 *Softban — Usage Guide* 🔄

━━━━━━━━━━━━━━━━━━━━
📋 *Usage (Istemaal):*

🟢 *.softban on*
   → Auto-softban mode chalu hoga.
   → Agar banned member group mein join kare tu automatically softban hoga.

🔴 *.softban off*
   → Auto-softban mode band hoga.
   → Koi auto-action nahi hoga.

🔄 *.softban* (reply/message ke sath)
   → Kisi member ko reply karo ya @mention karo.
   → Wo user group se temporarily remove hoga.
   → 3 seconds baad invite link bheja jayega.
   → Example: .softban @user

━━━━━━━━━━━━━━━━━━━━
💡 *Tip:* Sirf admins ye command use kar sakte hain.` }, { quoted: msg });

    try {
        const inviteCode = await sock.groupInviteCode(chatId);
        await sock.groupParticipantsUpdate(chatId, [target], 'remove');
        await sock.sendMessage(chatId, {
            text: `🔄 *SOFT BAN*\n\n@${target.split('@')[0]} ko temporarily remove kiya gaya.\nRe-joining link bheja ja raha hai...`,
            mentions: [target]
        }, { quoted: msg });
        await new Promise(r => setTimeout(r, 3000));
        await sock.sendMessage(target, {
            text: `🔄 Aapko group se temporarily remove kiya gaya tha.\n\nDobara join karein:\nhttps://chat.whatsapp.com/${inviteCode}`
        });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ Softban fail: ${e.message}` }, { quoted: msg });
    }
};
