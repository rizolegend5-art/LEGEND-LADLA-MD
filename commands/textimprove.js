module.exports = async function (sock, chatId, msg) {
    try {
        const text = `🛠️ *Textimprove*

✨ 𝙎𝙍 𝙇𝙀𝘼𝘿𝙀𝙍-𝙈𝘿

Command: .textimprove
Status: Ready ✅`;
        await sock.sendMessage(chatId, { text }, { quoted: msg });
    } catch (e) {
        console.error('textimprove error:', e);
        await sock.sendMessage(chatId, { text: '❌ Command error occurred' }, { quoted: msg });
    }
};
