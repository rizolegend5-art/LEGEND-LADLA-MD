/**
 * Anti-Spam Plus Command
 *
 * Usage:
 *   .antispamplus on          — Enable anti-spam (default: 6 messages in 5 seconds)
 *   .antispamplus off         — Disable anti-spam
 *   .antispamplus limit 8     — Set message limit (e.g. 8 messages)
 *   .antispamplus time 10     — Set time window in seconds (e.g. 10 seconds)
 *   .antispamplus action kick — Set action on spam (delete / kick / ban)
 *   .antispamplus             — Show current status
 *
 * When enabled, messages sent too fast by a non-admin member are auto-deleted.
 */
module.exports = async function antispamplusCommand(sock, chatId, msg, isAdmin, botData, saveBotData, args) {
    if (!chatId.endsWith('@g.us')) {
        return sock.sendMessage(chatId, { text: '❌ Yeh command sirf group mein use hoti hai.' }, { quoted: msg });
    }
    if (!isAdmin) {
        return sock.sendMessage(chatId, { text: '❌ Sirf group admins anti-spam setting change kar sakte hain.' }, { quoted: msg });
    }

    // Initialize
    if (!botData.antiSpamPlus) botData.antiSpamPlus = {};
    if (!botData.antiSpamPlus[chatId]) {
        botData.antiSpamPlus[chatId] = {
            enabled: false,
            limit: 6,
            timeWindow: 5,
            action: 'delete'
        };
    }

    const settings = botData.antiSpamPlus[chatId];
    const action = String(args?.[0] || '').toLowerCase();
    const subAction = String(args?.[1] || '').toLowerCase();

    // ON
    if (action === 'on') {
        settings.enabled = true;
        saveBotData();
        return sock.sendMessage(chatId, {
            text: `✅ *Anti-Spam Plus: ON*\n\n` +
                `📊 Limit: ${settings.limit} messages\n` +
                `⏱️ Time: ${settings.timeWindow}s\n` +
                `⚡ Action: ${settings.action}\n\n` +
                `Ab group mein spam messages automatically delete honge.`
        }, { quoted: msg });
    }

    // OFF
    if (action === 'off') {
        settings.enabled = false;
        saveBotData();
        return sock.sendMessage(chatId, {
            text: `❌ *Anti-Spam Plus: OFF*\n\nSpam detection band ho gayi hai.`
        }, { quoted: msg });
    }

    // Set limit
    if (action === 'limit' && subAction) {
        const limit = parseInt(subAction);
        if (isNaN(limit) || limit < 2 || limit > 30) {
            return sock.sendMessage(chatId, { text: '❌ Limit 2 se 30 ke beech honi chahiye.\n\nExample: .antispamplus limit 8' }, { quoted: msg });
        }
        settings.limit = limit;
        saveBotData();
        return sock.sendMessage(chatId, { text: `⚙️ *Limit set: ${limit} messages*` }, { quoted: msg });
    }

    // Set time window
    if (action === 'time' && subAction) {
        const time = parseInt(subAction);
        if (isNaN(time) || time < 3 || time > 30) {
            return sock.sendMessage(chatId, { text: '❌ Time 3 se 30 seconds ke beech hona chahiye.\n\nExample: .antispamplus time 10' }, { quoted: msg });
        }
        settings.timeWindow = time;
        saveBotData();
        return sock.sendMessage(chatId, { text: `⚙️ *Time window set: ${time}s*` }, { quoted: msg });
    }

    // Set action
    if (action === 'action' && subAction) {
        if (!['delete', 'kick', 'ban'].includes(subAction)) {
            return sock.sendMessage(chatId, { text: '❌ Action sirf delete, kick, ya ban ho sakti hai.\n\nExample: .antispamplus action kick' }, { quoted: msg });
        }
        settings.action = subAction;
        saveBotData();
        return sock.sendMessage(chatId, { text: `⚙️ *Action set: ${subAction}*` }, { quoted: msg });
    }

    // Status with Urdu usage guide
    const status = settings.enabled ? 'ON ✅' : 'OFF ❌';
    return sock.sendMessage(chatId, {
        text: `🛡️ *Anti-Spam Plus — Usage Guide* 🛡️

━━━━━━━━━━━━━━━━━━━━
📌 *Current Status:* ${status}
📊 *Limit:* ${settings.limit} messages
⏱️ *Time Window:* ${settings.timeWindow}s
⚡ *Action:* ${settings.action}

━━━━━━━━━━━━━━━━━━━━
📋 *Usage (Istemaal):*

🟢 *.antispamplus on*
   → Spam detection chalu ho jayegi.
   → Agar koi ${settings.limit} seconds mein ${settings.timeWindow}s ke andar bahut messages bhejega tu automatically ${settings.action} hoga.
   → Admins safe hain.

🔴 *.antispamplus off*
   → Spam detection band ho jayegi.
   → Ab koi bhi kitne bhi messages bhej sakta hai.

⚙️ *.antispamplus limit <number>*
   → Message limit set karo (2-30).
   → Example: .antispamplus limit 8

⚙️ *.antispamplus time <seconds>*
   → Time window set karo (3-30s).
   → Example: .antispamplus time 10

⚙️ *.antispamplus action <type>*
   → delete = messages delete honge
   → kick = user kick hoga
   → ban = user ban hoga

━━━━━━━━━━━━━━━━━━━━
💡 *Tip:* Sirf admins ye command use kar sakte hain.`
    }, { quoted: msg });
};
