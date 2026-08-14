module.exports = async function (sock, chatId, msg, q) {
if(!q)return; try{await sock.sendMessage(chatId,{text:JSON.stringify(JSON.parse(q),null,2)},{quoted:msg})}catch(e){await sock.sendMessage(chatId,{text:'Invalid JSON'},{quoted:msg})};
};
