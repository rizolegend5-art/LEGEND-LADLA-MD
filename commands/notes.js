module.exports = async function (sock, chatId, msg, q) {
    try {
        const fs=require('fs'); fs.mkdirSync('data',{recursive:true}); fs.appendFileSync('data/notes.txt',(q||'')+'\n'); await sock.sendMessage(chatId,{text:'📝 Note saved'},{quoted:msg});
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Tool error: '+e.message }, { quoted: msg });
    }
};
