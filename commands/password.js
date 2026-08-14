module.exports = async function (sock, chatId, msg, q) {
    const length = parseInt(q) || 12;
    if (length < 4 || length > 64) return sock.sendMessage(chatId, { text: '🔐 Password length must be between 4 and 64.\nUsage: .password [length]\nExample: .password 16' }, { quoted: msg });
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) password += chars[Math.floor(Math.random() * chars.length)];
    await sock.sendMessage(chatId, {
        text: `🔐 *Password Generator*\n\n🔑 Length: *${length}*\n\n\`\`\`${password}\`\`\`\n\n⚠️ _Save this securely! Don't share it with anyone._`
    }, { quoted: msg });
};
