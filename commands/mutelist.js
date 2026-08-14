// mutelist.js — Show all muted users in this group
const fs = require('fs');
const path = require('path');
const MUTEFILE = path.join(__dirname, '../data/muted.json');

module.exports = async function (sock, chatId, msg, isAdmin) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });

    let muted = {};
    try { muted = JSON.parse(fs.readFileSync(MUTEFILE, 'utf8')); } catch { muted = {}; }

    const list = muted[chatId] || [];
    if (list.length === 0) return sock.sendMessage(chatId, { text: '✅ Is group mein koi bhi muted nahi hai.' }, { quoted: msg });

    let text = `🔇 *MUTED USERS — ${list.length} total*\n${'─'.repeat(30)}\n\n`;
    list.forEach((jid, i) => {
        text += `${i + 1}. @${jid.split('@')[0]}\n`;
    });
    text += `\n💡 Unmute: *.unmuteuser @user*`;

    await sock.sendMessage(chatId, { text, mentions: list }, { quoted: msg });
};
