// ban.js — Kick user and add to permanent ban list (auto-re-kick if rejoins)
const fs = require('fs');
const path = require('path');
const BANFILE = path.join(__dirname, '../data/banned.json');

function loadBans() {
    try { return JSON.parse(fs.readFileSync(BANFILE, 'utf8')); } catch { return {}; }
}
function saveBans(data) {
    fs.mkdirSync(path.dirname(BANFILE), { recursive: true });
    fs.writeFileSync(BANFILE, JSON.stringify(data, null, 2));
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
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins ban kar sakte hain.' }, { quoted: msg });

    const groupMeta = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botAdmin = groupMeta.participants.find(p => p.id === botId)?.admin;
    if (!botAdmin) return sock.sendMessage(chatId, { text: '❌ Bot ko admin banana parhega pehle.' }, { quoted: msg });

    let target = getReplyTarget(msg.message);
    // Fallback: check direct @mention in text
    if (!target && msg.message?.extendedTextMessage?.text?.match(/@\d+/)) {
        const num = msg.message.extendedTextMessage.text.match(/@(\d+)/)?.[1];
        if (num) target = num + '@s.whatsapp.net';
    }
    if (!target) return sock.sendMessage(chatId, { text: '❌ Reply karo ya @mention karo jise ban karna hai.\n.ban @user' }, { quoted: msg });

    const bans = loadBans();
    if (!bans[chatId]) bans[chatId] = [];
    if (!bans[chatId].includes(target)) bans[chatId].push(target);
    saveBans(bans);

    try {
        await sock.groupParticipantsUpdate(chatId, [target], 'remove');
        await sock.sendMessage(chatId, {
            text: `🔨 *BAN EXECUTED*\n\n@${target.split('@')[0]} ko group se ban kar diya gaya!\n\n⚠️ Woh dobara join nahi kar sakta — agar try kiya to automatically remove ho jayega.`,
            mentions: [target]
        }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ Ban fail hua: ${e.message}` }, { quoted: msg });
    }
};
