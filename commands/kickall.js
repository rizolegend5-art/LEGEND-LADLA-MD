// kickall.js — Kick all non-admin members with on/off toggle
const fs = require('fs-extra');
const path = require('path');
const KICKALL_FILE = path.join(__dirname, '../data/kickall_settings.json');

function loadSettings() { try { return fs.readJsonSync(KICKALL_FILE); } catch { return {}; } }
function saveSettings(d) { fs.ensureFileSync(KICKALL_FILE); fs.writeJsonSync(KICKALL_FILE, d, { spaces: 2 }); }

module.exports = async function (sock, chatId, msg, isAdmin, isOwner, q) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ Sirf group mein use karo.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: '❌ Sirf admins use kar sakte hain.' }, { quoted: msg });

    const groupMeta = await sock.groupMetadata(chatId);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botAdmin = groupMeta.participants.find(p => p.id === botId)?.admin;
    if (!botAdmin) return sock.sendMessage(chatId, { text: '❌ Bot ko admin banana parhega.' }, { quoted: msg });

    const action = (q || '').toLowerCase();
    const settings = loadSettings();

    if (action === 'on') {
        // Enable auto-kick for non-admins who join
        settings[chatId] = true;
        saveSettings(settings);
        await sock.sendMessage(chatId, {
            text: `⚡ *KICK ALL Mode ON*\n\n✅ Ab agar koi non-admin group mein aaye to automatically kick hoga.\n\n🔕 Disable: *.kickall off*`
        }, { quoted: msg });
    } else if (action === 'off') {
        settings[chatId] = false;
        saveSettings(settings);
        await sock.sendMessage(chatId, {
            text: `✅ *KICK ALL Mode OFF*\n\n🟢 Non-admin members ab normally reh sakte hain.\nKoi auto-kick nahi hoga.`
        }, { quoted: msg });
    } else if (action === '') {
        // Show Urdu usage guide
        const nonAdmins = groupMeta.participants.filter(p => !p.admin && p.id !== botId);
        await sock.sendMessage(chatId, {
            text: `⚡ *Kick All — Usage Guide* ⚡

━━━━━━━━━━━━━━━━━━━━
👥 *Non-Admin Members:* ${nonAdmins.length}

━━━━━━━━━━━━━━━━━━━━
📋 *Usage (Istemaal):*

🟢 *.kickall on*
   → Auto-kick mode chalu hoga.
   → Ab agar koi non-admin group mein join kare tu automatically kick hoga.
   → Sirf admins group mein reh sakte hain.

🔴 *.kickall off*
   → Auto-kick mode band hoga.
   → Non-admin members normally reh sakte hain.
   → Koi auto-kick nahi hoga.

⚡ *.kickall* (bina on/off)
   → Abhi ke sab non-admin members ko kick kar dega.
   → ${nonAdmins.length} members abhi kick ho sakte hain.

━━━━━━━━━━━━━━━━━━━━
⚠️ *Warning:* Ye command dangerous hai, sahi se use karo!`}, { quoted: msg });
    } else {
        // Normal kickall - kick all non-admins immediately
        const nonAdmins = groupMeta.participants.filter(p => !p.admin && p.id !== botId);
        if (nonAdmins.length === 0) return sock.sendMessage(chatId, { text: 'ℹ️ Koi non-admin member nahi hai.' }, { quoted: msg });

        await sock.sendMessage(chatId, {
            text: `⚡ *KICK ALL INITIATED*\n\n${nonAdmins.length} members ko remove kiya ja raha hai...\nThoda wait karo.`
        }, { quoted: msg });

        let kicked = 0, failed = 0;
        for (const p of nonAdmins) {
            try {
                await sock.groupParticipantsUpdate(chatId, [p.id], 'remove');
                kicked++;
                await new Promise(r => setTimeout(r, 700));
            } catch { failed++; }
        }

        await sock.sendMessage(chatId, {
            text: `✅ *KICK ALL COMPLETE*\n\n✔️ Kicked: ${kicked}\n❌ Failed: ${failed}\n\nGroup clean ho gaya! 🧹\n\n⚡ Auto-mode: *.kickall on*`
        });
    }
};
