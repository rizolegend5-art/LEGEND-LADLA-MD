// unban.js — Remove user from permanent ban list
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

module.exports = async function (sock, chatId, msg, isAdmin) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins unban kar sakte hain.' }, { quoted: msg });

    let target = msg.message?.extendedTextMessage?.contextInfo?.participant;
    const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (!target) target = mentions[0];
    if (!target && msg.message?.extendedTextMessage?.text?.match(/@\d+/)) {
        const num = msg.message.extendedTextMessage.text.match(/@(\d+)/)?.[1];
        if (num) target = num + '@s.whatsapp.net';
    }
    if (!target) return sock.sendMessage(chatId, { text: '❌ @mention karo jise unban karna hai.\n.unban @user' }, { quoted: msg });

    const bans = loadBans();
    if (!bans[chatId] || !bans[chatId].includes(target)) {
        return sock.sendMessage(chatId, { text: `ℹ️ @${target.split('@')[0]} ban list mein hai hi nahi.`, mentions: [target] }, { quoted: msg });
    }
    bans[chatId] = bans[chatId].filter(u => u !== target);
    saveBans(bans);

    await sock.sendMessage(chatId, {
        text: `✅ *UNBAN DONE*\n\n@${target.split('@')[0]} ko ban list se hata diya gaya!\nAb woh group mein dobara join kar sakta hai.`,
        mentions: [target]
    }, { quoted: msg });
};
