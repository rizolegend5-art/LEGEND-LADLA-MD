module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '⚖️ *BMI Calculator*\n\nUsage: .bmi <weight_kg> <height_cm>\nExample: .bmi 70 175' }, { quoted: msg });
    const parts = q.trim().split(/\s+/);
    if (parts.length < 2) return sock.sendMessage(chatId, { text: '❌ Usage: .bmi <weight_kg> <height_cm>\nExample: .bmi 70 175' }, { quoted: msg });
    const weight = parseFloat(parts[0]);
    const heightCm = parseFloat(parts[1]);
    if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) return sock.sendMessage(chatId, { text: '❌ Invalid values. Use: .bmi 70 175 (weight in kg, height in cm)' }, { quoted: msg });
    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);
    let category, emoji;
    if (bmi < 18.5) { category = 'Underweight 🟡'; emoji = '⚠️'; }
    else if (bmi < 25) { category = 'Normal weight ✅'; emoji = '😊'; }
    else if (bmi < 30) { category = 'Overweight 🟠'; emoji = '⚠️'; }
    else { category = 'Obese 🔴'; emoji = '❗'; }
    await sock.sendMessage(chatId, {
        text: `⚖️ *BMI Result*\n\n👤 Weight: *${weight} kg*\n📏 Height: *${heightCm} cm*\n\n${emoji} BMI: *${bmi}*\n📊 Category: *${category}*\n\n_Note: This is a general indicator only._`
    }, { quoted: msg });
};
