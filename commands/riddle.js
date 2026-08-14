module.exports = async function (sock, chatId, msg) {
    const riddles = [
        { q: "I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. What am I?", a: "A Map 🗺️" },
        { q: "The more you take, the more you leave behind. What am I?", a: "Footsteps 👣" },
        { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "An Echo 📢" },
        { q: "What has hands but can't clap?", a: "A Clock ⏰" },
        { q: "I'm light as a feather, yet the strongest man can't hold me for five minutes. What am I?", a: "Breath 💨" },
        { q: "What has keys but no locks, space but no room, and you can enter but can't go inside?", a: "A Keyboard ⌨️" },
        { q: "The more you look at me, the less you see. What am I?", a: "Darkness 🌑" },
        { q: "I have a head and a tail, but no body. What am I?", a: "A Coin 🪙" },
        { q: "What can travel around the world while staying in a corner?", a: "A Stamp 📮" },
        { q: "What has to be broken before you can use it?", a: "An Egg 🥚" },
        { q: "I'm always in front of you but can never be seen. What am I?", a: "The Future 🔮" },
        { q: "What gets wetter as it dries?", a: "A Towel 🧻" }
    ];
    const r = riddles[Math.floor(Math.random() * riddles.length)];
    await sock.sendMessage(chatId, {
        text: `🧩 *Riddle Time!*\n\n❓ ${r.q}\n\n_Reply with your answer! Spoiler below (rot13 won't help 😄)_\n||Answer: ${r.a}||`
    }, { quoted: msg });
};
