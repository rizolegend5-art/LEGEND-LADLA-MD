module.exports = async function (sock, chatId, msg) {
    try {
        const text = `🛠️ *Backupinfo*

✨ 𝙎𝙍 𝙇𝙀𝘼𝘿𝙀𝙍-𝙈𝘿

Command: .backupinfo
Status: Ready ✅`;
        await sock.sendMessage(chatId, { text }, { quoted: msg });
    } catch (e) {
        console.error('backupinfo error:', e);
        await sock.sendMessage(chatId, { text: '❌ Command error occurred' }, { quoted: msg });
    }
};
