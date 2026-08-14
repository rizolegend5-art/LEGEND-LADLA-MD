async function antilinkCommand(sock, from, msg, isAdmin, botData, saveBotData, args) {
    if (!isAdmin || !from.endsWith('@g.us')) return await sock.sendMessage(from, { text: "❌ Only admin can use this command in groups." }, { quoted: msg });
    
    const action = args[0]?.toLowerCase();
    if (action === 'on' || action === 'del') {
        botData.antilinkGroups[from] = 'del';
        saveBotData();
        await sock.sendMessage(from, { text: "✅ Anti-Link (Delete + 3 Warnings = Kick) Enabled!\n\n📌 Rules:\n1st link → Delete + Warning 1/3\n2nd link → Delete + Warning 2/3\n3rd link → Delete + Kick!\n\nAdmins exempt." }, { quoted: msg });
    } else if (action === 'warn') {
        botData.antilinkGroups[from] = 'warn';
        saveBotData();
        await sock.sendMessage(from, { text: "✅ Anti-Link (Warn Mode) Enabled!\n\n📌 Rules:\n1st link → Delete + Warning 1/3\n2nd link → Delete + Warning 2/3\n3rd link → Delete + Kick!\n\nAdmins exempt." }, { quoted: msg });
    } else if (action === 'kick') {
        botData.antilinkGroups[from] = 'kick';
        saveBotData();
        await sock.sendMessage(from, { text: "✅ Anti-Link (Kick Mode) Enabled!\n\n📌 Rules:\n1st link → Delete + Kick!\n\nAdmins exempt." }, { quoted: msg });
    } else if (action === 'reset') {
        // Reset all warning counts for this group
        if (botData.antilinkWarns && botData.antilinkWarns[from]) {
            botData.antilinkWarns[from] = {};
            saveBotData();
            await sock.sendMessage(from, { text: "✅ Anti-Link warning counts reset for this group!" }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { text: "ℹ️ No warning counts to reset." }, { quoted: msg });
        }
    } else if (action === 'status' || action === '') {
        const mode = botData.antilinkGroups[from];
        const modeLabel = mode === 'kick' ? '🔴 Kick Mode' : (mode === 'warn' || mode === 'del' ? '🟡 Warn Mode' : 'OFF ❌');
        const warnData = botData.antilinkWarns?.[from] || {};
        const userCount = Object.keys(warnData).filter(k => warnData[k] > 0).length;
        await sock.sendMessage(from, { text: `🚫 *Anti-Link — Usage Guide* 🚫

━━━━━━━━━━━━━━━━━━━━
📌 *Current Status:* ${modeLabel}
📊 *Users with warnings:* ${userCount}

━━━━━━━━━━━━━━━━━━━━
📋 *Usage (Istemaal):*

🟢 *.antilink on*
   → Link delete hoga + 3 warnings.
   → 3 baar link bhejne par user kick hoga.
   → Admins safe hain.

⚠️ *.antilink warn*
   → Same as .on — 3 warnings then kick.

🔴 *.antilink kick*
   → 1st link pe hi user kick hoga!
   → No warnings, direct kick.

🔄 *.antilink reset*
   → Sab users ke warning counts reset honge.

📊 *.antilink status*
   → Current status dekho.

🔕 *.antilink off*
   → Anti-link band ho jayega.
   → Ab link bhejne par koi action nahi hoga.

━━━━━━━━━━━━━━━━━━━━
💡 *Tip:* Sirf admins ye command use kar sakte hain.` }, { quoted: msg });
    } else if (action === 'off') {
        delete botData.antilinkGroups[from];
        saveBotData();
        await sock.sendMessage(from, { text: "❌ Anti-Link Disabled!" }, { quoted: msg });
    } else {
        await sock.sendMessage(from, { text: `🚫 *Anti-Link — Usage Guide* 🚫

━━━━━━━━━━━━━━━━━━━━
📋 *Usage (Istemaal):*

🟢 *.antilink on* → Delete + 3 Warnings = Kick
⚠️ *.antilink warn* → Same as on
🔴 *.antilink kick* → 1st link = Direct Kick
🔄 *.antilink reset* → Reset warnings
📊 *.antilink status* → Status dekho
🔕 *.antilink off* → Band karo

━━━━━━━━━━━━━━━━━━━━
💡 *Tip:* Sirf admins ye command use kar sakte hain.` }, { quoted: msg });
    }
}

module.exports = antilinkCommand;
