// resetwarn.js — Reset ALL warnings for entire group OR a specific user
const fs = require('fs');
const path = require('path');
const WARNFILE = path.join(__dirname, '../data/warns.json');

function loadWarns() {
    try { return JSON.parse(fs.readFileSync(WARNFILE, 'utf8')); } catch { return {}; }
}
function saveWarns(data) {
    fs.mkdirSync(path.dirname(WARNFILE), { recursive: true });
    fs.writeFileSync(WARNFILE, JSON.stringify(data, null, 2));
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
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins warns reset kar sakte hain.' }, { quoted: msg });

    const warns = loadWarns();
    let target = getReplyTarget(msg.message);

    if (target) {
        const key = `${chatId}:${target}`;
        const prev = warns[key] || 0;
        delete warns[key];
        saveWarns(warns);
        await sock.sendMessage(chatId, {
            text: `✅ *WARN RESET*\n\n@${target.split('@')[0]} ki ${prev} warnings clear ho gayi!`,
            mentions: [target]
        }, { quoted: msg });
    } else {
        let count = 0;
        for (const key of Object.keys(warns)) {
            if (key.startsWith(chatId)) { delete warns[key]; count++; }
        }
        saveWarns(warns);
        await sock.sendMessage(chatId, {
            text: `✅ *ALL WARNS RESET*\n\nIs group ke ${count} users ki saari warnings clear ho gayi!\n🧹 Group warn slate clean hai.`
        }, { quoted: msg });
    }
};
