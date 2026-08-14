// warnall.js — Warn all non-admin members at once
const fs = require('fs');
const path = require('path');
const WARNFILE = path.join(__dirname, '../data/warns.json');
const MAX_WARNS = 3;

function loadWarns() {
    try { return JSON.parse(fs.readFileSync(WARNFILE, 'utf8')); } catch { return {}; }
}
function saveWarns(data) {
    fs.mkdirSync(path.dirname(WARNFILE), { recursive: true });
    fs.writeFileSync(WARNFILE, JSON.stringify(data, null, 2));
}

module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins warnall kar sakte hain.' }, { quoted: msg });

    const reason = q || 'Admin ki taraf se general warning';
    const groupMeta = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botAdmin = groupMeta.participants.find(p => p.id === botId)?.admin;
    if (!botAdmin) return sock.sendMessage(chatId, { text: '❌ Bot ko admin banana parhega.' }, { quoted: msg });

    const nonAdmins = groupMeta.participants.filter(p => !p.admin && p.id !== botId);
    if (nonAdmins.length === 0) return sock.sendMessage(chatId, { text: 'ℹ️ Koi non-admin member nahi hai.' }, { quoted: msg });

    const warns = loadWarns();
    let kicked = [], warned = [];

    for (const p of nonAdmins) {
        const key = `${chatId}:${p.id}`;
        warns[key] = (warns[key] || 0) + 1;
        if (warns[key] >= MAX_WARNS) {
            try {
                await sock.groupParticipantsUpdate(chatId, [p.id], 'remove');
                delete warns[key];
                kicked.push(p.id);
            } catch { warned.push(p.id); }
        } else {
            warned.push(p.id);
        }
        await new Promise(r => setTimeout(r, 300));
    }
    saveWarns(warns);

    const allMentions = [...warned, ...kicked];
    let text = `⚠️ *WARN ALL EXECUTED*\n\n📢 *Reason:* ${reason}\n\n`;
    text += `✅ Warned: ${warned.length} members\n`;
    if (kicked.length > 0) text += `🔨 Kicked (${MAX_WARNS}+ warns): ${kicked.length} members\n`;
    text += `\n💡 ${MAX_WARNS} warnings = auto kick!`;

    await sock.sendMessage(chatId, { text, mentions: allMentions }, { quoted: msg });
};
