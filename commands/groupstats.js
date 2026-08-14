// groupstats.js — Show detailed group statistics
const fs = require('fs');
const path = require('path');

module.exports = async function (sock, chatId, msg) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });

    const groupMeta = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    const total = groupMeta.participants.length;
    const admins = groupMeta.participants.filter(p => p.admin).length;
    const superAdmins = groupMeta.participants.filter(p => p.admin === 'superadmin').length;
    const members = total - admins;

    // Load warn/mute/ban counts
    let warnCount = 0, muteCount = 0, banCount = 0;
    try {
        const warns = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/warns.json'), 'utf8'));
        warnCount = Object.keys(warns).filter(k => k.startsWith(chatId)).length;
    } catch {}
    try {
        const muted = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/muted.json'), 'utf8'));
        muteCount = (muted[chatId] || []).length;
    } catch {}
    try {
        const banned = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/banned.json'), 'utf8'));
        banCount = (banned[chatId] || []).length;
    } catch {}

    const created = groupMeta.creation
        ? new Date(groupMeta.creation * 1000).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'N/A';

    const restrict = groupMeta.announce ? '🔒 Locked (Admins only)' : '🔓 Open (All members)';
    const editRestrict = groupMeta.restrict ? '🔒 Admins only' : '🔓 All members';

    const text =
        `📊 *GROUP STATISTICS*\n` +
        `${'═'.repeat(30)}\n\n` +
        `📛 *Name:* ${groupMeta.subject}\n` +
        `📅 *Created:* ${created}\n` +
        `🆔 *ID:* ${chatId.split('@')[0]}\n\n` +
        `${'─'.repeat(30)}\n` +
        `👥 *Members*\n` +
        `  • Total: *${total}*\n` +
        `  • Admins: *${admins}* (${superAdmins} superadmin)\n` +
        `  • Regular: *${members}*\n\n` +
        `${'─'.repeat(30)}\n` +
        `⚙️ *Settings*\n` +
        `  • Messaging: ${restrict}\n` +
        `  • Edit Info: ${editRestrict}\n\n` +
        `${'─'.repeat(30)}\n` +
        `🛡️ *Moderation*\n` +
        `  • ⚠️ Warned Users: *${warnCount}*\n` +
        `  • 🔇 Muted Users: *${muteCount}*\n` +
        `  • 🔨 Banned Users: *${banCount}*\n` +
        `${'═'.repeat(30)}`;

    await sock.sendMessage(chatId, { text }, { quoted: msg });
};
