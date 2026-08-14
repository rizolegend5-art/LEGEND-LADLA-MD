module.exports = async function (sock, chatId, msg, q) {
if(!q)return; try{await sock.sendMessage(chatId,{text:'Result: '+Function('return '+q)()},{quoted:msg})}catch(e){await sock.sendMessage(chatId,{text:'Error'},{quoted:msg})};
};
