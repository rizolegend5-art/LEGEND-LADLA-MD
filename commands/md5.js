module.exports = async function (sock, chatId, msg, q) {
const c=require('crypto'); if(!q)return sock.sendMessage(chatId,{text:'Usage: .md5 text'},{quoted:msg}); await sock.sendMessage(chatId,{text:c.createHash('md5').update(q).digest('hex')},{quoted:msg});
};
