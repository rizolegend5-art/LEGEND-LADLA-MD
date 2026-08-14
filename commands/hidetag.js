const fs = require('fs-extra');
const path = require('path');
const HIDETAG_FILE = path.join(__dirname, '../data/hidetag_settings.json');

function loadSettings() { try { return fs.readJsonSync(HIDETAG_FILE); } catch { return {}; } }
function saveSettings(d) { fs.ensureFileSync(HIDETAG_FILE); fs.writeJsonSync(HIDETAG_FILE, d, { spaces: 2 }); }

async function hidetagCommand(sock, from, msg, isAdmin, q) {
    if (!isAdmin || !from.endsWith('@g.us')) return await sock.sendMessage(from, { text: "❌ Only admin can use this command in groups." }, { quoted: msg });

    const action = (q || '').toLowerCase();
    const settings = loadSettings();

    if (action === 'on') {
        settings[from] = true;
        saveSettings(settings);
        await sock.sendMessage(from, { text: "✅ *Hide Tag: ON*\n\nAb .hidetag command sabko invisible mention karegi.\nTag hoga lekin mention icon show nahi hoga." }, { quoted: msg });
    } else if (action === 'off') {
        settings[from] = false;
        saveSettings(settings);
        await sock.sendMessage(from, { text: "❌ *Hide Tag: OFF*\n\nAb normal mention hoga." }, { quoted: msg });
    } else if (action === '') {
        await sock.sendMessage(from, {
            text: `🏷️ *HideTag — Usage Guide* 🏷️\n\n━━━━━━━━━━━━━━━━━━━━\n📋 *Usage (Istemaal):*\n\n🟢 *.hidetag on*\n   → Invisible mention mode chalu hoga.\n   → Sab members ko tag hoga lekin mention icon show nahi hoga.\n   → Members ko pata nahi chalega ke wo tag hue hain.\n\n🔴 *.hidetag off*\n   → Invisible mention mode band hoga.\n   → Ab normal visible mention hoga.\n\n💬 *.hidetag <message>*\n   → Group ke sab members ko message bhejo\n   → Mention bina icon ke jayega.\n   → Example: .hidetag Meeting at 5 PM\n\n━━━━━━━━━━━━━━━━━━━━\n💡 *Tip:* Sirf admins ye command use kar sakte hain.`
        }, { quoted: msg });
        return;
    } else {
        // Normal hidetag - send message to all without visible mention
        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants.map(p => p.id);
        await sock.sendMessage(from, {
            text: q || "Hi Everyone!",
            mentions: participants
        });
    }
}

module.exports = hidetagCommand;
