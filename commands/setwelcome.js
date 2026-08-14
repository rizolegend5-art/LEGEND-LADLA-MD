const fs = require('fs-extra');
const path = require('path');
const WELCOME_FILE = path.join(__dirname, '../data/welcome.json');

function load() { try { return fs.readJsonSync(WELCOME_FILE); } catch { return {}; } }
function save(d) { fs.ensureFileSync(WELCOME_FILE); fs.writeJsonSync(WELCOME_FILE, d, { spaces: 2 }); }

module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Only admins can use this command.' }, { quoted: msg });
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Group only command.' }, { quoted: msg });
    if (!q) return sock.sendMessage(chatId, { text: '❌ Usage: .setwelcome <message>\n\nUse @user as placeholder for the new member\'s name.' }, { quoted: msg });
    const d = load();
    d[chatId] = d[chatId] || {};
    d[chatId].message = q;
    d[chatId].enabled = true;
    save(d);
    await sock.sendMessage(chatId, { text: `✅ *Welcome message set!*\n\n📝 ${q}\n\nWelcome messages are now ON.` }, { quoted: msg });
};
