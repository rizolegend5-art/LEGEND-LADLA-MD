module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '✨ *Fancy Text Generator*\n\nUsage: .fancy <text>\nExample: .fancy Hello World' }, { quoted: msg });
    const bold = t => t.split('').map(c => {
        const off = c >= 'a' && c <= 'z' ? 0x1D41A - 97 : c >= 'A' && c <= 'Z' ? 0x1D400 - 65 : 0;
        return off ? String.fromCodePoint(c.charCodeAt(0) + off) : c;
    }).join('');
    const italic = t => t.split('').map(c => {
        const off = c >= 'a' && c <= 'z' ? 0x1D622 - 97 : c >= 'A' && c <= 'Z' ? 0x1D608 - 65 : 0;
        return off ? String.fromCodePoint(c.charCodeAt(0) + off) : c;
    }).join('');
    const bubble = t => t.split('').map(c => {
        if (c >= 'a' && c <= 'z') return String.fromCodePoint(0x24D0 + c.charCodeAt(0) - 97);
        if (c >= 'A' && c <= 'Z') return String.fromCodePoint(0x24B6 + c.charCodeAt(0) - 65);
        if (c >= '0' && c <= '9') return ['⓪','①','②','③','④','⑤','⑥','⑦','⑧','⑨'][+c];
        return c;
    }).join('');
    const flip = t => t.split('').reverse().map(c => {
        const map = { 'a':'ɐ','b':'q','c':'ɔ','d':'p','e':'ǝ','f':'ɟ','g':'ƃ','h':'ɥ','i':'ᴉ','j':'ɾ','k':'ʞ','l':'l','m':'ɯ','n':'u','o':'o','p':'d','q':'b','r':'ɹ','s':'s','t':'ʇ','u':'n','v':'ʌ','w':'ʍ','x':'x','y':'ʎ','z':'z' };
        return map[c.toLowerCase()] || c;
    }).join('');
    await sock.sendMessage(chatId, {
        text: `✨ *Fancy Text: "${q}"*\n\n𝗕𝗼𝗹𝗱: ${bold(q)}\n𝐼𝑡𝑎𝑙𝑖𝑐: ${italic(q)}\n🅑🅤🅑🅑🅛🅔: ${bubble(q)}\n🙃 Flipped: ${flip(q)}`
    }, { quoted: msg });
};
