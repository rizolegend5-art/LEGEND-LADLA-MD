const axios = require('axios');

module.exports = async function (sock, chatId, msg) {
    const facts = [
        "🐙 Octopuses have three hearts and blue blood.",
        "🍯 Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs still edible.",
        "🌙 A day on Venus is longer than a year on Venus.",
        "🐘 Elephants are the only animals that can't jump.",
        "🍌 Bananas are technically berries, but strawberries are not.",
        "💤 Humans spend about 1/3 of their life sleeping.",
        "🧠 Your brain generates about 20 watts of electricity — enough to power a light bulb.",
        "🦋 Butterflies taste with their feet.",
        "🐋 A blue whale's heart is so big, a human could swim through its arteries.",
        "⚡ Lightning strikes Earth about 100 times per second.",
        "🌊 The ocean produces over 50% of the world's oxygen.",
        "🐜 Ants never sleep and have no lungs.",
        "🌍 There are more trees on Earth than stars in the Milky Way.",
        "🎵 Music can reduce anxiety by up to 65%.",
        "🦈 Sharks are older than trees — they've existed for over 450 million years.",
        "🐌 Snails can sleep for 3 years at a time.",
        "🌴 Coconuts kill more people per year than sharks.",
        "🧲 A teaspoon of neutron star material weighs about 6 billion tonnes.",
        "🐟 Fish can drown if there isn't enough oxygen in the water.",
        "🔥 Fire is not actually a thing — it is a process (rapid oxidation)."
    ];
    const fact = facts[Math.floor(Math.random() * facts.length)];
    await sock.sendMessage(chatId, { text: `🤓 *Fun Fact!*\n\n${fact}` }, { quoted: msg });
};
