// convert.js — Unit converter
module.exports = async function (sock, chatId, msg, isAdmin, q) {
    if (!q)
        return sock.sendMessage(chatId, {
            text: '❌ Usage: .convert <value> <from> <to>\n\nExamples:\n.convert 100 km mi\n.convert 37 C F\n.convert 5 kg lb\n\nSupported: km/mi, C/F/K, kg/lb, m/ft, L/gal',
        }, { quoted: msg });
    const parts = q.split(/\s+/);
    const val = parseFloat(parts[0]);
    const from = (parts[1] || '').toUpperCase();
    const to   = (parts[2] || '').toUpperCase();
    if (isNaN(val)) return sock.sendMessage(chatId, { text: '❌ Valid number dein.' }, { quoted: msg });
    const tbl = {
        'KM-MI': v=>(v*0.621371).toFixed(4), 'MI-KM': v=>(v*1.60934).toFixed(4),
        'KG-LB': v=>(v*2.20462).toFixed(4), 'LB-KG': v=>(v*0.453592).toFixed(4),
        'M-FT':  v=>(v*3.28084).toFixed(4), 'FT-M':  v=>(v*0.3048).toFixed(4),
        'C-F':   v=>((v*9/5)+32).toFixed(2), 'F-C':  v=>(((v-32)*5)/9).toFixed(2),
        'C-K':   v=>(v+273.15).toFixed(2),   'K-C':  v=>(v-273.15).toFixed(2),
        'L-GAL': v=>(v*0.264172).toFixed(4), 'GAL-L':v=>(v*3.78541).toFixed(4),
    };
    const fn = tbl[`${from}-${to}`];
    if (!fn) return sock.sendMessage(chatId, { text: `❌ "${from} → ${to}" supported nahi.` }, { quoted: msg });
    await sock.sendMessage(chatId, {
        text: `🔄 *Unit Converter*\n━━━━━━━━━━━━━━━━━━━━\n📥 Input:  *${val} ${from}*\n📤 Result: *${fn(val)} ${to}*`,
    }, { quoted: msg });
};
