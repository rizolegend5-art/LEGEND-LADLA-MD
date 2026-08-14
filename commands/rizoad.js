module.exports = async function (sock, from, msg, isAdmin) {
    try {
        if (!isAdmin) {
            return await sock.sendMessage(from, {
                text: "❌ Only owner/admin can use this command."
            }, { quoted: msg });
        }

        const now = Date.now();
        global.rizoAdCooldown = global.rizoAdCooldown || {};
        const last = global.rizoAdCooldown[from] || 0;

        if (now - last < 60000) {
            return await sock.sendMessage(from, {
                text: "⏳ Please wait before using .rizoad again."
            }, { quoted: msg });
        }

        global.rizoAdCooldown[from] = now;

        const rizoad = `
🔥 *𝙎𝙍 𝙇𝙀𝘼𝘿𝙀𝙍-𝙈𝘿* 🔥

⚡ Welcome To Our Official Channel ⚡

📢 Join Channel:
https://whatsapp.com/channel/0029VbDa1YS7dmeXFbfv4D11

━━━━━━━━━━━━━━━

🚀 Updates • Features • News
🖤 Stay Connected

━━━━━━━━━━━━━━━
`;

        await sock.sendMessage(from, { text: rizoad }, { quoted: msg });
    } catch (e) {
        console.error("rizoad error:", e);
        try {
            await sock.sendMessage(from, { text: "❌ Command error occurred." }, { quoted: msg });
        } catch {}
    }
};
