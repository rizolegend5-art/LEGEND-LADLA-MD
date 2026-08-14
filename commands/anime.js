const axios = require('axios');

module.exports = async function (sock, chatId, msg) {
    const fallback = [
        { anime: 'Naruto', character: 'Naruto Uzumaki', quote: "I\'m not gonna run away, I never go back on my word! That\'s my nindo: my ninja way!" },
        { anime: 'Attack on Titan', character: 'Levi Ackerman', quote: "The only thing we\'re allowed to do is to believe that we won\'t regret the choice we made." },
        { anime: 'One Piece', character: 'Monkey D. Luffy', quote: "I don\'t want to conquer anything. I just think that the guy with the most freedom in this whole ocean... that\'s the Pirate King!" },
        { anime: 'Dragon Ball Z', character: 'Goku', quote: "Power comes in response to a need, not a desire." },
        { anime: 'Demon Slayer', character: 'Tanjiro Kamado', quote: "No matter how many people you may lose, you have no choice but to go on living. No matter how devastating the blows may be." },
        { anime: 'Death Note', character: 'L', quote: "I\'m the guy who\'s going to catch you. So do what you want." },
        { anime: 'My Hero Academia', character: 'All Might', quote: "It\'s fine now. Why? Because I am here!" },
        { anime: 'Bleach', character: 'Ichigo Kurosaki', quote: "If I were rain, that joins sky and earth that otherwise never touch, could I join two hearts as well?" }
    ];
    try {
        const res = await axios.get('https://animechan.xyz/api/random');
        const d = res.data;
        await sock.sendMessage(chatId, {
            text: `🌸 *Anime Quote*\n\n_"${d.quote}"_\n\n📺 Anime: *${d.anime}*\n👤 Character: *${d.character}*`
        }, { quoted: msg });
    } catch {
        const q = fallback[Math.floor(Math.random() * fallback.length)];
        await sock.sendMessage(chatId, {
            text: `🌸 *Anime Quote*\n\n_"${q.quote}"_\n\n📺 Anime: *${q.anime}*\n👤 Character: *${q.character}*`
        }, { quoted: msg });
    }
};
