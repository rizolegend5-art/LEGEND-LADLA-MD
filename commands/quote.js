module.exports = async function (sock, chatId, msg, q) {
const quotes=['Keep learning 🚀','Success needs patience 💎','Stay positive ✨']; await sock.sendMessage(chatId,{text:'💬 '+quotes[Math.floor(Math.random()*quotes.length)]},{quoted:msg});
};
