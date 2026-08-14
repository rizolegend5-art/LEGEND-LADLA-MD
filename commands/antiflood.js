// antiflood.js — Enable/disable anti-flood (auto-kick users who spam too fast)
const fs = require('fs');
const path = require('path');
const FLOODFILE = path.join(__dirname, '../data/antiflood.json');

function loadFlood() {
    try { return JSON.parse(fs.readFileSync(FLOODFILE, 'utf8')); } catch { return {}; }
}
function saveFlood(data) {
    fs.mkdirSync(path.dirname(FLOODFILE), { recursive: true });
    fs.writeFileSync(FLOODFILE, JSON.stringify(data, null, 2));
}

// In-memory message tracker: { "groupId:userId": [timestamps] }
const msgTracker = {};

module.exports = async function (sock, chatId, msg, isAdmin, args) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins antiflood set kar sakte hain.' }, { quoted: msg });

    const data = loadFlood();
    const sub = args?.[1]?.toLowerCase();
    const limit = parseInt(args?.[2]) || 5; // messages per 5 seconds

    if (!sub || sub === 'on') {
        data[chatId] = { enabled: true, limit };
        saveFlood(data);
        await sock.sendMessage(chatId, {
            text: `🛡️ *ANTI-FLOOD ON*\n\n━━━━━━━━━━━━━━━━━━━━\n⚡ Limit: *${limit} messages / 5 seconds*\n🔨 Exceed kiya to: *Auto-Kick*\n\n💡 Custom limit: *.antiflood on 7*\n💡 Band karne ke liye: *.antiflood off*\n━━━━━━━━━━━━━━━━━━━━`
        }, { quoted: msg });
    } else if (sub === 'off') {
        data[chatId] = { enabled: false, limit: 0 };
        saveFlood(data);
        await sock.sendMessage(chatId, { text: '✅ *Anti-flood band kar diya gaya.*' }, { quoted: msg });
    } else {
        const status = data[chatId]?.enabled ? `✅ ON (limit: ${data[chatId]?.limit || 5})` : '❌ OFF';
        await sock.sendMessage(chatId, {
            text: `🛡️ *ANTI-FLOOD STATUS*\n\nStatus: ${status}\n\n.antiflood on [limit] — Enable karo\n.antiflood off — Disable karo\n.antiflood status — Yeh message`
        }, { quoted: msg });
    }
};

// Export tracker for use in main index.js message handler
module.exports.msgTracker = msgTracker;
module.exports.loadFlood = loadFlood;
