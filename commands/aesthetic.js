module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '🌸 *Aesthetic Text*\n\nUsage: .aesthetic <text>\nExample: .aesthetic hello world' }, { quoted: msg });
    const normal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const aesthetic = 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９';
    const result = q.split('').map(c => {
        const idx = normal.indexOf(c);
        return idx >= 0 ? aesthetic[idx] : c === ' ' ? '　' : c;
    }).join('');
    await sock.sendMessage(chatId, { text: `🌸 *Aesthetic Text*\n\n${result}` }, { quoted: msg });
};
