module.exports = async function chotiDonLoveCommand(sock, chatId, msg, q) {
    const name = (q || '').trim() || 'meri jaan';
    await sock.sendMessage(chatId, {
        text: `💌 *CHOTI DON LOVE NOTE*

${name}, Choti Don ki taraf se ek cute si dua:
Tumhari har subah sukoon aur har raat muskurahat se bhari ho. ✨`,
    }, { quoted: msg });
};