const axios = require('axios');

module.exports = async function (sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '🌤️ *Weather*\n\nUsage: .weather <city>\nExample: .weather Karachi' }, { quoted: msg });
    try {
        const res = await axios.get(`https://wttr.in/${encodeURIComponent(q)}?format=j1`);
        const data = res.data;
        const current = data.current_condition[0];
        const area = data.nearest_area[0];
        const city = area.areaName[0].value;
        const country = area.country[0].value;
        const temp_c = current.temp_C;
        const temp_f = current.temp_F;
        const feels = current.FeelsLikeC;
        const humidity = current.humidity;
        const desc = current.weatherDesc[0].value;
        const wind = current.windspeedKmph;
        const uv = current.uvIndex;
        await sock.sendMessage(chatId, {
            text: `🌤️ *Weather Report*\n\n📍 *${city}, ${country}*\n\n🌡️ Temperature: *${temp_c}°C / ${temp_f}°F*\n🤔 Feels Like: *${feels}°C*\n☁️ Condition: *${desc}*\n💧 Humidity: *${humidity}%*\n💨 Wind Speed: *${wind} km/h*\n☀️ UV Index: *${uv}*`
        }, { quoted: msg });
    } catch {
        await sock.sendMessage(chatId, { text: `❌ Could not fetch weather for "${q}". Please check the city name.` }, { quoted: msg });
    }
};
