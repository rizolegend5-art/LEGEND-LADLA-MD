// warnlist.js — Show all warned users in this group with their warn count
const fs = require('fs');
const path = require('path');
const WARNFILE = path.join(__dirname, '../data/warns.json');
const MAX_WARNS = 3;

module.exports = async function (sock, chatId, msg) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });

    let warns = {};
    try { warns = JSON.parse(fs.readFileSync(WARNFILE, 'utf8')); } catch { warns = {}; }

    const groupWarns = Object.entries(warns).filter(([k]) => k.startsWith(chatId + ':'));
    if (groupWarns.length === 0) return sock.sendMessage(chatId, { text: '✅ Is group mein kisi ko bhi warn nahi kiya gaya.' }, { quoted: msg });

    const mentions = groupWarns.map(([k]) => k.split(':')[1] + '@s.whatsapp.net');
    let text = `⚠️ *WARN LIST — ${groupWarns.length} users*\n${'─'.repeat(30)}\n\n`;

    groupWarns.forEach(([key, count], i) => {
        const jid = key.split(':').slice(1).join(':');
        const bar = '🟥'.repeat(count) + '⬜'.repeat(Math.max(0, MAX_WARNS - count));
        text += `${i + 1}. @${jid.split('@')[0]}\n   ${bar} ${count}/${MAX_WARNS}\n`;
    });
    text += `\n🔨 *${MAX_WARNS} warnings = auto kick!*\n💡 Clear: *.clearwarn @user*\n💡 Reset all: *.resetwarn*`;

    await sock.sendMessage(chatId, { text, mentions }, { quoted: msg });
};
