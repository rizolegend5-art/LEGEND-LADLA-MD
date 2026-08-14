const fs = require('fs-extra');
const path = require('path');
const GOODBYE_FILE = path.join(__dirname, '../data/goodbye.json');

function load() { try { return fs.readJsonSync(GOODBYE_FILE); } catch { return {}; } }
function save(d) { fs.ensureFileSync(GOODBYE_FILE); fs.writeJsonSync(GOODBYE_FILE, d, { spaces: 2 }); }

module.exports = {
    goodbyeCommand: async function (sock, chatId, msg, isAdmin, args) {
        if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Only admins can use this command.' }, { quoted: msg });
        if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Group only command.' }, { quoted: msg });
        const d = load();
        const sub = args[0] || '';
        if (sub === 'on') { d[chatId] = d[chatId] || {}; d[chatId].enabled = true; save(d); return sock.sendMessage(chatId, { text: '✅ Goodbye messages enabled!' }, { quoted: msg }); }
        if (sub === 'off') { if (d[chatId]) d[chatId].enabled = false; save(d); return sock.sendMessage(chatId, { text: '🚫 Goodbye messages disabled.' }, { quoted: msg }); }
        return sock.sendMessage(chatId, { text: `👋 *Goodbye — Usage Guide* 👋

━━━━━━━━━━━━━━━━━━━━
📋 *Usage (Istemaal):*

🟢 *.goodbye on*
   → Goodbye message chalu hoga.
   → Jab koi member group chhore tu bot usko goodbye message bhejega.

🔴 *.goodbye off*
   → Goodbye message band hoga.
   → Member jane par koi message nahi milega.

━━━━━━━━━━━━━━━━━━━━
💡 *Tip:* Sirf admins ye command use kar sakte hain.` }, { quoted: msg });
    },
    handleGoodbye: async function (sock, chatId, member) {
        const d = load();
        if (!d[chatId] || !d[chatId].enabled) return;
        const text = d[chatId].message || `Goodbye @${member.split('@')[0]}! We\'ll miss you. 😢`;
        await sock.sendMessage(chatId, { text, mentions: [member] });
    }
};
