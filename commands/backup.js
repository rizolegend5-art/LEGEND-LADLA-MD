// backup.js — Backup current group info to JSON
const fs   = require('fs-extra');
const path = require('path');
module.exports = async function (sock, chatId, msg, isAdmin) {
    if (!chatId.endsWith('@g.us'))
        return sock.sendMessage(chatId, { text: '❌ Sirf group mein kaam karta hai.' }, { quoted: msg });
    if (!isAdmin)
        return sock.sendMessage(chatId, { text: '❌ Sirf admin backup le sakta hai.' }, { quoted: msg });
    try {
        const meta = await sock.groupMetadata(chatId);
        const backupData = {
            id: meta.id, subject: meta.subject, description: meta.desc,
            owner: meta.owner, creation: new Date(meta.creation * 1000).toISOString(),
            participants: meta.participants.map(p => ({ id: p.id, admin: p.admin || 'member' })),
            takenAt: new Date().toISOString(),
        };
        const dir  = path.join(__dirname, '../data/backups');
        fs.mkdirSync(dir, { recursive: true });
        const file = path.join(dir, `${chatId.replace('@g.us', '')}_${Date.now()}.json`);
        fs.writeFileSync(file, JSON.stringify(backupData, null, 2));
        await sock.sendMessage(chatId, {
            text:
                `✅ *Group Backup Successful!*\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `👥 *Group:*   ${meta.subject}\n` +
                `👤 *Members:* ${meta.participants.length}\n` +
                `📅 *Date:*    ${new Date().toLocaleString()}`,
        }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ Backup fail: ${e.message}` }, { quoted: msg });
    }
};
