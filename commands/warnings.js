const fs = require('fs-extra');
const path = require('path');
const WARNS_FILE = path.join(__dirname, '../data/warns.json');

function loadWarns() {
    try { return fs.readJsonSync(WARNS_FILE); } catch { return {}; }
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

module.exports = async function (sock, chatId, msg) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    const target = getReplyTarget(msg.message) || msg.key?.participant;
    if (!target) return sock.sendMessage(chatId, { text: '❌ Please reply to or mention a user to check their warnings.' }, { quoted: msg });
    const warns = loadWarns();
    const key = `${chatId}_${target}`;
    const count = warns[key] || 0;
    await sock.sendMessage(chatId, {
        text: `📋 *Warnings Check*\n\n@${target.split('@')[0]}\n🔢 Total Warnings: *${count}/3*`,
        mentions: [target]
    }, { quoted: msg });
};
