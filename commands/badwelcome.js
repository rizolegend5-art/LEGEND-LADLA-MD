module.exports = async function (sock, chatId, msg, q) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = mentioned[0] || null;
    const name = q?.replace(/@\d+/g, '').trim() || 'Oye Tu';

    const welcomes = [
        `Arey yaar phir aa gaya ye 😩\nKisi ne darwaza khula chhod diya kya?\nBhai hum sab ne socha tha teri tayari ho chuki hai bahar\nLekin nahi — tu wapas aa gaya jaise bijli ke bill ke baad bijli aati hai — announce kar ke aur mood kharaab kar ke 😂\nGroup ki shanti gayi bhai, officially!`,

        `Lo bhai aagay — group ka "Breaking News" wapas online ho gaya 📢\nJab ye offline hota hai log sochte hain chutti ho gayi\nJab ye online hota hai log sochte hain — *"Innalillah kya hogaya"* 😭\nBhai teri entry se zyada dramatic scene to film mein nahi hota\nWelcome to the group... matalb, maafi maango hum se 🙏`,

        `Oh Allah — ye phir aa gaya 🤦\nBhai humne socha tha tu kisi aur group mein shift ho gaya tha\nLekin nahi — tu seedha wapas aya jaise galti se delete hua message recover ho jaata hai\nAur us message mein hota bhi kya tha? — Kuch khaas nahi 😂\nChalo group mein phir se nautanki ka season start hua!`,

        `Dekhoooo kaun aaya 👀\nWoh banda jise dekh ke aaina bolta hai "Bhai mera kya kasoor"\nWoh banda jiske message pe sab "seen" karte hain lekin jawab nahi dete\nWoh banda jo group mein aaye to sab sochte hain "Mute button kahan hai?"\n*Bilkul sahi — TU!* 😂 Welcome (nahi)!`,

        `Signal mila, enemy spotted 🚨\nBhai group mein alert ho jaao\nYe banda aaya matlab ab teen kaam honge:\n1️⃣ Sab chup ho jaenge\n2️⃣ Koi jawab nahi dega\n3️⃣ Aur ye phir bhi message karta rahega\nYahi teri zindagi ka summary hai na? 😂 Aaja bhai aa gaya tu!`,

        `Group mein officially mood off ho gaya ✅\nHum sab kitni achi baat kar rahe the\nKoi bol raha tha plans, koi bol raha tha trips\nAur tu aaya aur tune jo pehla message kiya —\nusse parhke sab ne dil se socha "Bhai ye band karo is group ko" 😭\nWelcome (Bilkul bhi nahi) teri entry ho chuki hai!`,

        `Attention everyone! 📣\nWoh banda wapas aa gaya jis ka naam sab save karte hain\n*"Mat Uthao"* ke naam se 😂\nJis ka message aata hai to phone screen ulta kar dete hain\nJis ka voice note koi nahi sunta — even bot bhi headphones lagaa leta hai\nAur aaj wo "Khud" group join kar ke baith gaya hai!\nKhush amdeed... aur Khuda Hafiz bhi 🙏`,

        `🚨 ALERT: Unwanted Package Delivered 🚨\nDear Group Members,\nHum aap ko inform karna chahte hain ke ek aisa package deliver hua hai\nJis ka order kissi ne nahi kiya tha, jis ki zaroorat nahi thi\nAur return policy bhi available nahi hai 😭\nUs package ka naam hai: *${target ? `@${target.split('@')[0]}` : name}*\nHum sab milke dua karte hain ke ye jaldi offline ho 🤲😂`,

        `Bhai tune group join kiya ya group ne saza di? 🤔\nKyunke jitni teri speed se aaya hai tu\nLagta hai bahar bhi koi nahi tha tere paas\nGhar walo ne nikala, mohalla ne hath joray, aur tu seedha group mein aa gaya\nBhai seriously — yahan bhi chain nahi milega tujhe 😂\nPhir bhi aaja, group ka comic relief hi sahi tu!`,

        `Log kehte hain jab koi aata hai to khushi hoti hai 🙂\nLekin *teri* entry pe ek alag hi feeling aati hai —\nWoh feeling jab lagta hai "Bhai ab barbaadi shuru hogi" 😂\nFir bhi — *Officially Unwelcome* teri entry ho chuki hai is group mein\nHum dua karte hain tu jaldi offline ho aur humein chain mile 🤲`,
    ];

    const r = welcomes[Math.floor(Math.random() * welcomes.length)];

    const text =
        `╔═❖•⊰😈 *BAD WELCOME ALERT* ⊱•❖═╗\n` +
        `┃  Target: ${target ? `@${target.split('@')[0]}` : name}\n` +
        `┗━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `${r}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `_🤣 Bhai mazaak hai, dil pe mat lo — ya lo, hume kya!_\n` +
        `╚══════════════════════════╝`;

    await sock.sendMessage(
        chatId,
        { text, mentions: target ? [target] : [] },
        { quoted: msg }
    );
};
