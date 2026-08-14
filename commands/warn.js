const fs = require('fs-extra');
const path = require('path');
const WARNS_FILE = path.join(__dirname, '../data/warns.json');

function loadWarns() {
    try { return fs.readJsonSync(WARNS_FILE); } catch { return {}; }
}
function saveWarns(data) {
    fs.ensureFileSync(WARNS_FILE);
    fs.writeJsonSync(WARNS_FILE, data, { spaces: 2 });
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
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Only admins can use this command.' }, { quoted: msg });
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    const target = getReplyTarget(msg.message);
    if (!target) return sock.sendMessage(chatId, { text: '❌ Please reply to or mention the user to warn.' }, { quoted: msg });
    const warns = loadWarns();
    const key = `${chatId}_${target}`;
    warns[key] = (warns[key] || 0) + 1;
    saveWarns(warns);
    const count = warns[key];
    let extra = '';
    if (count >= 3) {
        extra = '\n\n⚠️ *3 warnings reached! Consider kicking this user.*';
    }
    await sock.sendMessage(chatId, {
        text: `⚠️ *Warning Issued*\n\n@${target.split('@')[0]} has been warned!\n\n🔢 Warnings: *${count}/3*${extra}`,
        mentions: [target]
    }, { quoted: msg });
};
