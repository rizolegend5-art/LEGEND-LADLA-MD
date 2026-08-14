module.exports = async function chotiDonQuoteCommand(sock, chatId, msg) {
    const quotes = [
        'Choti Don kehti hai: soft dil rakho, strong boundaries bhi.',
        'Jahan respect ho, wahan rishta hamesha khoobsurat rehta hai.',
        'Smile free hai, is liye aaj sab ko ek de do.',
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    await sock.sendMessage(chatId, {
        text: `🌷 *CHOTI DON QUOTE*\n\n${quote}`,
    }, { quoted: msg });
};