// balance.js — Show user economy balance
const fs   = require('fs-extra');
const path = require('path');
const FILE = path.join(__dirname, '../data/economy.json');
function load() { try { return fs.readJsonSync(FILE); } catch { return {}; } }
module.exports = async function (sock, chatId, msg) {
    const senderId = msg.key.participant || chatId;
    const economy  = load();
    const user     = economy[senderId] || { coins: 0, level: 1, xp: 0 };
    const number   = senderId.split('@')[0];
    await sock.sendMessage(chatId, {
        text:
            `💰 *Balance — @${number}*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `🪙 *Coins:*  ${user.coins.toLocaleString()}\n` +
            `⭐ *Level:*  ${user.level}\n` +
            `📈 *XP:*     ${user.xp} / ${user.level * 100}\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `💡 .daily se roz free coins lo!`,
        mentions: [senderId],
    }, { quoted: msg });
};
