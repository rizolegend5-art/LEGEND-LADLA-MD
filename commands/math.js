module.exports = async function (sock, chatId, msg) {
    const ops = ['+', '-', '×', '÷'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;
    if (op === '+') { a = Math.floor(Math.random() * 100) + 1; b = Math.floor(Math.random() * 100) + 1; answer = a + b; }
    else if (op === '-') { a = Math.floor(Math.random() * 100) + 51; b = Math.floor(Math.random() * 50) + 1; answer = a - b; }
    else if (op === '×') { a = Math.floor(Math.random() * 20) + 1; b = Math.floor(Math.random() * 20) + 1; answer = a * b; }
    else { b = Math.floor(Math.random() * 12) + 1; a = b * (Math.floor(Math.random() * 12) + 1); answer = a / b; }
    await sock.sendMessage(chatId, {
        text: `🧮 *Math Challenge!*\n\n❓ What is: *${a} ${op} ${b}*?\n\nType your answer! ⏱️\n\n||Answer: ${answer}||`
    }, { quoted: msg });
};
