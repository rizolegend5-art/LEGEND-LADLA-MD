const fs = require('fs-extra');
const path = require('path');
const RULES_FILE = path.join(__dirname, '../data/rules.json');

function loadRules() {
    try { return fs.readJsonSync(RULES_FILE); } catch { return {}; }
}
function saveRules(data) {
    fs.ensureFileSync(RULES_FILE);
    fs.writeJsonSync(RULES_FILE, data, { spaces: 2 });
}

module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: msg });
    const rules = loadRules();
    if (q && isAdmin) {
        rules[chatId] = q;
        saveRules(rules);
        return sock.sendMessage(chatId, { text: `✅ *Group Rules Updated!*\n\n📋 ${q}` }, { quoted: msg });
    }
    const groupRules = rules[chatId];
    if (!groupRules) {
        return sock.sendMessage(chatId, { text: '📋 *Group Rules*\n\nNo rules have been set for this group yet.\n\n_Admins can set rules with: .rules <text>_' }, { quoted: msg });
    }
    await sock.sendMessage(chatId, { text: `📋 *Group Rules*\n\n${groupRules}` }, { quoted: msg });
};
