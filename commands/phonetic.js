module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '📻 *NATO Phonetic Alphabet*\n\nUsage: .phonetic <text>\nExample: .phonetic Hello' }, { quoted: msg });
    const nato = { A:'Alpha',B:'Bravo',C:'Charlie',D:'Delta',E:'Echo',F:'Foxtrot',G:'Golf',H:'Hotel',I:'India',J:'Juliet',K:'Kilo',L:'Lima',M:'Mike',N:'November',O:'Oscar',P:'Papa',Q:'Quebec',R:'Romeo',S:'Sierra',T:'Tango',U:'Uniform',V:'Victor',W:'Whiskey',X:'X-ray',Y:'Yankee',Z:'Zulu' };
    const result = q.toUpperCase().split('').map(c => nato[c] ? `${c} → ${nato[c]}` : c === ' ' ? '(space)' : c).join('\n');
    await sock.sendMessage(chatId, {
        text: `📻 *NATO Phonetic: "${q}"*\n\n${result}`
    }, { quoted: msg });
};
