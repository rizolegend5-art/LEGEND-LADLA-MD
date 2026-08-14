module.exports = async function (sock, chatId, msg, q) {
await sock.sendMessage(chatId,{text:'⏳ Bot is running successfully'},{quoted:msg});
};
