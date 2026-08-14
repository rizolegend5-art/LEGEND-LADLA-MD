// muteuser.js — Add user to group mute list (bot auto-kicks them if they send message)
const fs = require('fs');
const path = require('path');
const MUTEFILE = path.join(__dirname, '../data/muted.json');

function loadMuted() {
    try { return JSON.parse(fs.readFileSync(MUTEFILE, 'utf8')); } catch { return {}; }
}
function saveMuted(data) {
    fs.mkdirSync(path.dirname(MUTEFILE), { recursive: true });
    fs.writeFileSync(MUTEFILE, JSON.stringify(data, null, 2));
}

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

module.exports = async function (sock, chatId, msg, isAdmin) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins mute kar sakte hain.' }, { quoted: msg });

    const arg = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || '').trim().split(' ').slice(1).join(' ').toLowerCase();
    if (arg === 'on' || arg === 'off') {
        // on/off handled by unmuteuser - pass through
        return sock.sendMessage(chatId, { text: `🔇 *MuteUser — Usage Guide* 🔇

━━━━━━━━━━━━━━━━━━━━
📋 *Usage (Istemaal):*

🟢 *.muteuser @user* (reply/message ke sath)
   → Kisi member ko mute karo.
   → Ab wo member group mein message nahi kar sakta.
   → Message karne par auto-kick hoga.

🔓 *.unmuteuser @user* (reply/message ke sath)
   → Kisi member ko unmute karo.
   → Ab wo message kar sakta hai.

🟢 *.muteuser on*
   → Mute warning mode chalu hoga.
   → Muted users ko message karne par warning milegi.

🔴 *.muteuser off*
   → Mute warning mode band hoga.

━━━━━━━━━━━━━━━━━━━━
💡 *Tip:* Sirf admins ye command use kar sakte hain.` }, { quoted: msg });
    }

    let target = getReplyTarget(msg.message);
    if (!target) return sock.sendMessage(chatId, { text: `🔇 *MuteUser — Usage Guide* 🔇

━━━━━━━━━━━━━━━━━━━━
📋 *Usage (Istemaal):*

🟢 *.muteuser @user* (reply/message ke sath)
   → Kisi member ko mute karo.
   → Ab wo member group mein message nahi kar sakta.
   → Message karne par auto-kick hoga.

🔓 *.unmuteuser @user* (reply/message ke sath)
   → Kisi member ko unmute karo.
   → Ab wo message kar sakta hai.

━━━━━━━━━━━━━━━━━━━━
💡 *Tip:* Sirf admins ye command use kar sakte hain.` }, { quoted: msg });

    const muted = loadMuted();
    if (!muted[chatId]) muted[chatId] = [];
    if (muted[chatId].includes(target)) {
        return sock.sendMessage(chatId, { text: `ℹ️ @${target.split('@')[0]} pehle se hi muted hai.`, mentions: [target] }, { quoted: msg });
    }
    muted[chatId].push(target);
    saveMuted(muted);

    await sock.sendMessage(chatId, {
        text: `🔇 *USER MUTED*\n\n@${target.split('@')[0]} ab is group mein message nahi kar sakta.\n⚠️ Message karne ki koshish par auto-kick hoga.\n\nUnmute: *.unmuteuser @user*`,
        mentions: [target]
    }, { quoted: msg });
};
