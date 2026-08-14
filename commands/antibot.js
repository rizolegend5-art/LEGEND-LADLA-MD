
const fs = require('fs-extra');
const path = require('path');
const FILE = path.join(__dirname,'../data/group_antibot.json');
function load(){try{return fs.readJsonSync(FILE)}catch(e){return {}}}
function save(x){fs.ensureFileSync(FILE);fs.writeJsonSync(FILE,x,{spaces:2})}
module.exports = async function(sock, chatId, msg, isAdmin, q){
 if(!chatId.endsWith('@g.us')) return sock.sendMessage(chatId,{text:'❌ Group only command.'},{quoted:msg});
 const db=load();
 if(['on','off'].includes((q||'').toLowerCase()) && !isAdmin)
  return sock.sendMessage(chatId,{text:'❌ Admin only.'},{quoted:msg});
 db[chatId]=db[chatId]||{};
 if(q) db[chatId].value=q;
 db[chatId].enabled=(q||'').toLowerCase()!=='off';
 save(db);
 await sock.sendMessage(chatId,{text:`🛡️ *𝐃𝐀𝐊𝐔-𝙈𝘿*\n\n✅ antibot system updated\nStatus: ${db[chatId].enabled?'ON':'OFF'}${q?`\nData: ${q}`:''}`},{quoted:msg});
};
