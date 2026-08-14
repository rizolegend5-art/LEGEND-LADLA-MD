// banlist.js — Show all banned users in this group
const fs = require('fs');
const path = require('path');
const BANFILE = path.join(__dirname, '../data/banned.json');

module.exports = async function (sock, chatId, msg, isAdmin) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });

    let bans = {};
    try { bans = JSON.parse(fs.readFileSync(BANFILE, 'utf8')); } catch { bans = {}; }

    const list = bans[chatId] || [];
    if (list.length === 0) return sock.sendMessage(chatId, { text: '✅ Is group mein koi bhi banned nahi hai.' }, { quoted: msg });

    let text = `🔨 *BAN LIST — ${list.length} users*\n${'─'.repeat(30)}\n\n`;
    list.forEach((jid, i) => {
        text += `${i + 1}. @${jid.split('@')[0]}\n`;
    });
    text += `\n💡 Unban karne ke liye: *.unban @user*`;

    await sock.sendMessage(chatId, { text, mentions: list }, { quoted: msg });
};
