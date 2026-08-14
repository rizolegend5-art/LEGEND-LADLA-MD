module.exports = async function (sock, chatId, msg) {
    const questions = [
        ["fly like a bird 🐦", "swim like a fish 🐠"],
        ["have unlimited money 💰", "have unlimited time ⏳"],
        ["live in the past 🕰️", "live in the future 🔮"],
        ["be invisible 👻", "be able to fly 🦅"],
        ["never use your phone again 📵", "never watch TV/movies again 📺"],
        ["know when you'll die ☠️", "know how you'll die 🔮"],
        ["always have to whisper 🤫", "always have to shout 📢"],
        ["lose all your money 💸", "lose all your friends 😢"],
        ["be famous but unloved 🌟", "be unknown but loved ❤️"],
        ["fight 100 duck-sized horses 🦆", "fight 1 horse-sized duck 🦆"],
        ["have a pause button in life ⏸️", "have a rewind button ⏪"],
        ["speak all languages 🌍", "play all instruments 🎵"],
        ["live without internet 📵", "live without AC/heat 🌡️"],
        ["be always hot 🔥", "be always cold 🧊"],
        ["have a dog that can talk 🐕", "have a cat that can read 🐈"]
    ];
    const q = questions[Math.floor(Math.random() * questions.length)];
    await sock.sendMessage(chatId, {
        text: `🤔 *Would You Rather...*\n\n🅰️ ${q[0]}\n\n\t\t\t🆚\n\n🅱️ ${q[1]}\n\nReply A or B! 👇`
    }, { quoted: msg });
};
