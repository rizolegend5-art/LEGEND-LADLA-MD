async function antistatusCommand(sock, from, msg, isAdmin, botData, saveBotData, args) {
    if (!from.endsWith('@g.us')) return await sock.sendMessage(from, { text: "❌ This command only works in groups." }, { quoted: msg });
    if (!isAdmin) return await sock.sendMessage(from, { text: "❌ Only admins can use this command." }, { quoted: msg });

    const action = args[0]?.toLowerCase();
    if (!botData.antiStatusGroups) botData.antiStatusGroups = {};

    if (action === 'on') {
        botData.antiStatusGroups[from] = true;
        saveBotData();
        await sock.sendMessage(from, { text: "✅ *Status-Fuck Protection Enabled!*\n\nNaya status detect hote hi bot delete karne ki koshish karega. Group mein delete permissions ke liye bot ko admin banayein.\n\nDisable: .statusfuck off" }, { quoted: msg });
    } else if (action === 'off') {
        botData.antiStatusGroups[from] = false;
        saveBotData();
        await sock.sendMessage(from, { text: "❌ *Status-Fuck Protection Disabled!*" }, { quoted: msg });
    } else {
        await sock.sendMessage(from, { text: "❌ Usage: .statusfuck [on/off] (alias: .antistatus)" }, { quoted: msg });
    }
}

module.exports = antistatusCommand;
