// downloadhelp.js — Show download commands help
module.exports = async function (sock, chatId, msg) {
    await sock.sendMessage(chatId, {
        text:
            `⬇️ *Download Commands Help*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `🎵 *.song <name>*\n   → YouTube audio download\n\n` +
            `📽️ *.video <url>*\n   → Video download\n\n` +
            `📸 *.insta <url>*\n   → Instagram media\n\n` +
            `🎵 *.tiktok <url>*\n   → TikTok video\n\n` +
            `📱 *.apk <app>*\n   → APK search & download\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `⚠️ Download commands internet pe dependent hain.`,
    }, { quoted: msg });
};
