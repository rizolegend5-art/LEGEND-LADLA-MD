module.exports = async function legendLadliCommand(sock, chatId, msg, q) {
    const name = (q || '').trim() || 'Legend Ladli';
    await sock.sendMessage(chatId, {
        text: `👑 *LEGEND LADLI*

${name} 🖤 Legend Ladla ka naam hi kaafi hai,
🔥 Legend Ladli ka andaaz bhi nawabi hai.
😎 Dono ki dosti ka alag hi raaj hai,
👑 Jahan kharay ho jaayein, wahan apna hi taaj hai.! 🌸`,
    }, { quoted: msg });
};