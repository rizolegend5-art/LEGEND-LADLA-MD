module.exports = async function (sock, chatId, msg, q) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = mentioned[0] || null;
    const name = q?.replace(/@\d+/g, '').trim() || 'Tu';

    const burns = [
        [
            `🔥 *BURN #1 — IQ Level:*\nTeri IQ itni kam hai ke\njab tune calculator pe "1+1" daala to usne bhi help maangi\nMath teacher ne teri copy dekhi to tears aaye — khushi ke nahi, dard ke\nAur science book ne bhi tujhe parhte dekh ke resign kar li 💀`,

            `🔥 *BURN #2 — Style Check:*\nTera style itna unique hai ke\njab tu bahar nikalta hai log sochte hain "Koi show chal raha hai kya?"\nTune jo kapde pehne hain — andheron mein bhi sharminda ho jaate hain\nAur tera hairstyle? Bhai barber ne bola "Iske baad main retire karunga" 😂`,

            `🔥 *BURN #3 — Social Life:*\nTeri social life itni active hai ke\njab tu birthday manata hai — sirf teri ammi aati hain, aur woh bhi 10 minute ke liye\nTere contacts mein 200 log hain lekin sab ne tujhe\n*"Do Not Disturb"* pe save kiya hua hai 😭`,

            `💀 *FINAL BURN — Summary:*\nOverall analysis: Tu ek aisa insaan hai\njisne Google pe "Main bekar hoon" search kiya to Google ne bola\n*"Haan bhai, kuch aur search kar lo — yeh confirm hai"* 🤣\nGod bless you bhai — tujhe zaroorat hai 🙏`,
        ],
        [
            `🔥 *BURN #1 — Reputation Check:*\nTere baare mein logon ne survey kiya\nSawaal: "Yeh kaisa banda hai?"\n1st Answer: "Kaun?"\n2nd Answer: "Pehchana nahi"\n3rd Answer: "Acha woh... haan yaad aa gaya — woh jo group ka mute button dhundta hai"\nYahi teri reputation hai bhai 😂`,

            `🔥 *BURN #2 — Future Plans:*\nTune apni zindagi mein kya plan kiya tha?\n"Bada hoke kuch karunga" — sab ne suna\nLekin bhai tera "bada hona" hi nahi hua\nAbhi bhi teen baj ke tees minute pe uth ke chai peeta hai\nAur raat ko 2 baje TikTok scroll karta hai sooch ke "Kal se change karunga" 😩`,

            `🔥 *BURN #3 — Friendship Level:*\nTere doston ne ek group banaya hai jisme tu nahi hai\nUs group ka naam hai: *"Sukoon Wala Group"* 😂\nJab bhi tu asli group mein message karta hai\nUs group mein aata hai: "Bhai phir shuru ho gaya"\nAur sab ek saath "😭😭😭" bhejte hain`,

            `💀 *FINAL BURN — Ultimate Roast:*\nAkhri baat bhai — teri poori zindagi ek meme hai\nLekin aisi meme jo viral nahi hoti\nJo sirf ek baar share hoti hai aur sab bhool jaate hain\nAur jab koi dhundta hai to bolta hai: "Haan yaad hai — boring wala tha na?" 💀🤣\nBhai khuda tujhe lambi umr de — taake zyada roast ho sake!`,
        ],
        [
            `🔥 *BURN #1 — Dimag Ki Dukaan:*\nTera dimag ek closed shop hai\nJisme display pe likha hai: "Stock Khatam"\nAur door pe taala laga hua hai jab se tune school join kiya\nTeacher ne teri attendance dekhi to bol diya: "Yeh aata bhi kyu hai?" 😭`,

            `🔥 *BURN #2 — WhatsApp Wala:*\nTu group mein aisa message karta hai ke\npehle sab 👀 lagaate hain — phir poora group chup ho jaata hai\nKoi reply nahi karta kyunke sab dua kar rahe hote hain\nke "Bhai khud hi delete kar le" 😂\nAur tu 10 minute baad likh deta hai: "Sab so gaye kya?" 💀`,

            `🔥 *BURN #3 — Life Achievement:*\nTune zindagi mein kya achieve kiya?\nEk — Sone ka world record toda (19 ghante)\nDo — Netflix ka "Are you still watching?" 47 baar dekha\nTeen — Ek hi WhatsApp status 3 din tak lagaya rakha\nBhai awards milne chahiye tujhe — ghalat category mein 😩`,

            `💀 *FINAL BURN — Farewell Toast:*\nBhai ek aakhri baat —\nJab bhi tu group mein "Good morning" bhejta hai\nLogo ke din ki shuruat ghalat ho jaati hai 😂\nPhir bhi hum chahte hain ke tu khush rahe\nDoor rahe — lekin khush rahe 🙏\nYahi teri aur humari dua hai bhai! 🤣💀`,
        ],
        [
            `🔥 *BURN #1 — Fashion Police:*\nBhai teri dressing sense itni hatke hai ke\njab tu market gaya to dukandaar ne pehle soch liya "CCTV footage mein kaun hai?"\nTune jo shirt pehni thi — uss shirt ne khud request ki thi ke usay dho ke bhi mat pehno\nAur joote? Bhai joote ne bola: "Paon chhod do mujhe" 😂`,

            `🔥 *BURN #2 — Cooking Skills:*\nTune ek baar khana banaya\nKitchen ne smoke detector nahi — *ambulance* bulai\nBilli jo ghar ke aas paas rehti thi\nUs din se aaj tak wapas nahi aayi 😭\nAur ammi ne kaha: "Beta baazar se laao, ghar mat banaao" 🤣`,

            `🔥 *BURN #3 — Batting Aur Bowling:*\nTu cricket mein bhi useless hai —\nJab batting karta hai — out zero pe\nJab bowling karta hai — wides ki line lagg jaati hai\nJab fielding karta hai — ball tere paas se guzar ke boundary jaati hai\nTeam ne tera naam *"12th Man"* rakha hai — matlab bench pe baithe raho 💀`,

            `💀 *FINAL BURN — Grand Finale:*\nBhai teri complete profile:\n📌 IQ: Loading...\n📌 Style: Error 404\n📌 Social Life: Server Down\n📌 Future: Under Construction (Since Birth)\n📌 Use: Decorative Purposes Only\n\nPhir bhi bhai hum tujhse pyar karte hain — teri har galti yaad karti hai humein 😂🤣\nAllah salamat rakhe tujhe — aur humein tujhse 🙏`,
        ],
    ];

    const selected = burns[Math.floor(Math.random() * burns.length)];

    const text =
        `╔═❖•⊰💀 *BURN SESSION* ⊱•❖═╗\n` +
        `┃  🎯 Shikaar: ${target ? `@${target.split('@')[0]}` : name}\n` +
        `┃  🔥 Levels: 3 Burns + 1 Final\n` +
        `┗━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        selected.join('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n') +
        `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `_😂 Bhai sab mazaak hai — dil pe mat lo, ya lo hume kya farak!_ 🤣\n` +
        `╚══════════════════════════╝`;

    await sock.sendMessage(
        chatId,
        { text, mentions: target ? [target] : [] },
        { quoted: msg }
    );
};
