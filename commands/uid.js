module.exports = async function (sock, chatId, msg) {
    try {
        const text = `🛠️ *Uid*

✨ 𝙎𝙍 𝙇𝙀𝘼𝘿𝙀𝙍-𝙈𝘿

Command: .uid
Status: Ready ✅`;
        await sock.sendMessage(chatId, { text }, { quoted: msg });
    } catch (e) {
        console.error('uid error:', e);
        await sock.sendMessage(chatId, { text: '❌ Command error occurred' }, { quoted: msg });
    }
};
