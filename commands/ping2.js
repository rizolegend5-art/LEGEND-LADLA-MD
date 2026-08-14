module.exports = async function (sock, chatId, msg, q) {
const t=Date.now(); await sock.sendMessage(chatId,{text:`🏓 Pong! ${Date.now()-t}ms`},{quoted:msg});
};
