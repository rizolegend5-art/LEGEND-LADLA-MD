const settings = require('../settings');

async function ownerCommand(sock, from, msg) {
    const num = settings.ownerNumber; // e.g. 923048494161
    const name = settings.ownerName;

    const ownerText =
       `╔══════════════════════╗\n` +
       `║  👑 *OWNER INFO* 👑      ║\n` +
       `╚══════════════════════╝\n\n` +
        `🤴 *Naam:* ${name}\n` +
        `📱 *Number:* +${num}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💾 *Number Save Karo:*\n` +
        `👇 Neeche wale button se contact save karo\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> 🤴 *LEGEND LADLA LEGEND LADLI MD*`;

    // Send text message
    await sock.sendMessage(from, { text: ownerText }, { quoted: msg });

    // Send contact card so user can save the number directly
    const vcard =
        `BEGIN:VCARD\n` +
        `VERSION:3.0\n` +
        `FN:${name}\n` +
        `ORG:LEGEND LADLA LEGEND LADLI MD;\n` +
        `TEL;type=CELL;type=VOICE;waid=${num}:+${num}\n` +
        `END:VCARD`;

    await sock.sendMessage(from, {
        contacts: {
            displayName: name,
            contacts: [{ vcard }]
        }
    }, { quoted: msg });
}

module.exports = ownerCommand;
