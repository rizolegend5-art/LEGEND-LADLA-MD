// toolinfo.js — Show available tools info
const { BOT_NAME } = require('../lib/messageConfig');
module.exports = async function (sock, chatId, msg) {
    try {
        const fs   = require('fs');
        const path = require('path');
        const total = fs.readdirSync(path.join(__dirname)).filter(f => f.endsWith('.js')).length;
        await sock.sendMessage(chatId, {
            text: `🛠️ *${BOT_NAME} Tools*\n\n📦 Total Commands Available: ${total}+\n\n💡 Type *.menu* to see all commands!`,
        }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `🛠️ *${BOT_NAME}* — Tools command ready!` }, { quoted: msg });
    }
};
