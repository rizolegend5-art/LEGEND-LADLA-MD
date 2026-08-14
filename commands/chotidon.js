module.exports = async function chotiDonCommand(sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text: `🌸 *CHOTI DON* 🌸

𝐑𝐈𝐙𝐎 ki sab se pyari Choti Don hazir hai.
Rule simple hai: pyaar se baat, full respect, aur 𝐚𝐠𝐞𝐫 𝐚𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐝𝐞𝐤𝐡𝐚𝐲𝐚 𝐭𝐮 𝐛𝐡𝐚𝐫 𝐦𝐚𝐢𝐧 𝐣𝐚𝐢𝐨...

💗 *Choti Don ka message:*
Tum 𝐡𝐨𝐧𝐠𝐞𝐲 𝐬𝐩𝐞𝐜𝐢𝐚𝐥 𝐦𝐚𝐠𝐞𝐫 — apni  kabhi 𝐥𝐢𝐦𝐢𝐭 𝐦𝐚𝐭 𝐛𝐡𝐨𝐥𝐧𝐚  mat 𝐛𝐡𝐨𝐥𝐧𝐚!`,
    }, { quoted: msg });
};