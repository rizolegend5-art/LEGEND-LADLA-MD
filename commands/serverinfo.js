module.exports = async function (sock, chatId, msg, q) {
return sock.sendMessage(chatId,{text:'🖥️ *Server Info*\nBot: 𝙎𝙍 𝙇𝙀𝘼𝘿𝙀𝙍-𝙈𝘿\nStatus: Online'}, {quoted: msg});
};
