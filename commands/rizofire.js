// rizofire.js — DISABLED for safety
module.exports = async function (sock, from, msg) {
    await sock.sendMessage(from, { text: '❌ Yeh command disabled kar di gayi hai.' }, { quoted: msg });
};
