module.exports = async function (sock, chatId, msg) {
    const dares = [
        "Send a voice note of you singing your favourite song 🎤",
        "Change your WhatsApp status to 'I love being weird' for 10 minutes 😆",
        "Send a selfie with a funny face 🤪",
        "Text the last person in your contacts list 'Hi bestie!' 📱",
        "Do 20 jumping jacks right now and send a voice note counting them 💪",
        "Send a voice note saying 'I am the best person in this group' in a silly voice 🎭",
        "Change your name in this group to 'Potato' for 5 minutes 🥔",
        "Send your most embarrassing photo 📸",
        "Write a poem about the person above you 📝",
        "Call someone and sing Happy Birthday even if it's not their birthday 🎂",
        "Go outside and shout your own name 3 times 📢",
        "Send a voice note of you doing your best animal impression 🐾",
        "Change your profile picture to a funny meme for 30 minutes 😂",
        "Write 'I am awesome' on your forehead and send a photo ✍️",
        "Send a voice note of your best laugh 😂"
    ];
    const d = dares[Math.floor(Math.random() * dares.length)];
    await sock.sendMessage(chatId, { text: `🔥 *DARE*\n\n🎯 ${d}` }, { quoted: msg });
};
