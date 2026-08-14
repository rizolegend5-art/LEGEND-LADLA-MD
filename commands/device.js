// device.js — Show bot host device info
const os = require('os');
module.exports = async function (sock, chatId, msg) {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
    const freeMem  = (os.freemem()  / 1024 / 1024).toFixed(0);
    const cpus     = os.cpus();
    await sock.sendMessage(chatId, {
        text:
            `💻 *Bot Server Info*\n━━━━━━━━━━━━━━━━━━━━\n` +
            `🖥️  OS:      *${os.type()} ${os.arch()}*\n` +
            `🔧 CPU:     *${cpus.length}× ${cpus[0]?.model?.split('@')[0]?.trim()}*\n` +
            `💾 RAM:     *${(totalMem - freeMem).toFixed(0)}MB / ${totalMem}MB*\n` +
            `⚡ Node.js: *${process.version}*\n` +
            `⏱️  Uptime:  *${h}h ${m}m ${s}s*\n` +
            `🌐 Host:    *${os.hostname()}*`,
    }, { quoted: msg });
};
