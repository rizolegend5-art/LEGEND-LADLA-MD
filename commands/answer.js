// answer.js — Answer/response for Truth or Dare game
const ANSWERS = [
    'Bilkul haan! 😎','Nahi bilkul nahi! 😤','Shayad... sochna hoga 🤔',
    'Haan, lekin secretly 😏','100% haan! 🔥','Kuch nahi bolunga 🤐',
    'Tum sach sun nahi sako ge 😂','Akela sach jaanta hoon main 🫡',
    'Agar bata diya to duniya hil jayegi 😅','Haan magar regret bhi hai 😬',
    'Life mein sab kuch nahi bata sakte yaar 🙈','Mere dil mein raaz hai 🔒',
];
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    const question = q || 'Kya yeh sach hai?';
    const chosen   = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    await sock.sendMessage(chatId, {
        text:
            `🎯 *Truth Answer*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `❓ *Sawaal:* ${question}\n\n` +
            `💬 *Jawab:* ${chosen}`,
    }, { quoted: msg });
};
