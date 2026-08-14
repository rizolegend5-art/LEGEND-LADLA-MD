// daily.js — Daily coin reward system
const fs   = require('fs-extra');
const path = require('path');
const DAILY_FILE   = path.join(__dirname, '../data/daily.json');
const ECONOMY_FILE = path.join(__dirname, '../data/economy.json');
function load(f) { try { return fs.readJsonSync(f); } catch { return {}; } }
function save(f, d) { fs.ensureFileSync(f); fs.writeJsonSync(f, d, { spaces: 2 }); }
module.exports = async function (sock, chatId, msg) {
    const senderId = msg.key.participant || chatId;
    const daily    = load(DAILY_FILE);
    const economy  = load(ECONOMY_FILE);
    const now      = Date.now();
    const last     = daily[senderId] || 0;
    const cooldown = 24 * 60 * 60 * 1000;
    if (now - last < cooldown) {
        const rem = cooldown - (now - last);
        const hh = Math.floor(rem / 3600000);
        const mm = Math.floor((rem % 3600000) / 60000);
        return sock.sendMessage(chatId, {
            text: `⏰ *Daily Already Claimed!*\n━━━━━━━━━━━━━━━━━━━━\nNext claim: *${hh}h ${mm}m* baad\n💡 Kal wapas aana!`,
        }, { quoted: msg });
    }
    const reward = Math.floor(Math.random() * 401) + 100; // 100–500
    economy[senderId] = economy[senderId] || { coins: 0, level: 1, xp: 0 };
    economy[senderId].coins += reward;
    economy[senderId].xp    += reward;
    while (economy[senderId].xp >= economy[senderId].level * 100) {
        economy[senderId].xp -= economy[senderId].level * 100;
        economy[senderId].level++;
    }
    daily[senderId] = now;
    save(DAILY_FILE, daily);
    save(ECONOMY_FILE, economy);
    await sock.sendMessage(chatId, {
        text:
            `🎁 *Daily Reward Claimed!*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `🪙 Received: *+${reward.toLocaleString()} coins*\n` +
            `💰 Total:    *${economy[senderId].coins.toLocaleString()} coins*\n` +
            `⭐ Level:    *${economy[senderId].level}*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `🕐 Next reward: *24 hours* baad`,
    }, { quoted: msg });
};
