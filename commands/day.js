// day.js — Show today's date and a daily quote
const QUOTES = [
    'Mehnat karo — nateeja zaroor milega. 💪',
    'Ek din mein duniya nahi badlti, lekin koshish zaroor karo. 🌟',
    'Haar karne wala sirf woh hota hai jo koshish chhor deta hai. 🔥',
    'Zindagi ka har din ek naya mauka hai. ✨',
    'Apne aap par yakeen rakho. 🚀',
    'Kamyaabi ki koi shortcut nahi — sirf mehnat karo. 💡',
];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
module.exports = async function (sock, chatId, msg) {
    const now   = new Date();
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    await sock.sendMessage(chatId, {
        text:
            `📅 *Today\'s Info*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `📆 *Day:*  ${DAYS[now.getDay()]}\n` +
            `📅 *Date:* ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}\n` +
            `🕒 *Time:* ${now.toLocaleTimeString()}\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `💬 *Quote:*\n_"${quote}"_`,
    }, { quoted: msg });
};
