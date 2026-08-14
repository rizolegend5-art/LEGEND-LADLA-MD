const fs = require('fs-extra');
const path = require('path');
const WELCOME_FILE = path.join(__dirname, '../data/welcome.json');

function load() { try { return fs.readJsonSync(WELCOME_FILE); } catch { return {}; } }
function save(d) { fs.ensureFileSync(WELCOME_FILE); fs.writeJsonSync(WELCOME_FILE, d, { spaces: 2 }); }

module.exports = {
    welcomeCommand: async function (sock, chatId, msg, isAdmin, args) {
        if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Only admins can use this command.' }, { quoted: msg });
        if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Group only command.' }, { quoted: msg });
        const d = load();
        const sub = args[0] || '';
        if (sub === 'on') { d[chatId] = d[chatId] || {}; d[chatId].enabled = true; save(d); return sock.sendMessage(chatId, { text: '✅ Welcome messages enabled!' }, { quoted: msg }); }
        if (sub === 'off') { if (d[chatId]) d[chatId].enabled = false; save(d); return sock.sendMessage(chatId, { text: '🚫 Welcome messages disabled.' }, { quoted: msg }); }
        return sock.sendMessage(chatId, { text: `👋 *Welcome — Usage Guide* 👋

━━━━━━━━━━━━━━━━━━━━
📋 *Usage (Istemaal):*

🟢 *.welcome on*
   → Welcome message chalu hoga.
   → Jab koi naya member group mein join kare tu bot usko welcome message bhejega.

🔴 *.welcome off*
   → Welcome message band hoga.
   → Naye members ko koi welcome nahi milega.

✏️ *.setwelcome <message>*
   → Custom welcome message set karo.
   → Example: .setwelcome Welcome @user! Group mein welcome hai.

━━━━━━━━━━━━━━━━━━━━
💡 *Tip:* Sirf admins ye command use kar sakte hain.` }, { quoted: msg });
    },
    handleWelcome: async function (sock, chatId, member) {
        const d = load();
        if (!d[chatId] || !d[chatId].enabled) return;
        const text = d[chatId].message || `Welcome to the group, @${member.split('@')[0]}! 👋🎉`;
        await sock.sendMessage(chatId, { text, mentions: [member] });
    }
};
