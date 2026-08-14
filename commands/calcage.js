// calcage.js — Calculate exact age from birth date
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!q) return sock.sendMessage(chatId, { text: '❌ Usage: .calcage DD-MM-YYYY\nMisaal: .calcage 15-08-2000' }, { quoted: msg });
    const parts = q.split(/[-/]/);
    if (parts.length !== 3) return sock.sendMessage(chatId, { text: '❌ Format: DD-MM-YYYY' }, { quoted: msg });
    const [dd, mm, yyyy] = parts.map(Number);
    if (!dd || !mm || !yyyy || mm > 12 || dd > 31) return sock.sendMessage(chatId, { text: '❌ Invalid date.' }, { quoted: msg });
    const birth = new Date(yyyy, mm - 1, dd);
    const now   = new Date();
    if (birth > now) return sock.sendMessage(chatId, { text: '❌ Future date hai!' }, { quoted: msg });
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days  = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    await sock.sendMessage(chatId, {
        text:
            `🎂 *Age Calculator*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `📅 Birth: *${String(dd).padStart(2,'0')}-${String(mm).padStart(2,'0')}-${yyyy}*\n` +
            `🎉 Age:   *${years} years, ${months} months, ${days} days*\n` +
            `📆 Aaj:   ${now.toDateString()}`,
    }, { quoted: msg });
};
