// addmember.js — Add a member to group by phone number
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins member add kar sakte hain.' }, { quoted: msg });

    const groupMeta = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botAdmin = groupMeta.participants.find(p => p.id === botId)?.admin;
    if (!botAdmin) return sock.sendMessage(chatId, { text: '❌ Bot ko admin banana parhega.' }, { quoted: msg });

    if (!q) return sock.sendMessage(chatId, { text: '❌ Phone number do:\n.addmember 923001234567\n\nCountry code ke saath likho (e.g. 92 for Pakistan)' }, { quoted: msg });

    // Clean number
    let num = q.trim().replace(/\D/g, '');
    if (num.startsWith('0')) num = '92' + num.slice(1); // Pakistan default
    const jid = num + '@s.whatsapp.net';

    try {
        const result = await sock.groupParticipantsUpdate(chatId, [jid], 'add');
        const status = result?.[0]?.status;

        if (status === '200' || status === 200) {
            await sock.sendMessage(chatId, {
                text: `✅ *MEMBER ADDED*\n\n📱 +${num} ko group mein add kar diya gaya!\n👋 Welcome karo unhe!`,
                mentions: [jid]
            }, { quoted: msg });
        } else if (status === '403') {
            // Cannot add, send invite instead
            const inviteCode = await sock.groupInviteCode(chatId);
            await sock.sendMessage(jid, {
                text: `Assalam o Alaikum! Aapko is group mein invite kiya gaya hai:\nhttps://chat.whatsapp.com/${inviteCode}`
            });
            await sock.sendMessage(chatId, { text: `⚠️ +${num} ko directly add nahi ho saka.\n✉️ Unhe invite link bhej diya gaya hai.` }, { quoted: msg });
        } else {
            await sock.sendMessage(chatId, { text: `❌ Add fail: status ${status}\nCheck karo number sahi hai aur WhatsApp use kar raha hai.` }, { quoted: msg });
        }
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ Error: ${e.message}` }, { quoted: msg });
    }
};
