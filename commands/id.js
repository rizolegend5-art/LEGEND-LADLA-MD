module.exports = async function (sock, chatId, msg, q) {
  const text = (q || '').trim();
  const brand = 'LEGEND LADLA LEGEND LADLI MD';
  const data = {
    ping2: '🏓 Pong! Bot response is working.',
    runtime: '⏱️ Runtime command ready.',
    date: '📅 ' + new Date().toDateString(),
    time: '🕒 ' + new Date().toLocaleTimeString(),
    day: '📆 ' + new Date().toLocaleDateString(),
    motivate: '🔥 Keep learning and keep building!',
    joke2: '😄 Why did the coder stay calm? Because they handled the bugs!',
    fact: '💡 Computers follow instructions very fast and accurately.',
    uppercase: text.toUpperCase() || 'Usage: .uppercase text',
    lowercase: text.toLowerCase() || 'Usage: .lowercase text',
    reverse: text.split('').reverse().join('') || 'Usage: .reverse text',
    count: '🔢 Characters: ' + text.length,
    wordcount: '🔢 Words: ' + (text?text.split(/\\s+/).length:0),
    repeat: text ? text : 'Usage: .repeat text',
    emoji: '😀 😎 🔥 🚀 ❤️',
    coinflip: Math.random()>0.5?'🪙 Heads':'🪙 Tails',
    dice: '🎲 ' + (Math.floor(Math.random()*6)+1),
    botname: brand,
    version: 'Version: Advanced Command Pack',
    safe: '✅ Security check command ready',
  };
  let out = data['id'] || ('✅ Command .id is active\\n\\n'+brand+(text?'\\nInput: '+text:''));
  await sock.sendMessage(chatId, {text: out}, {quoted: msg});
};
