module.exports = async function (sock, chatId, msg) {
    try {
        const text = `🛠️ *Voicemsg*

✨ 𝐃𝐀𝐊𝐔-𝙈𝘿

Command: .voicemsg
Status: Ready ✅`;
        await sock.sendMessage(chatId, { text }, { quoted: msg });
    } catch (e) {
        console.error('voicemsg error:', e);
        await sock.sendMessage(chatId, { text: '❌ Command error occurred' }, { quoted: msg });
    }
};
