module.exports = async function (sock, chatId, msg) {
    const target = msg.message?.extendedTextMessage?.contextInfo?.participant ||
                   msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
                   msg.key?.remoteJid;
    try {
        const ppUrl = await sock.profilePictureUrl(target, 'image');
        await sock.sendMessage(chatId, {
            image: { url: ppUrl },
            caption: `🖼️ *Profile Picture*\n\n@${target.split('@')[0]}`,
            mentions: [target]
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Could not fetch profile picture. The user may have hidden it.' }, { quoted: msg });
    }
};
