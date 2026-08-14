async function kickCommand(sock, from, msg, isAdmin) {
    if (!isAdmin) return await sock.sendMessage(from, { text: "❌ Only admin can use this command." }, { quoted: msg });
    if (!from.endsWith('@g.us')) return await sock.sendMessage(from, { text: "❌ This command can only be used in groups." }, { quoted: msg });

    function getReplyTarget(m) {
        if (!m) return null;
        const types = ['extendedTextMessage', 'imageMessage', 'videoMessage', 'stickerMessage', 'audioMessage', 'documentMessage'];
        for (const t of types) {
            if (m[t]?.contextInfo?.participant) return m[t].contextInfo.participant;
            if (m[t]?.contextInfo?.mentionedJid?.[0]) return m[t].contextInfo.mentionedJid[0];
        }
        if (m.ephemeralMessage?.message) return getReplyTarget(m.ephemeralMessage.message);
        if (m.viewOnceMessage?.message) return getReplyTarget(m.viewOnceMessage.message);
        if (m.viewOnceMessageV2?.message) return getReplyTarget(m.viewOnceMessageV2.message);
        return null;
    }

    const quoted = getReplyTarget(msg.message);
    const directMention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const target = quoted || directMention;

    if (!target) return await sock.sendMessage(from, { text: "❌ Please reply to a message or tag someone to kick." }, { quoted: msg });

    try {
        await sock.groupParticipantsUpdate(from, [target], "remove");
        await sock.sendMessage(from, { text: "✅ User kicked successfully." }, { quoted: msg });
    } catch (e) {
        await sock.sendMessage(from, { text: "❌ Failed to kick user. Make sure I am an admin." }, { quoted: msg });
    }
}

module.exports = kickCommand;
