module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '🎂 *Age Calculator*\n\nUsage: .age <DD-MM-YYYY>\nExample: .age 15-08-2000' }, { quoted: msg });
    const parts = q.trim().split(/[-\/]/);
    if (parts.length !== 3) return sock.sendMessage(chatId, { text: '❌ Format: .age DD-MM-YYYY\nExample: .age 15-08-2000' }, { quoted: msg });
    const [day, month, year] = parts.map(Number);
    const dob = new Date(year, month - 1, day);
    if (isNaN(dob.getTime()) || dob > new Date()) return sock.sendMessage(chatId, { text: '❌ Invalid date. Use format: .age DD-MM-YYYY' }, { quoted: msg });
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const nextBday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBday <= now) nextBday.setFullYear(now.getFullYear() + 1);
    const daysToNext = Math.ceil((nextBday - now) / (1000 * 60 * 60 * 24));
    await sock.sendMessage(chatId, {
        text: `🎂 *Age Calculator*\n\n📅 DOB: *${day}-${month}-${year}*\n\n🎉 Age: *${years} years, ${months} months, ${days} days*\n\n⏳ Next Birthday in: *${daysToNext} days*`
    }, { quoted: msg });
};
