// unmuteuser.js — Remove user from mute list OR toggle mute user feature on/off
const fs = require('fs');
const path = require('path');
const MUTEFILE = path.join(__dirname, '../data/muted.json');
const MUTEMODE_FILE = path.join(__dirname, '../data/muteuser_mode.json');

function loadMuted() { try { return JSON.parse(fs.readFileSync(MUTEFILE, 'utf8')); } catch { return {}; } }
function saveMuted(data) { fs.mkdirSync(path.dirname(MUTEFILE), { recursive: true }); fs.writeFileSync(MUTEFILE, JSON.stringify(data, null, 2)); }
function loadMode() { try { return JSON.parse(fs.readFileSync(MUTEMODE_FILE, 'utf8')); } catch { return {}; } }
function saveMode(data) { fs.mkdirSync(path.dirname(MUTEMODE_FILE), { recursive: true }); fs.writeFileSync(MUTEMODE_FILE, JSON.stringify(data, null, 2)); }

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

module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins unmute kar sakte hain.' }, { quoted: msg });

    const action = (q || '').toLowerCase();

    if (action === 'on') {
        const mode = loadMode();
        mode[chatId] = true;
        saveMode(mode);
        return sock.sendMessage(chatId, { text: '✅ *Unmute User Mode ON*\n\nAb muted users ko message karne par warning milegi pehle.' }, { quoted: msg });
    } else if (action === 'off') {
        const mode = loadMode();
        delete mode[chatId];
        saveMode(mode);
        return sock.sendMessage(chatId, { text: '❌ *Unmute User Mode OFF*\n\nDirect mute list se remove ho jayega.' }, { quoted: msg });
    }

    let target = getReplyTarget(msg.message);
    if (!target) return sock.sendMessage(chatId, { text: '❌ Reply ya @mention karo.\n.unmuteuser @user' }, { quoted: msg });

    const muted = loadMuted();
    if (!muted[chatId] || !muted[chatId].includes(target)) {
        return sock.sendMessage(chatId, { text: `ℹ️ @${target.split('@')[0]} muted hi nahi hai.`, mentions: [target] }, { quoted: msg });
    }
    muted[chatId] = muted[chatId].filter(u => u !== target);
    saveMuted(muted);

    await sock.sendMessage(chatId, {
        text: `🔊 *USER UNMUTED*\n\n@${target.split('@')[0]} ab dobara message kar sakta hai.\n✅ Mute list se remove ho gaya.`,
        mentions: [target]
    }, { quoted: msg });
};
