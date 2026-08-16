require('dotenv').config();
const settings = require('./settings');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, downloadContentFromMessage, jidNormalizedUser, Browsers, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const { OpenAI } = require('openai');

// Del Command - Deletes replied message + .del command message itself
async function delCommand(sock, from, msg, isAdmin) {
    const mc = msg.message;
    
    // Extract contextInfo from the replied message using comprehensive traversal
    const contextInfo = mc?.extendedTextMessage?.contextInfo
        || mc?.imageMessage?.contextInfo
        || mc?.videoMessage?.contextInfo
        || mc?.stickerMessage?.contextInfo
        || mc?.audioMessage?.contextInfo
        || mc?.documentMessage?.contextInfo
        || mc?.buttonsResponseMessage?.contextInfo
        || mc?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo
        || mc?.ephemeralMessage?.message?.imageMessage?.contextInfo
        || mc?.ephemeralMessage?.message?.videoMessage?.contextInfo
        || mc?.viewOnceMessage?.message?.extendedTextMessage?.contextInfo
        || mc?.viewOnceMessage?.message?.imageMessage?.contextInfo
        || mc?.viewOnceMessage?.message?.videoMessage?.contextInfo
        || mc?.viewOnceMessageV2?.message?.extendedTextMessage?.contextInfo
        || mc?.viewOnceMessageV2?.message?.imageMessage?.contextInfo
        || mc?.viewOnceMessageV2?.message?.videoMessage?.contextInfo
        || null;

    if (!contextInfo || !contextInfo.stanzaId) {
        return await sock.sendMessage(from, { text: '❌ Pehle kisi message ko reply karo phir .del type karo.' }, { quoted: msg });
    }

    const stanzaId = contextInfo.stanzaId;
    const remoteJid = contextInfo.remoteJid || from;
    
    // Determine participant - try messageLogs first for exact match, then contextInfo
    let participant;
    if (messageLogs[stanzaId] && messageLogs[stanzaId].sender) {
        participant = messageLogs[stanzaId].sender;
    } else {
        participant = contextInfo.participant || remoteJid;
    }

    // Determine fromMe - check if the replied message was sent by the bot
    let fromMe = false;
    if (messageLogs[stanzaId] && messageLogs[stanzaId].fromMe !== undefined) {
        fromMe = messageLogs[stanzaId].fromMe;
    } else {
        const botNumber = jidNormalizedUser(sock.user.id);
        const _normalBot = botNumber.replace(/:[0-9]+@/, '@');
        const _normalParticipant = participant.replace(/:[0-9]+@/, '@');
        fromMe = _normalBot === _normalParticipant;
    }

    // Build the delete key
    const deleteKey = {
        remoteJid: remoteJid,
        fromMe: fromMe,
        id: stanzaId,
        participant: participant
    };

    let deleted = false;
    try {
        await sock.sendMessage(from, { delete: deleteKey });
        deleted = true;
    } catch (e) {
        // If it failed, try with fromMe: true
        try {
            const deleteKeyOwn = {
                remoteJid: remoteJid,
                fromMe: true,
                id: stanzaId,
                participant: participant
            };
            await sock.sendMessage(from, { delete: deleteKeyOwn });
            deleted = true;
        } catch (e2) {
            // If still failed, try without participant (for private chats)
            try {
                const deleteKeyNoP = {
                    remoteJid: remoteJid,
                    fromMe: false,
                    id: stanzaId
                };
                await sock.sendMessage(from, { delete: deleteKeyNoP });
                deleted = true;
            } catch (e3) {
                await sock.sendMessage(from, { text: '❌ Message delete nahi hua. Shayad bot admin nahi hai ya message 7 din purana hai.' }, { quoted: msg });
                return;
            }
        }
    }

    // Delete the .del command message itself first
    try {
        await sock.sendMessage(from, { delete: msg.key });
    } catch (e) {}
    
    // Show confirmation only if message was deleted
    if (deleted) {
        try {
            // Send confirmation and then delete it after 3 seconds
            const confirmMsg = await sock.sendMessage(from, { text: '✅ Message delete ho gaya.' });
            setTimeout(async () => {
                try {
                    await sock.sendMessage(from, { delete: confirmMsg.key });
                } catch (e) {}
            }, 3000);
        } catch (e) {}
    }
}

// Import Commands
const commands = {
    song: require('./commands/song'),
    tayyab: require('./commands/tayyab'),
    setdp: require('./commands/setdp'),
    botdp: require('./commands/botdp'),
    botname: require('./commands/botname'),
    pair: require('./commands/pair'),
    start: require('./commands/start'),
    rizoad: require('./commands/rizoad'),
    video: require('./commands/video'),
    kick: require('./commands/kick'),
    private: require('./commands/private'),
    public: require('./commands/public'),
    owner: require('./commands/owner'),
    ai: require('./commands/ai'),
    antilink: require('./commands/antilink'),
    anticall: require('./commands/anticall'),
    status: require('./commands/status'),
    antidelete: require('./commands/antidelete'),
    ping: require('./commands/ping'),
    autoreacts: require('./commands/autoreacts'),
    hidetag: require('./commands/hidetag'),
    tagall: require('./commands/tagall'),
    setname: require('./commands/setname'),
    insta: require('./commands/insta'),
    tiktok: require('./commands/tiktok'),
    dp: require('./commands/dp'),
    vv: require('./commands/vv'),
    vvdm: require('./commands/vvdm'),

    joke: require('./commands/joke'),
    meme: require('./commands/meme'),
    groupinfo: require('./commands/groupinfo'),
    gdrive: require('./commands/gdrive'),
    mf: require('./commands/mf'),
    translate: require('./commands/translate').handleTranslateCommand,
    // autostatus removed - duplicate of status (same file)
    
    // New Commands
    apk: require('./commands/apk'),
    autoread: require('./commands/autoread').autoreadCommand,

    character: require('./commands/character'),
    emojimix: require('./commands/emojimix'),
    facebook: require('./commands/facebook'),
    hack: require('./commands/hack'),
    accept: require('./commands/accept'),
    kickoffline: require('./commands/kickoffline'),
    antistatus: require('./commands/antistatus'),
    statusfuck: require('./commands/antistatus'),
    antisticker: require('./commands/antisticker'),

    // ===== 100 NEW COMMANDS =====
    // Fun & Entertainment
    quote: require('./commands/quote'),
    fact: require('./commands/fact'),
    riddle: require('./commands/riddle'),
    '8ball': require('./commands/8ball'),
    dice: require('./commands/dice'),
    coin: require('./commands/coin'),
    rps: require('./commands/rps'),
    truth: require('./commands/truth'),
    dare: require('./commands/dare'),
    compliment: require('./commands/compliment'),
    roast: require('./commands/roast'),
    badwelcome: require('./commands/badwelcome'),
    burn: require('./commands/burn'),
    lovecalc: require('./commands/lovecalc'),
    iq: require('./commands/iq'),
    rate: require('./commands/rate'),
    fortune: require('./commands/fortune'),
    wyr: require('./commands/wyr'),
    ship: require('./commands/ship'),
    zodiac: require('./commands/zodiac'),
    anime: require('./commands/anime'),
    // Utility
    calc: require('./commands/calc'),
    time: require('./commands/time'),
    weather: require('./commands/weather'),
    wiki: require('./commands/wiki'),
    define: require('./commands/define'),
    password: require('./commands/password'),
    base64: require('./commands/base64'),
    reverse: require('./commands/reverse'),
    upper: require('./commands/upper'),
    lower: require('./commands/lower'),
    fancy: require('./commands/fancy'),
    morse: require('./commands/morse'),
    binary: require('./commands/binary'),
    poll: require('./commands/poll'),
    news: require('./commands/news'),
    uuid: require('./commands/uuid'),
    currency: require('./commands/currency'),
    aesthetic: require('./commands/aesthetic'),
    randomnum: require('./commands/randomnum'),
    repeat: require('./commands/repeat'),
    wordcount: require('./commands/wordcount'),
    charcount: require('./commands/charcount'),
    bmi: require('./commands/bmi'),
    age: require('./commands/age'),
    roman: require('./commands/roman'),
    phonetic: require('./commands/phonetic'),
    shorten: require('./commands/shorten'),
    whoami: require('./commands/whoami'),
    // Media & Downloads
    lyrics: require('./commands/lyrics'),
    catimg: require('./commands/catimg'),
    dogimg: require('./commands/dogimg'),
    sticker: require('./commands/sticker'),
    toimg: require('./commands/toimg'),
    stealsticker: require('./commands/stealsticker'),
    youtube: require('./commands/youtube'),
    spotify: require('./commands/spotify'),
    pinterest: require('./commands/pinterest'),
    twitter: require('./commands/twitter'),
    gif: require('./commands/gif'),
    wallpaper: require('./commands/wallpaper'),
    // Group Management
    promote: require('./commands/promote'),
    demote: require('./commands/demote'),
    mute: require('./commands/mute'),
    unmute: require('./commands/unmute'),
    link: require('./commands/link'),
    revoke: require('./commands/revoke'),
    setdesc: require('./commands/setdesc'),
    leave: require('./commands/leave'),
    welcome: require('./commands/welcome').welcomeCommand,
    goodbye: require('./commands/goodbye').goodbyeCommand,
    setwelcome: require('./commands/setwelcome'),
    warn: require('./commands/warn'),
    warnings: require('./commands/warnings'),
    clearwarn: require('./commands/clearwarn'),
    report: require('./commands/report'),
    rules: require('./commands/rules'),
    listadmins: require('./commands/listadmins'),
    listmembers: require('./commands/listmembers'),
    everyone: require('./commands/everyone'),
    slowmode: require('./commands/slowmode'),
    // Owner / Bot
    botinfo: require('./commands/botinfo'),
    uptime: require('./commands/uptime'),
    block: require('./commands/block'),
    unblock: require('./commands/unblock'),
    getpp: require('./commands/getpp'),
    setbio: require('./commands/setbio'),
    getbio: require('./commands/getbio'),
    broadcast: require('./commands/broadcast'),
    listgroups: require('./commands/listgroups'),
    join: require('./commands/join'),
    // Animal Facts
    catfact: require('./commands/catfact'),
    dogfact: require('./commands/dogfact'),
    // Games
    quiz: require('./commands/quiz'),
    trivia: require('./commands/trivia'),
    math: require('./commands/math'),
    scramble: require('./commands/scramble'),
    hangman: require('./commands/hangman'),
    tictactoe: require('./commands/tictactoe'),
    guessnumber: require('./commands/guessnumber'),
    countdown: require('./commands/countdown'),
    memory: require('./commands/memory'),

    // ===== 20 POWERFUL GROUP CONTROL COMMANDS =====
    ban: require('./commands/ban'),
    unban: require('./commands/unban'),
    banlist: require('./commands/banlist'),
    softban: require('./commands/softban'),
    kickall: require('./commands/kickall'),
    lockgroup: require('./commands/lockgroup'),
    unlockgroup: require('./commands/unlockgroup'),
    freeze: require('./commands/freeze'),
    unfreeze: require('./commands/unfreeze'),
    muteuser: require('./commands/muteuser'),
    unmuteuser: require('./commands/unmuteuser'),
    mutelist: require('./commands/mutelist'),
    resetwarn: require('./commands/resetwarn'),
    warnall: require('./commands/warnall'),
    warnlist: require('./commands/warnlist'),
    groupstats: require('./commands/groupstats'),
    addmember: require('./commands/addmember'),
    setgrouppic: require('./commands/setgrouppic'),
    antiflood: require('./commands/antiflood'),
    schedule: require('./commands/schedule'),
    autoaccept: require('./commands/autoaccept'),
    autodemote: require('./commands/autodemote'),
    adminonly: require('./commands/adminonly'),
    memberlog: require('./commands/memberlog'),
    grouplogs: require('./commands/grouplogs'),
    antijoin: require('./commands/antijoin'),
    antitag: require('./commands/antitag'),
    antispamplus: require('./commands/antispamplus'),
    antibot: require('./commands/antibot'),
    raidmode: require('./commands/raidmode'),
    groupbackup: require('./commands/groupbackup'),
    restoregroup: require('./commands/restoregroup'),
    setrules: require('./commands/setrules'),
    verify: require('./commands/verify'),
    captcha: require('./commands/captcha'),
    trust: require('./commands/trust'),
    blacklist: require('./commands/blacklist'),
    whitelist: require('./commands/whitelist'),
    nickname: require('./commands/nickname'),
    warnlimit: require('./commands/warnlimit'),
    welcomeai: require('./commands/welcomeai'),
    activity: require('./commands/activity'),
    topmembers: require('./commands/topmembers'),
    silentmode: require('./commands/silentmode'),
    schedulemsg: require('./commands/schedulemsg'),
    autoreplygroup: require('./commands/autoreplygroup'),
    keywordreply: require('./commands/keywordreply'),
    mentionguard: require('./commands/mentionguard'),
    linkguard: require('./commands/linkguard'),
    fileguard: require('./commands/fileguard'),
    stickerguard: require('./commands/stickerguard'),
    mediaonly: require('./commands/mediaonly'),
    textonly: require('./commands/textonly'),
    groupfreeze: require('./commands/groupfreeze'),
    securitycheck: require('./commands/securitycheck'),
    // ===== 30 NEW TOOLS =====
    systeminfo: require('./commands/systeminfo'),
    deviceinfo: require('./commands/deviceinfo'),
    ownerinfo: require('./commands/ownerinfo'),
    profilecard: require('./commands/profilecard'),
    uid: require('./commands/uid'),
    stickerid: require('./commands/stickerid'),
    tts: require('./commands/tts'),
    voicemsg: require('./commands/voicemsg'),
    shayari: require('./commands/shayari'),
    statusmaker: require('./commands/statusmaker'),
    movieinfo: require('./commands/movieinfo'),
    githubuser: require('./commands/githubuser'),
    npmsearch: require('./commands/npmsearch'),
    hashgen: require('./commands/hashgen'),
    passwordcheck: require('./commands/passwordcheck'),
    randompick: require('./commands/randompick'),
    servercheck: require('./commands/servercheck'),
    urlscan: require('./commands/urlscan'),
    emojifind: require('./commands/emojifind'),
    textimprove: require('./commands/textimprove'),
    spellfix: require('./commands/spellfix'),
    mdformat: require('./commands/mdformat'),
    regextest: require('./commands/regextest'),
    backupinfo: require('./commands/backupinfo'),
    servertime: require('./commands/servertime'),
    jsonclean: require('./commands/jsonclean'),
    numberinfo: require('./commands/numberinfo'),
    linkcheck: require('./commands/linkcheck'),
    textstats: require('./commands/textstats'),
    devinfo: require('./commands/devinfo'),
    devbypass: require('./commands/devbypass'),
    channel: require('./commands/channel'),
    follow: require('./commands/followchannel'),
    followchannel: require('./commands/followchannel'),
    // ===== SHORTCUT COMMANDS =====
    af: require('./commands/antiflood'),
    bc: require('./commands/base64'),
    bio: require('./commands/getbio'),
    cat: require('./commands/catimg'),
    cc: require('./commands/charcount'),
    cw: require('./commands/charcount'),
    dict: require('./commands/define'),
    dog: require('./commands/dogimg'),
    fb: require('./commands/facebook'),
    gs: require('./commands/groupstats'),
    guess: require('./commands/guessnumber'),
    ig: require('./commands/insta'),
    info: require('./commands/botinfo'),
    lg: require('./commands/lockgroup'),
    lyric: require('./commands/lyrics'),
    ml: require('./commands/listmembers'),
    mu: require('./commands/muteuser'),
    pass: require('./commands/password'),
    pfp: require('./commands/getpp'),
    pin: require('./commands/pinterest'),
    rnum: require('./commands/randomnum'),
    rw: require('./commands/reverse'),
    sb: require('./commands/softban'),
    sch: require('./commands/schedule'),
    sgp: require('./commands/setgrouppic'),
    ss: require('./commands/sticker'),
    stk: require('./commands/sticker'),
    trt: require('./commands/translate'),
    ttt: require('./commands/tictactoe'),
    tw: require('./commands/twitter'),
    ulg: require('./commands/unlockgroup'),
    umu: require('./commands/unmuteuser'),
    wc: require('./commands/wordcount'),
    wl: require('./commands/whitelist'),
    wp: require('./commands/wallpaper'),
    yt: require('./commands/youtube'),
};

// Load command files that were added without a matching switch case.
// This keeps the menu and the command registry in sync and prevents
// "command enabled but not working" failures for valid command files.
for (const file of fs.readdirSync(path.join(__dirname, 'commands'))) {
    if (!file.endsWith('.js')) continue;
    const commandName = path.basename(file, '.js').toLowerCase();
    if (commands[commandName]) continue;
    try {
        const loaded = require(path.join(__dirname, 'commands', file));
        const handler = typeof loaded === 'function'
            ? loaded
            : loaded?.[`${commandName}Command`]
                || loaded?.welcomeCommand
                || loaded?.handleTranslateCommand
                || loaded?.default;
        if (typeof handler === 'function') commands[commandName] = handler;
    } catch (error) {
        console.warn(`[Commands] Skipped ${commandName}: ${error.message}`);
    }
}

function buildMenuText(session, customName) {
    const commandLines = [...new Set(Object.keys(commands).map(name => `${PREFIX}${name}`))]
        .sort((a, b) => a.localeCompare(b));
    return [
        '━━━━━━━━━━━━━━━━━━',
        '🌸 *LEGEND LADLA LEGEND LADLI MD* 🌸',
        '━━━━━━━━━━━━━━━━━━',
        `👤 *User:* ${customName}`,
        `🤖 *Status:* ${session.isConnected ? 'Online ✅' : 'Connecting…'}`,
        `🌐 *Mode:* ${session.isPublic ? '🌍 Public' : '🔐 Private'}`,
        `📦 *Commands:* ${commandLines.length}`,
        '━━━━━━━━━━━━━━━━━━',
        '*COMMANDS — ONE PER LINE*',
        ...commandLines,
        '━━━━━━━━━━━━━━━━━━',
        `📢 *Official channel:* ${process.env.WHATSAPP_CHANNEL_URL || `Use ${PREFIX}channel to view the channel link.`}`,
        `⚡ *Prefix required:* Every command must start with ${PREFIX}, for example ${PREFIX}menu.`,
        '━━━━━━━━━━━━━━━━━━'
    ].join('\\n');
}

let openai;
try {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || 'sk-default',
        baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1"
    });
} catch (e) {}

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PREFIX = String(process.env.PREFIX || '.').slice(0, 3) || '.';

function normalizePhone(value) {
    return Array.from(String(value || '').split('@')[0].split(':')[0])
        .filter(character => character >= '0' && character <= '9')
        .join('');
}

function normalizeSessionId(value) {
    const safe = String(value || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    return safe || `user-${Math.random().toString(36).slice(2, 10)}`;
}

function isDeveloperNumber(value) {
    const developerNumber = normalizePhone(process.env.DEV_NUMBER || '');
    return Boolean(developerNumber) && normalizePhone(value) === developerNumber;
}
const io = socketIo(server, {
    cors: { origin: '*' },
    maxHttpBufferSize: 1e8,
});

try {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || 'sk-default',
        baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1"
    });
} catch (e) {}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve only the console routes. Do not expose auth_info or data as static files.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pair', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        service: 'whatsapp-bot',
        uptime: Math.floor(process.uptime()),
        port: PORT,
        activeSessions: Object.values(sessions).filter(session => session.isConnected).length
    });
});

app.get('/api/panel', (req, res) => {
    const forwardedProto = String(req.get('x-forwarded-proto') || req.protocol || 'http').split(',')[0].trim();
    const forwardedHost = String(req.get('x-forwarded-host') || req.get('host') || `localhost:${PORT}`).split(',')[0].trim();
    let baseUrl = String(process.env.PUBLIC_URL || `${forwardedProto}://${forwardedHost}`);
    while (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    res.json({
        ok: true,
        baseUrl,
        panelUrl: `${baseUrl}/`,
        pairUrl: `${baseUrl}/pair`,
        port: PORT
    });
});

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const AUTH_DIR = process.env.AUTH_DIR || path.join(DATA_DIR, 'auth_info');
const DATA_FILE = path.join(DATA_DIR, 'bot_data.json');
fs.ensureDirSync(AUTH_DIR);
fs.ensureDirSync(DATA_DIR);

let botData = { antilinkGroups: {}, antilinkWarns: {}, antiStickerGroups: {}, antiSpamPlus: {}, antiStatusGroups: {}, totalBots: 0, registeredBots: [], statusSettings: {}, antiDelete: {}, userNames: {}, antiCall: {} };
if (fs.existsSync(DATA_FILE)) {
    try { botData = fs.readJsonSync(DATA_FILE); } catch (e) {}
}
botData = {
    antilinkGroups: {},
    antilinkWarns: {},
    antiStickerGroups: {},
    antiSpamPlus: {},
    antiStatusGroups: {},
    totalBots: 0,
    registeredBots: [],
    statusSettings: {},
    antiDelete: {},
    userNames: {},
    antiCall: {},
    ...botData,
};

function saveBotData() {
    fs.writeJsonSync(DATA_FILE, botData);
}

const sessions = {}; 
const userSockets = {}; 
const messageLogs = {}; 

// Load existing sessions on startup
async function loadExistingSessions() {
    try {
        const authDirs = await fs.readdir(AUTH_DIR);
        for (const userId of authDirs) {
            const authPath = path.join(AUTH_DIR, userId);
            const stats = await fs.stat(authPath);
            if (stats.isDirectory()) {
                const credsFile = path.join(authPath, 'creds.json');
                if (fs.existsSync(credsFile)) {
                    console.log(`[System] Found existing session for: ${userId}. Initializing...`);
                    if (!sessions[userId]) {
                        sessions[userId] = new BotSession(userId);
                        // Start initialization without a pairing number (it will use existing creds)
                        sessions[userId].initialize().catch(err => {
                            console.error(`[System] Failed to auto-initialize session ${userId}:`, err.message);
                        });
                    }
                }
            }
        }
    } catch (err) {
        console.error('[System] Error loading existing sessions:', err.message);
    }
}

const toBold = (text) => {
    const boldChars = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };
    return text.split('').map(c => boldChars[c] || c).join('');
};

class BotSession {
    constructor(userId) {
        this.userId = userId;
        this.sock = null;
        this.isConnected = false;
        this.aiEnabled = false; 
        this.autoReact = botData.statusSettings[userId]?.autoReact || false;
        this.isPublic = botData.statusSettings[userId]?.isPublic || false; 
        this.authPath = path.join(AUTH_DIR, userId);
        this.processedMessages = new Set();
        this.activeInterval = null;
        this.isInitializing = false;
        this.userChats = {}; 
        this.lastConnectMessageTime = null;
    }

    sendLog(message, type = 'info') {
        const logEntry = { timestamp: new Date().toLocaleTimeString(), message, type };
        const socketId = userSockets[this.userId];
        if (socketId) io.to(socketId).emit('console', logEntry);
        console.log(`[${this.userId}] ${message}`);
    }



    sendConnectionStatus() {
        const socketId = userSockets[this.userId];
        if (socketId) {
            io.to(socketId).emit('connection-status', {
                connected: this.isConnected,
                user: this.userId
            });
        }
        io.emit('total-active', Object.values(sessions).filter(s => s.isConnected).length);
    }

    async getAIResponse(userJid, userMessage) {
        if (!openai) return "❌ AI is not configured.";
        try {
            const completion = await openai.chat.completions.create({
                model: process.env.AI_MODEL || "gpt-3.5-turbo",
                messages: [{ role: "system", content: "Helpful assistant." }, { role: "user", content: userMessage }],
                max_tokens: 150
            });
            return completion.choices[0].message.content.trim();
        } catch (error) {
            return "❌ AI Error: " + error.message;
        }
    }

    startActiveCheck() {
        if (this.activeInterval) clearInterval(this.activeInterval);
        this.activeInterval = setInterval(async () => {
            if (this.isConnected && this.sock?.user) {
                try {
                    const botNumber = jidNormalizedUser(this.sock.user.id);
                    // Send keep-alive message once per hour (60 minutes) to own DM only
                    // This message is only sent to the bot's own number as requested
                    await this.sock.sendMessage(botNumber, { 
                        text: "LEGEND LADLA LEGEND LADLI MD 𝗜𝗦 𝗢𝗡𝗟𝗜𝗡𝗘 🚀\n\n_24/7 Active System Working..._" 
                    });
                    this.sendLog("24/7 Keep-alive message sent to own DM. ✅", "success");
                } catch (e) {
                    this.sendLog("Keep-alive failed: " + e.message, "error");
                }
            }
        }, 60 * 60 * 1000); // Once per hour
    }

    async initialize(pairingNumber = null) {
        if (this.isInitializing) {
            this.sendLog("Initialization already in progress...", "info");
            return;
        }
        this.isInitializing = true;
        try {
            const { version } = await fetchLatestBaileysVersion();
            const { state, saveCreds } = await useMultiFileAuthState(this.authPath);
            
            this.sock = makeWASocket({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: P({ level: 'fatal' }),
                browser: Browsers.ubuntu('Chrome'),
                syncFullHistory: false,
                shouldSyncHistoryMessage: () => false,
                markOnlineOnConnect: true,
                keepAliveIntervalMs: 30000,
                connectTimeoutMs: 60000,
                defaultQueryTimeoutMs: 60000,
                emitOwnEvents: true, // Needed for some state sync
                retryRequestDelayMs: 5000,
                maxMsgRetryCount: 5,
                linkPreviewImageThumbnailWidth: 192,
                transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3000 },
                getMessage: async (key) => {
                    if (messageLogs[key.id]) {
                        return {
                            conversation: messageLogs[key.id].text,
                            key: {
                                remoteJid: key.remoteJid,
                                fromMe: messageLogs[key.id].fromMe || false,
                                id: key.id,
                                participant: messageLogs[key.id].sender || key.participant
                            }
                        };
                    }
                    return { conversation: '' };
                },
                patchMessageBeforeSending: (message) => {
                    const requiresPatch = !!(
                        message.buttonsMessage ||
                        message.templateMessage ||
                        message.listMessage
                    );
                    if (requiresPatch) {
                        return {
                            viewOnceMessage: {
                                message: {
                                    messageContextInfo: {
                                        deviceListMetadata: {},
                                        deviceListMetadataVersion: 2
                                    },
                                    ...message
                                }
                            }
                        };
                    }
                    return message;
                },

                generateHighQualityLinkPreview: true,
            });

            // Normalize legacy command responses to the current bot identity.
            const rawSendMessage = this.sock.sendMessage.bind(this.sock);
            this.sock.sendMessage = async (jid, content, options) => {
                if (content && typeof content === 'object') {
                    const branded = { ...content };
                    for (const key of ['text', 'caption', 'footer']) {
                        if (typeof branded[key] === 'string') {
                            branded[key] = branded[key]
                                .replace(/MASOOM X MASOOMA|SR KING MD BOT|SR KING|SR LEADER(?:-MD)?|𝐃𝐀𝐊𝐔(?: 𝙆𝙄𝙉𝙂)?-?𝙈𝘿|𝙎𝙍 𝙆𝙄𝙉𝙂-𝙈𝘿/gi, 'LEGEND LADLA LEGEND LADLI MD')
                                .replace(/RIZSHAKOR|SHAKOORKING/gi, 'LEGENDLADLALEGENDLADLI');
                        }
                    }
                    content = branded;
                }
                return rawSendMessage(jid, content, options);
            };

            if (pairingNumber && !state.creds.registered) {
                if (!state.creds.registered) {
                    await delay(3000);
                    try {
                        const rawCode = await this.sock.requestPairingCode(pairingNumber);
                        const code = rawCode?.match(/.{1,4}/g)?.join("-") || rawCode;
                        this.sendLog(`🔑 Pairing Code: ${code}`, 'success');
                        const socketId = userSockets[this.userId];
                        if (socketId) io.to(socketId).emit('pairing-code', code);
                    } catch (err) {
                        this.sendLog(`❌ Pairing error: ${err.message}`, 'error');
                    }
                }
            }

            this.sock.ev.on('creds.update', saveCreds);

            this.sock.ev.on('call', async (calls) => {
                if (botData.antiCall[this.userId]) {
                    for (const call of calls) {
                        if (call.status === 'offer') {
                            try {
                                await this.sock.rejectCall(call.id, call.from);
                                await this.sock.sendMessage(call.from, { text: "⚠️ *ANTI-CALL:* I don't accept calls. Please send a message instead." });
                            } catch (e) {}
                        }
                    }
                }
            });



            this.sock.ev.on('messages.upsert', async (m) => {
                if (m.type !== 'notify') return;
                
                await Promise.all(m.messages.map(async (msg) => {
                    // Check for decryption errors
                    if (msg.messageStubType === 1 || msg.messageStubType === 2) {
                        this.sendLog('Received an undecryptable message. This might be due to a session conflict.', 'warning');
                    }

                    try {
                        const from = msg.key.remoteJid || '';
                        const isMe = msg.key.fromMe;
                        const isGroup = from.endsWith('@g.us');
                        const isStatus = from === 'status@broadcast';
                        
                        const messageContent = msg.message?.ephemeralMessage?.message || msg.message?.viewOnceMessage?.message || msg.message?.viewOnceMessageV2?.message || msg.message;
                        if (!messageContent) return;

                        // A WhatsApp status arrives on status@broadcast, not in
                        // the group where it may later be shared. When any
                        // group has enabled .antistatus, attempt deletion here.
                        // WhatsApp still requires the bot account to have the
                        // permissions needed to remove the status message.
                        if (isStatus && !isMe && Object.values(botData.antiStatusGroups || {}).some(Boolean)) {
                            try {
                                await this.sock.sendMessage(from, { delete: msg.key });
                                this.sendLog('🛡️ Anti-status removed a new status.', 'success');
                            } catch (error) {
                                this.sendLog(`Anti-status delete failed: ${error.message}`, 'warning');
                            }
                            return;
                        }
                        
                        let type = Object.keys(messageContent)[0];
                        const text = (messageContent.conversation || messageContent.extendedTextMessage?.text || messageContent.imageMessage?.caption || messageContent.videoMessage?.caption || '').trim();

                        // Handle Autoread, Autotyping, Autorecording
                        if (!isMe && !isStatus) {
                            await handleAutoread(this.sock, msg);
                            await storeMessage(msg);
                        }

                        if (msg.message?.protocolMessage?.type === 0) {
                            await handleMessageRevocation(this.sock, msg);
                            return;
                        }

                        const msgId = msg.key.id;
                        if (this.processedMessages.has(msgId)) return;
                        this.processedMessages.add(msgId);
                        if (this.processedMessages.size > 1000) this.processedMessages.delete(this.processedMessages.values().next().value);



                        if (!isStatus) {
                            let logEntry = { text, type, sender: msg.key.participant || from, fromMe: isMe };
                            if (['imageMessage', 'videoMessage', 'audioMessage'].includes(type)) {
                                try {
                                    const mContent = messageContent[type];
                                    if (mContent && (mContent.directPath || mContent.url)) {
                                        const stream = await downloadContentFromMessage(mContent, type.replace('Message', ''));
                                        let buffer = Buffer.from([]);
                                        for await(const chunk of stream) {
                                            buffer = Buffer.concat([buffer, chunk]);
                                        }
                                        logEntry.buffer = buffer;
                                    }
                                } catch (e) {}
                            }
                            messageLogs[msgId] = logEntry;
                        }

                        const cmd = text.toLowerCase();
                        const args = text.trim().split(/\s+/);
                        const q = args.slice(1).join(' ');
                        const sender = msg.key.participant || from;
                        const ownerNumber = normalizePhone(settings.ownerNumber);
                        const senderNumber = normalizePhone(sender);
                        // WhatsApp marks messages sent in the bot's own "Message yourself"
                        // chat as fromMe. Those owner commands must still be handled.
                        const isDeveloper = isDeveloperNumber(sender) || isDeveloperNumber(from);
                        // Treat the configured developer as an owner for all existing
                        // owner-only handlers, while keeping the identity configurable.
                        const isOwner = msg.key.fromMe || senderNumber === ownerNumber || normalizePhone(from) === ownerNumber || isDeveloper;
                        const isPrivileged = isOwner;
                        let isAdmin = isPrivileged;
                        if (isGroup) {
                            try {
                                const metadata = await this.sock.groupMetadata(from);
                                const participant = metadata.participants.find(p => p.id === sender);
                                isAdmin = Boolean(participant?.admin) || isPrivileged;
                            } catch (error) {
                                this.sendLog(`Group permission check failed: ${error.message}`, 'warning');
                                isAdmin = isPrivileged;
                            }
                        }

                        // Ignore normal self-chat messages to avoid loops, but allow
                        // prefixed owner commands such as .menu and .owner.
                        if (isMe && !cmd.startsWith(PREFIX)) return;
                        if (cmd.startsWith(PREFIX)) this.sendLog(`Command received: ${cmd}`, 'info');

                        // Anti-Spam Plus: detect and handle spam messages
                        if (
                            isGroup &&
                            botData.antiSpamPlus?.[from]?.enabled &&
                            !isAdmin &&
                            !isMe &&
                            text &&
                            !isStatus
                        ) {
                            try {
                                const spamSettings = botData.antiSpamPlus[from];
                                const limit = spamSettings.limit || 6;
                                const timeWindow = (spamSettings.timeWindow || 5) * 1000;
                                const action = spamSettings.action || 'delete';
                                const spamKey = `spam_${from}_${sender}`;

                                if (!global._spamTracker) global._spamTracker = {};
                                if (!global._spamTracker[spamKey]) global._spamTracker[spamKey] = [];

                                const now = Date.now();
                                global._spamTracker[spamKey] = global._spamTracker[spamKey].filter(t => now - t < timeWindow);
                                global._spamTracker[spamKey].push(now);

                                if (global._spamTracker[spamKey].length > limit) {
                                    global._spamTracker[spamKey] = [];
                                    await this.sock.sendMessage(from, { delete: msg.key });

                                    if (action === 'kick') {
                                        await this.sock.groupParticipantsUpdate(from, [sender], 'remove');
                                        await this.sock.sendMessage(from, {
                                            text: `🛡️ *Anti-Spam Plus*\n\n${msg.pushName || 'User'} ko spam kiye ke karan kick kar diya gaya hai.`
                                        });
                                    } else if (action === 'ban') {
                                        await this.sock.groupParticipantsUpdate(from, [sender], 'remove');
                                        await this.sock.sendMessage(from, {
                                            text: `🛡️ *Anti-Spam Plus*\n\n${msg.pushName || 'User'} ko spam kiye ke karan ban kar diya gaya hai.`,
                                            mentions: [sender]
                                        });
                                    } else {
                                        await this.sock.sendMessage(from, {
                                            text: `⚠️ *Anti-Spam Plus*\n\n${msg.pushName || 'User'} ke spam messages delete kiye gaye.`
                                        });
                                    }
                                    return;
                                }
                            } catch (e) {
                                this.sendLog(`Anti-spam error: ${e.message}`, 'warning');
                            }
                        }

                        // Anti-sticker: delete sticker messages from non-admins in groups
                        const isStickerMessage = (type === 'stickerMessage') ||
                            (msg.message?.stickerMessage) ||
                            (msg.message?.ephemeralMessage?.message?.stickerMessage) ||
                            (msg.message?.viewOnceMessage?.message?.stickerMessage) ||
                            (msg.message?.viewOnceMessageV2?.message?.stickerMessage);

                        if (
                            isGroup &&
                            botData.antiStickerGroups?.[from] &&
                            !isAdmin &&
                            isStickerMessage
                        ) {
                            try {
                                await this.sock.sendMessage(from, { delete: msg.key });
                                await this.sock.sendMessage(from, {
                                    text: `⚠️ *Anti-Sticker Active*\n\n${msg.pushName || 'User'} ka sticker delete kar diya gaya hai.`
                                });
                                return;
                            } catch (e) {
                                this.sendLog(`Anti-sticker delete failed: ${e.message}`, 'warning');
                            }
                        }

                        if (isGroup && botData.antilinkGroups[from] && !isAdmin) {
                            const linkPatterns = [/chat.whatsapp.com\//i, /http:\/\//i, /https:\/\//i, /www\./i, /[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/i];
                            if (linkPatterns.some(pattern => pattern.test(text))) {
                                try {
                                    const mode = botData.antilinkGroups[from];
                                    await this.sock.sendMessage(from, { delete: msg.key });
                                    
                                    // Initialize warns for this group if not exists
                                    if (!botData.antilinkWarns[from]) botData.antilinkWarns[from] = {};
                                    
                                    // Increment warning count
                                    botData.antilinkWarns[from][sender] = (botData.antilinkWarns[from][sender] || 0) + 1;
                                    const warnCount = botData.antilinkWarns[from][sender];
                                    
                                    if (mode === 'kick') {
                                        // Kick mode: immediate kick on first link
                                        await this.sock.groupParticipantsUpdate(from, [sender], "remove");
                                    } else if (mode === 'warn' || mode === 'del') {
                                        // Warn mode: 3 strikes and out
                                        if (warnCount >= 3) {
                                            // 3rd strike — remove user
                                            await this.sock.groupParticipantsUpdate(from, [sender], "remove");
                                            await this.sock.sendMessage(from, {
                                                text: `🚫 @${sender.split('@')[0]} ko 3 baar link bhejne par group se remove kar diya gaya hai!

⚠️ Anti-Link Rule: 3 Links = Kick`,
                                                mentions: [sender]
                                            }, { quoted: msg });
                                            // Reset warn count after kick
                                            botData.antilinkWarns[from][sender] = 0;
                                        } else {
                                            // Show warning
                                            await this.sock.sendMessage(from, {
                                                text: `⚠️ *Anti-Link Warning!* ⚠️\n\n@${sender.split('@')[0]} ne link bheja hai!\n\n🔢 Warnings: *${warnCount}/3*\n${warnCount === 1 ? '🟡 1 warning' : '🟠 2 warnings'}\n\n❗ 3rd link par auto-remove ho jayega!\n\n🚫 Link bhejna mana hai!`,
                                                mentions: [sender]
                                            }, { quoted: msg });
                                        }
                                    }
                                    saveBotData();
                                } catch (e) {}
                                return;
                            }
                        }

                        // ===== AUTO-ENFORCEMENT: Ban & Mute Check =====
                        if (isGroup && !isAdmin) {
                            try {
                                const fs = require('fs'), path = require('path');
                                // Auto-kick banned users
                                const banFile = path.join(__dirname, 'data/banned.json');
                                if (fs.existsSync(banFile)) {
                                    const bans = JSON.parse(fs.readFileSync(banFile, 'utf8'));
                                    if (bans[from] && bans[from].includes(sender)) {
                                        await this.sock.groupParticipantsUpdate(from, [sender], 'remove');
                                        await this.sock.sendMessage(from, {
                                            text: `🔨 @${sender.split('@')[0]} ban list mein hai — auto removed!`,
                                            mentions: [sender]
                                        });
                                        return;
                                    }
                                }
                                // Auto-kick muted users who send messages
                                const muteFile = path.join(__dirname, 'data/muted.json');
                                if (fs.existsSync(muteFile)) {
                                    const muted = JSON.parse(fs.readFileSync(muteFile, 'utf8'));
                                    if (muted[from] && muted[from].includes(sender)) {
                                        try { await this.sock.sendMessage(from, { delete: msg.key }); } catch {}
                                        await this.sock.groupParticipantsUpdate(from, [sender], 'remove');
                                        await this.sock.sendMessage(from, {
                                            text: `🔇 @${sender.split('@')[0]} muted hai aur message kiya — auto kicked!`,
                                            mentions: [sender]
                                        });
                                        return;
                                    }
                                }
                                // Anti-flood check
                                const floodFile = path.join(__dirname, 'data/antiflood.json');
                                if (fs.existsSync(floodFile)) {
                                    const floodData = JSON.parse(fs.readFileSync(floodFile, 'utf8'));
                                    if (floodData[from] && floodData[from].enabled) {
                                        const limit = floodData[from].limit || 5;
                                        const fkey = `${from}:${sender}`;
                                        if (!global._floodTracker) global._floodTracker = {};
                                        if (!global._floodTracker[fkey]) global._floodTracker[fkey] = [];
                                        const now = Date.now();
                                        global._floodTracker[fkey] = global._floodTracker[fkey].filter(t => now - t < 5000);
                                        global._floodTracker[fkey].push(now);
                                        if (global._floodTracker[fkey].length > limit) {
                                            global._floodTracker[fkey] = [];
                                            await this.sock.groupParticipantsUpdate(from, [sender], 'remove');
                                            await this.sock.sendMessage(from, {
                                                text: `🛡️ @${sender.split('@')[0]} flood kar raha tha (${limit}+ msgs/5s) — auto kicked!`,
                                                mentions: [sender]
                                            });
                                            return;
                                        }
                                    }
                                }
                            } catch (e) {}
                        }
                        // ===== END AUTO-ENFORCEMENT =====

                        // Only prefixed commands can reach the command router.
                        // Developer commands work even while the bot is private.
                        if (!this.isPublic && !isPrivileged) return;

                        if (cmd.startsWith(PREFIX)) {
                            const commandName = cmd.slice(PREFIX.length).split(' ')[0];
                            (async () => {
                                try {
                                    switch (commandName) {
                                        case 'rizoad': await commands.rizoad(this.sock, from, msg, isAdmin); break;
                                        case 'tayyab': await commands.tayyab(this.sock, from, msg, q); break;
                                        case 'pair': await commands.pair(this.sock, from, msg, q); break;
                                        case 'setdp':
                                        case 'botdp': {
                                            if (!isOwner) { await this.sock.sendMessage(from, { text: '❌ Sirf Owner use kar sakta hai yeh command!' }, { quoted: msg }); break; }
                                            await commands.botdp(this.sock, from, msg, q);
                                            break;
                                        }
                                        case 'botname': {
                                            if (!isOwner) { await this.sock.sendMessage(from, { text: '❌ Sirf Owner use kar sakta hai yeh command!' }, { quoted: msg }); break; }
                                            await commands.botname(this.sock, from, msg, q);
                                            break;
                                        }
                                        case 'start': await commands.start(this.sock, from, msg); break;
                                        case 'menu': {
                                            const menuText = buildMenuText(this, botData.userNames[this.userId] || msg.pushName || 'User');
                                            await this.sock.sendMessage(from, { text: menuText }, { quoted: msg });
                                            break;
                                        }
                                        case 'legacy_menu_disabled':
                                            const loadEmojis = ['⏳', '⌛', '🚀', '✨'];
                                            for (const emoji of loadEmojis) await this.sock.sendMessage(from, { react: { text: emoji, key: msg.key } });
                                            const customName = botData.userNames[this.userId] || msg.pushName || 'User';
                                            const menuText =
`━━━━━━━━━━━━━━━━━━
🌸 *LEGEND LADLA LEGEND LADLI MD* 🌸
━━━━━━━━━━━━━━━━━━
👤 *User:* ${customName}
🤖 *Status:* Online ✅
🌐 *Mode:* ${this.isPublic ? '🌍 Public' : '🔐 Private'}
📦 *Commands:* ${Object.keys(commands).length}+
━━━━━━━━━━━━━━━━━━

╔══❖•◈🎭 *FUN MENU* 🎭◈•❖══╗
║  ➊ ☞ Quote 🐦🔥
║  ➋ ☞ Fact 🐦🔥
║  ➌ ☞ Riddle 🐦🔥
║  ➍ ☞ 8ball 🐦🔥
║  ➎ ☞ Dice 🐦🔥
║  ➏ ☞ Coin 🐦🔥
║  ➐ ☞ Rps 🐦🔥
║  ➑ ☞ Truth 🐦🔥
║  ➒ ☞ Dare 🐦🔥
║  ➓ ☞ Compliment 🐦🔥
║  ⓫ ☞ Roast 🐦🔥
║  ⓬ ☞ Iq 🐦🔥
║  ⓭ ☞ Rate 🐦🔥
║  ⓮ ☞ Fortune 🐦🔥
║  ⓯ ☞ Wyr 🐦🔥
║  ⓰ ☞ Ship 🐦🔥
║  ⓱ ☞ Zodiac 🐦🔥
║  ⓲ ☞ Anime 🐦🔥
║  ⓳ ☞ Lovecalc 🐦🔥
║  ⓴ ☞ Joke & Meme 🐦🔥
╚══════════════════════╝

🌸 *CHOTI DON & LEGENDS*
➊ Chotidon 
➋ Chotidonlove 
➌ Chotidonquote
➍ Legendladla 
➎ Legendladli
━━━━━━━━━━━━━━━━━━

╔══❖•◈🎮 *GAME MENU* 🎮◈•❖══╗
║  ➊ ☞ Quiz 🎯🔥
║  ➋ ☞ Trivia 🎯🔥
║  ➌ ☞ Math 🎯🔥
║  ➍ ☞ Scramble 🎯🔥
║  ➎ ☞ Hangman 🎯🔥
║  ➏ ☞ Tictactoe 🎯🔥
║  ➐ ☞ Guessnumber 🎯🔥
║  ➑ ☞ Countdown 🎯🔥
║  ➒ ☞ Memory 🎯🔥
╚══════════════════════╝

🔗 *PAIR MENU*
➊ Pair 
➋ QR Pair
━━━━━━━━━━━━━━━━━━

📥 *DOWNLOAD MENU*
➊ Song 
➋ Video
➌ Insta 
➍ Tiktok
➎ Facebook 
➏ Twitter
➐ Youtube 
➑ Spotify
➒ Lyrics 
➓ Gif
⓫ Wallpaper 
⓬ Catimg
⓭ Dogimg 
⓮ Sticker
⓯ Toimg 
⓰ Stealsticker
⓱ Pinterest 
⓲ GDrive
━━━━━━━━━━━━━━━━━━

🛠️ *TOOLS MENU*
➊ Calc 
➋ Tayyab
➌ Rizoad 
➍ Time
➎ Weather 
➏ Wiki
➐ Define 
➑ Password
➒ Base64 
➓ Reverse
⓫ Fancy 
⓬ Morse
⓭ Binary 
⓮ Bmi
⓯ Age 
⓰ Currency
⓱ News 
⓲ Poll
⓳ Shorten 
⓴ Whoami
⓫ Wordcount 
⓬ Translate
⓭ Systeminfo 
⓮ Deviceinfo
⓯ Ownerinfo 
⓰ Profilecard
⓱ Uid 
⓲ Stickerid
⓳ Tts 
⓴ Voicemsg
⓫ Shayari 
⓬ Statusmaker
⓭ Movieinfo 
⓮ Githubuser
⓯ Npmsearch 
⓰ Hashgen
⓱ Passwordcheck 
⓲ Randompick
⓳ Servercheck 
⓴ Urlscan
⓫ Emojifind 
⓬ Textimprove
⓭ Spellfix 
⓮ Mdformat
⓯ Regextest 
⓰ Backupinfo
⓱ Servertime 
⓲ Jsonclean
⓳ Numberinfo 
⓴ Linkcheck
⓫ Textstats 
➊ Devinfo
➋ Accept 
➌ Add
➍ Admins 
➎ Aesthetic
➏ Af 
➐ Ai
➑ Antistatus 
➒ Apk
➓ Autostatus 
⓫ Badwelcome
⓬ Bc 
⓭ Bio
⓮ Burn 
⓯ Cat
⓰ Catfact 
⓱ Catimg
⓲ Cc 
⓳ Character
⓴ Charcount 
⓫ Cw
⓬ Dict 
⓭ Dog
⓮ Dogfact 
⓯ Dogimg
⓰ Dp 
⓱ Emojimix
⓲ Facebook 
⓳ Fb
⓴ Gdrive 
⓫ Gif
⓬ Goodbye 
⓭ Groupinfo
⓮ Groups 
⓯ Gs
⓰ Guess 
⓱ Hack
⓲ Hidetag 
⓳ Ig
⓴ Info 
⓫ Insta
⓬ Kickoffline 
⓭ Lg
⓮ Lower 
⓯ Lyric
⓰ Lyrics 
⓱ Members
⓲ Meme 
⓳ Mf
⓴ Ml 
⓫ Mu
⓬ Owner 
⓭ Pass
⓮ Pfp 
⓯ Phonetic
⓰ Pin 
⓱ Pinterest
⓲ Public 
⓳ Randomnum
⓴ Repeat 
⓫ Revoke
⓬ Rnum 
⓭ Roman
⓮ Rw 
⓯ Sb
⓰ Sch 
⓱ Sgp
⓲ Slowmode 
⓳ Song
⓴ Spotify 
⓫ Ss
⓬ Stealsticker 
⓭ Sticker
⓮ Stk 
⓯ Tagall
⓰ Tiktok 
⓱ Toimg
⓲ Trt 
⓳ Ttt
⓴ Tw 
⓫ Twitter
⓬ Ulg 
⓭ Umu
⓮ Unmute 
⓯ Upper
⓰ Video 
⓱ Vv
⓲ Wallpaper 
⓳ Wc
⓴ Wikipedia 
⓫ Wl
⓬ Wp 
⓭ Youtube
⓮ Yt 
⓯ Setdp
⓰ Botname
━━━━━━━━━━━━━━━━━━

👥 *GROUP MENU*
➊ Kick 
➋ Del
➌ Promote 
➍ Demote
➎ Warn 
➏ Warnings
➐ Clearwarn 
➑ Warnall
➒ Warnlist 
➓ Resetwarn
⓫ Mute/Unmute 
⓬ Link/Revoke
⓭ Welcome/Goodbye 
⓮ Setwelcome
⓯ Rules 
⓰ Report
⓱ Listadmins 
⓲ Listmembers
⓳ Everyone 
⓴ Setdesc
⓫ Antilink/Antistatus 
⓬ Autoaccept
⓭ Autodemote 
⓮ Adminonly
⓯ Memberlog 
⓰ Grouplogs
⓱ Antijoin 
⓲ Antitag
⓳ Antispamplus 
⓴ Antibot
⓫ Raidmode 
⓬ Groupbackup
⓭ Restoregroup 
⓮ Setrules
⓯ Verify 
⓰ Captcha
⓱ Trust 
⓲ Blacklist
⓳ Whitelist 
⓴ Nickname
⓫ Warnlimit 
⓬ Welcomeai
⓭ Activity 
⓮ Topmembers
⓯ Silentmode 
⓰ Schedulemsg
⓱ Autoreplygroup 
⓲ Keywordreply
⓳ Mentionguard 
⓴ Linkguard
⓫ Fileguard
⓬ Stickerguard/Mediaonly
⓭ Groupfreeze/Securitycheck
━━━━━━━━━━━━━━━━━━

🔒 *POWER CONTROL*
➊ Ban 
➋ Unban
➌ Banlist 
➍ Softban
➎ Kickall 
➏ Lockgroup
➐ Unlockgroup 
➑ Freeze
➒ Unfreeze 
➓ Muteuser
⓫ Unmuteuser 
⓬ Mutelist
⓭ Groupstats 
⓮ Addmember
⓯ Setgrouppic 
⓰ Antiflood
⓱ Schedule
━━━━━━━━━━━━━━━━━━

👑 *OWNER MENU*
➊ Botinfo 
➋ Uptime
➌ Block 
➍ Unblock
➎ Getpp 
➏ Setbio
➐ Getbio 
➑ Broadcast
➒ Listgroups 
➓ Join
⓫ Leave 
⓬ Anticall
⓭ Antidelete 
⓮ Autoreacts
⓯ Autoread 
⓰ Private/Public
⓱ Status 
⓲ Setname
⓳ Setdp/Botdp 
⓴ Botname
━━━━━━━━━━━━━━━━━━

⚡ *ACTIVE FEATURES*
🤖 AI: ${this.aiEnabled ? '✅ On' : '❌ Off'}
⚡ Auto-React: ${this.autoReact ? '✅ On' : '❌ Off'}
🗑️ Anti-Delete: ${botData.antiDelete[this.userId] ? '✅ On' : '❌ Off'}
📺 Auto-Status: ${(botData.statusSettings[this.userId] && botData.statusSettings[this.userId].autoStatus) ? '✅ On' : '❌ Off'}
━━━━━━━━━━━━━━━━━━
🔗 *Channel:* https://whatsapp.com/channel/0029VbDg0PKISTkFbLhqfl0C
⚡ *Powered By: LEGEND LADLA LEGEND LADLI MD* ⚡`;
                                            try {
                                                await this.sock.sendMessage(from, { 
                                                    image: { url: 'https://files.catbox.moe/4mlvhj.jpg' }, 
                                                    caption: menuText,
                                                    contextInfo: {
                                                        externalAdReply: {
                                                            title: 'LEGEND LADLA LEGEND LADLI MD OFFICIAL',
                                                            body: 'Join Our Official Channel',
                                                            thumbnailUrl: 'https://files.catbox.moe/ocdn7y.jpg',
                                                            sourceUrl: 'https://whatsapp.com/channel/0029VbDg0PKISTkFbLhqfl0C',
                                                            mediaType: 1,
                                                            renderLargerThumbnail: true
                                                        }
                                                    }
                                                });
                                            } catch (e) { 
                                                await this.sock.sendMessage(from, { 
                                                    text: menuText,
                                                    contextInfo: {
                                                        externalAdReply: {
                                                            title: 'LEGEND LADLA LEGEND LADLI MD OFFICIAL',
                                                            body: 'Join Our Official Channel',
                                                            thumbnailUrl: 'https://files.catbox.moe/ocdn7y.jpg',
                                                            sourceUrl: 'https://whatsapp.com/channel/0029VbDg0PKISTkFbLhqfl0C',
                                                            mediaType: 1,
                                                            renderLargerThumbnail: true
                                                        }
                                                    }
                                                }); 
                                            }
                                            break;
                                        case 'ping': await commands.ping(this.sock, from, msg); break;
                                        case 'owner': await commands.owner(this.sock, from, msg); break;
                                        case 'ai': await commands.ai(this.sock, from, msg, isAdmin, this, args); break;
                                        case 'antilink': await commands.antilink(this.sock, from, msg, isAdmin, botData, saveBotData, args); break;
                                        case 'anticall': {
                                            if (!isOwner) { await this.sock.sendMessage(from, { text: '❌ Sirf Owner use kar sakta hai!' }, { quoted: msg }); break; }
                                            botData.antiCall[this.userId] = !botData.antiCall[this.userId];
                                            saveBotData();
                                            await this.sock.sendMessage(from, { text: `✅ Anti-Call ${botData.antiCall[this.userId] ? 'ON' : 'OFF'}` }, { quoted: msg });
                                            break;
                                        }
                                        case 'status': await commands.status(this.sock, from, msg, isOwner, botData, saveBotData, this.userId, args.slice(1)); break;
                                        case 'antidelete': await commands.antidelete(this.sock, from, msg, isOwner, botData, saveBotData); break;
                                        case 'autoreacts': await commands.autoreacts(this.sock, from, msg, isOwner, this, botData, saveBotData); break;
                                        case 'hidetag': await commands.hidetag(this.sock, from, msg, isAdmin); break;
                                        case 'tagall': await commands.tagall(this.sock, from, msg, isAdmin); break;
                                        case 'setname': {
                                            if (!isOwner) { await this.sock.sendMessage(from, { text: '❌ Sirf Owner use kar sakta hai!' }, { quoted: msg }); break; }
                                            botData.userNames[this.userId] = q || 'User';
                                            saveBotData();
                                            await this.sock.sendMessage(from, { text: `✅ Name set to: ${q}` }, { quoted: msg });
                                            break;
                                        }
                                        case 'insta': await commands.insta(this.sock, from, msg, q); break;
                                        case 'tiktok': await commands.tiktok(this.sock, from, msg, q); break;
                                        case 'dp': await commands.dp(this.sock, from, msg); break;
                                        case 'vv': await commands.vv(this.sock, from, msg); break;
                                        case 'vvdm': await commands.vvdm(this.sock, from, msg); break;
                                        case 'joke': await commands.joke(this.sock, from, msg); break;
                                        case 'meme': await commands.meme(this.sock, from, msg); break;
                                        case 'groupinfo': await commands.groupinfo(this.sock, from, msg, isGroup); break;
                                        case 'gdrive': await commands.gdrive(this.sock, from, msg, q); break;
                                        case 'mf': await commands.mf(this.sock, from, msg, q); break;
                                        case 'translate': await commands.translate(this.sock, from, msg, text); break;
                                        case 'apk': await commands.apk(this.sock, from, msg, q); break;
                                        case 'autoread': await commands.autoread(this.sock, from, msg, isOwner, this, botData, saveBotData); break;
                                        case 'character': await commands.character(this.sock, from, msg, q); break;
                                        case 'emojimix': await commands.emojimix(this.sock, from, msg, q); break;
                                        case 'facebook': await commands.facebook(this.sock, from, msg, q); break;
                                        case 'hack': await commands.hack(this.sock, from, msg); break;
                                        case 'accept': await commands.accept(this.sock, from, msg, isOwner); break;
                                        case 'kickoffline': await commands.kickoffline(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'antistatus':
                                        case 'statusfuck': await commands.antistatus(this.sock, from, msg, isAdmin, botData, saveBotData, args.slice(1)); break;
                                        case 'antisticker': await commands.antisticker(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'quote': await commands.quote(this.sock, from, msg); break;
                                        case 'fact': await commands.fact(this.sock, from, msg); break;
                                        case 'riddle': await commands.riddle(this.sock, from, msg); break;
                                        case '8ball': await commands['8ball'](this.sock, from, msg); break;
                                        case 'dice': await commands.dice(this.sock, from, msg); break;
                                        case 'coin': await commands.coin(this.sock, from, msg); break;
                                        case 'rps': await commands.rps(this.sock, from, msg, q); break;
                                        case 'truth': await commands.truth(this.sock, from, msg); break;
                                        case 'dare': await commands.dare(this.sock, from, msg); break;
                                        case 'compliment': await commands.compliment(this.sock, from, msg); break;
                                        case 'roast': await commands.roast(this.sock, from, msg); break;
                                        case 'badwelcome': await commands.badwelcome(this.sock, from, msg); break;
                                        case 'burn': await commands.burn(this.sock, from, msg); break;
                                        case 'lovecalc': await commands.lovecalc(this.sock, from, msg, q); break;
                                        case 'iq': await commands.iq(this.sock, from, msg); break;
                                        case 'rate': await commands.rate(this.sock, from, msg, q); break;
                                        case 'fortune': await commands.fortune(this.sock, from, msg); break;
                                        case 'wyr': await commands.wyr(this.sock, from, msg); break;
                                        case 'ship': await commands.ship(this.sock, from, msg, q); break;
                                        case 'zodiac': await commands.zodiac(this.sock, from, msg, q); break;
                                        case 'anime': await commands.anime(this.sock, from, msg, q); break;
                                        case 'calc': await commands.calc(this.sock, from, msg, q); break;
                                        case 'time': await commands.time(this.sock, from, msg); break;
                                        case 'weather': await commands.weather(this.sock, from, msg, q); break;
                                        case 'wiki': await commands.wiki(this.sock, from, msg, q); break;
                                        case 'define': await commands.define(this.sock, from, msg, q); break;
                                        case 'password': await commands.password(this.sock, from, msg, q); break;
                                        case 'base64': await commands.base64(this.sock, from, msg, q); break;
                                        case 'reverse': await commands.reverse(this.sock, from, msg, q); break;
                                        case 'upper': await commands.upper(this.sock, from, msg, q); break;
                                        case 'lower': await commands.lower(this.sock, from, msg, q); break;
                                        case 'fancy': await commands.fancy(this.sock, from, msg, q); break;
                                        case 'morse': await commands.morse(this.sock, from, msg, q); break;
                                        case 'binary': await commands.binary(this.sock, from, msg, q); break;
                                        case 'poll': await commands.poll(this.sock, from, msg, q); break;
                                        case 'news': await commands.news(this.sock, from, msg); break;
                                        case 'uuid': await commands.uuid(this.sock, from, msg); break;
                                        case 'currency': await commands.currency(this.sock, from, msg, q); break;
                                        case 'aesthetic': await commands.aesthetic(this.sock, from, msg, q); break;
                                        case 'randomnum': await commands.randomnum(this.sock, from, msg, q); break;
                                        case 'repeat': await commands.repeat(this.sock, from, msg, q); break;
                                        case 'wordcount': await commands.wordcount(this.sock, from, msg, q); break;
                                        case 'charcount': await commands.charcount(this.sock, from, msg, q); break;
                                        case 'bmi': await commands.bmi(this.sock, from, msg, q); break;
                                        case 'age': await commands.age(this.sock, from, msg, q); break;
                                        case 'roman': await commands.roman(this.sock, from, msg, q); break;
                                        case 'phonetic': await commands.phonetic(this.sock, from, msg, q); break;
                                        case 'shorten': await commands.shorten(this.sock, from, msg, q); break;
                                        case 'whoami': await commands.whoami(this.sock, from, msg, sender); break;
                                        case 'lyrics': await commands.lyrics(this.sock, from, msg, q); break;
                                        case 'catimg': await commands.catimg(this.sock, from, msg); break;
                                        case 'dogimg': await commands.dogimg(this.sock, from, msg); break;
                                        case 'sticker': await commands.sticker(this.sock, from, msg); break;
                                        case 'toimg': await commands.toimg(this.sock, from, msg); break;
                                        case 'stealsticker': await commands.stealsticker(this.sock, from, msg); break;
                                        case 'youtube': await commands.youtube(this.sock, from, msg, q); break;
                                        case 'spotify': await commands.spotify(this.sock, from, msg, q); break;
                                        case 'pinterest': await commands.pinterest(this.sock, from, msg, q); break;
                                        case 'twitter': await commands.twitter(this.sock, from, msg, q); break;
                                        case 'gif': await commands.gif(this.sock, from, msg, q); break;
                                        case 'wallpaper': await commands.wallpaper(this.sock, from, msg, q); break;
                                        case 'promote': await commands.promote(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'demote': await commands.demote(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'mute': await commands.mute(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'unmute': await commands.unmute(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'link': await commands.link(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'revoke': await commands.revoke(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'setdesc': await commands.setdesc(this.sock, from, msg, isAdmin, isGroup, q); break;
                                        case 'leave': await commands.leave(this.sock, from, msg, isOwner); break;
                                        case 'welcome': await commands.welcome(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'goodbye': await commands.goodbye(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'setwelcome': await commands.setwelcome(this.sock, from, msg, isAdmin, isGroup, q); break;
                                        case 'warn': await commands.warn(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'warnings': await commands.warnings(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'clearwarn': await commands.clearwarn(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'report': await commands.report(this.sock, from, msg, isGroup); break;
                                        case 'rules': await commands.rules(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'listadmins': await commands.listadmins(this.sock, from, msg, isGroup); break;
                                        case 'listmembers': await commands.listmembers(this.sock, from, msg, isGroup); break;
                                        case 'everyone': await commands.everyone(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'slowmode': await commands.slowmode(this.sock, from, msg, isAdmin, isGroup, q); break;
                                        case 'botinfo': await commands.botinfo(this.sock, from, msg); break;
                                        case 'uptime': await commands.uptime(this.sock, from, msg); break;
                                        case 'block': await commands.block(this.sock, from, msg, isOwner, q); break;
                                        case 'unblock': await commands.unblock(this.sock, from, msg, isOwner, q); break;
                                        case 'getpp': await commands.getpp(this.sock, from, msg, q); break;
                                        case 'setbio': await commands.setbio(this.sock, from, msg, isOwner, q); break;
                                        case 'getbio': await commands.getbio(this.sock, from, msg, q); break;
                                        case 'broadcast': await commands.broadcast(this.sock, from, msg, isOwner, q); break;
                                        case 'listgroups': await commands.listgroups(this.sock, from, msg, isOwner); break;
                                        case 'join': await commands.join(this.sock, from, msg, isOwner, q); break;
                                        case 'catfact': await commands.catfact(this.sock, from, msg); break;
                                        case 'dogfact': await commands.dogfact(this.sock, from, msg); break;
                                        case 'quiz': await commands.quiz(this.sock, from, msg); break;
                                        case 'trivia': await commands.trivia(this.sock, from, msg); break;
                                        case 'math': await commands.math(this.sock, from, msg, q); break;
                                        case 'scramble': await commands.scramble(this.sock, from, msg); break;
                                        case 'hangman': await commands.hangman(this.sock, from, msg); break;
                                        case 'tictactoe': await commands.tictactoe(this.sock, from, msg); break;
                                        case 'guessnumber': await commands.guessnumber(this.sock, from, msg); break;
                                        case 'countdown': await commands.countdown(this.sock, from, msg, q); break;
                                        case 'memory': await commands.memory(this.sock, from, msg); break;
                                        case 'ban': await commands.ban(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'unban': await commands.unban(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'banlist': await commands.banlist(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'softban': await commands.softban(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'kickall': await commands.kickall(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'lockgroup': await commands.lockgroup(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'unlockgroup': await commands.unlockgroup(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'freeze': await commands.freeze(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'unfreeze': await commands.unfreeze(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'muteuser': await commands.muteuser(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'unmuteuser': await commands.unmuteuser(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'mutelist': await commands.mutelist(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'resetwarn': await commands.resetwarn(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'warnall': await commands.warnall(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'warnlist': await commands.warnlist(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'groupstats': await commands.groupstats(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'addmember': await commands.addmember(this.sock, from, msg, isAdmin, isGroup, q); break;
                                        case 'setgrouppic': await commands.setgrouppic(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'antiflood': await commands.antiflood(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup, q); break;
                                        case 'schedule': await commands.schedule(this.sock, from, msg, isAdmin, isGroup, q); break;
                                        case 'autoaccept': await commands.autoaccept(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'autodemote': await commands.autodemote(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'adminonly': await commands.adminonly(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'memberlog': await commands.memberlog(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'grouplogs': await commands.grouplogs(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'antijoin': await commands.antijoin(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'antitag': await commands.antitag(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'antispamplus': await commands.antispamplus(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup, q); break;
                                        case 'antibot': await commands.antibot(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'raidmode': await commands.raidmode(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'groupbackup': await commands.groupbackup(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'restoregroup': await commands.restoregroup(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'setrules': await commands.setrules(this.sock, from, msg, isAdmin, isGroup, q); break;
                                        case 'verify': await commands.verify(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'captcha': await commands.captcha(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'trust': await commands.trust(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'blacklist': await commands.blacklist(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup, q); break;
                                        case 'whitelist': await commands.whitelist(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup, q); break;
                                        case 'nickname': await commands.nickname(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup, q); break;
                                        case 'warnlimit': await commands.warnlimit(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup, q); break;
                                        case 'welcomeai': await commands.welcomeai(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'activity': await commands.activity(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'topmembers': await commands.topmembers(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'silentmode': await commands.silentmode(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'schedulemsg': await commands.schedulemsg(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup, q); break;
                                        case 'autoreplygroup': await commands.autoreplygroup(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup, q); break;
                                        case 'keywordreply': await commands.keywordreply(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup, q); break;
                                        case 'mentionguard': await commands.mentionguard(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'linkguard': await commands.linkguard(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'fileguard': await commands.fileguard(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'stickerguard': await commands.stickerguard(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'mediaonly': await commands.mediaonly(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'textonly': await commands.textonly(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'groupfreeze': await commands.groupfreeze(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'securitycheck': await commands.securitycheck(this.sock, from, msg, isAdmin, botData, saveBotData, isGroup); break;
                                        case 'systeminfo': await commands.systeminfo(this.sock, from, msg); break;
                                        case 'deviceinfo': await commands.deviceinfo(this.sock, from, msg); break;
                                        case 'ownerinfo': await commands.ownerinfo(this.sock, from, msg); break;
                                        case 'profilecard': await commands.profilecard(this.sock, from, msg, q); break;
                                        case 'uid': await commands.uid(this.sock, from, msg); break;
                                        case 'stickerid': await commands.stickerid(this.sock, from, msg); break;
                                        case 'tts': await commands.tts(this.sock, from, msg, q); break;
                                        case 'voicemsg': await commands.voicemsg(this.sock, from, msg, q); break;
                                        case 'shayari': await commands.shayari(this.sock, from, msg); break;
                                        case 'statusmaker': await commands.statusmaker(this.sock, from, msg, q); break;
                                        case 'movieinfo': await commands.movieinfo(this.sock, from, msg, q); break;
                                        case 'githubuser': await commands.githubuser(this.sock, from, msg, q); break;
                                        case 'npmsearch': await commands.npmsearch(this.sock, from, msg, q); break;
                                        case 'hashgen': await commands.hashgen(this.sock, from, msg, q); break;
                                        case 'passwordcheck': await commands.passwordcheck(this.sock, from, msg, q); break;
                                        case 'randompick': await commands.randompick(this.sock, from, msg, q); break;
                                        case 'servercheck': await commands.servercheck(this.sock, from, msg, q); break;
                                        case 'urlscan': await commands.urlscan(this.sock, from, msg, q); break;
                                        case 'emojifind': await commands.emojifind(this.sock, from, msg, q); break;
                                        case 'textimprove': await commands.textimprove(this.sock, from, msg, q); break;
                                        case 'spellfix': await commands.spellfix(this.sock, from, msg, q); break;
                                        case 'mdformat': await commands.mdformat(this.sock, from, msg, q); break;
                                        case 'regextest': await commands.regextest(this.sock, from, msg, q); break;
                                        case 'backupinfo': await commands.backupinfo(this.sock, from, msg); break;
                                        case 'servertime': await commands.servertime(this.sock, from, msg); break;
                                        case 'jsonclean': await commands.jsonclean(this.sock, from, msg, q); break;
                                        case 'numberinfo': await commands.numberinfo(this.sock, from, msg, q); break;
                                        case 'linkcheck': await commands.linkcheck(this.sock, from, msg, q); break;
                                        case 'textstats': await commands.textstats(this.sock, from, msg, q); break;
                                        case 'devinfo': await commands.devinfo(this.sock, from, msg); break;
                                        case 'devbypass': await commands.devbypass(this.sock, from, msg, isOwner); break;
                                        case 'song': await commands.song(this.sock, from, msg, q); break;
                                        case 'video': await commands.video(this.sock, from, msg, q); break;
                                        case 'kick': await commands.kick(this.sock, from, msg, isAdmin, isGroup); break;
                                        case 'del': await delCommand(this.sock, from, msg, isAdmin); break;
                                        case 'private': {
                                            if (!isOwner) { await this.sock.sendMessage(from, { text: '❌ Sirf Owner use kar sakta hai!' }, { quoted: msg }); break; }
                                            this.isPublic = false;
                                            botData.statusSettings[this.userId] = botData.statusSettings[this.userId] || {};
                                            botData.statusSettings[this.userId].isPublic = false;
                                            saveBotData();
                                            await this.sock.sendMessage(from, { text: '🔐 Bot Private Mode mein set ho gaya!' }, { quoted: msg });
                                            this.sendConnectionStatus();
                                            break;
                                        }
                                        case 'public': {
                                            if (!isOwner) { await this.sock.sendMessage(from, { text: '❌ Sirf Owner use kar sakta hai!' }, { quoted: msg }); break; }
                                            this.isPublic = true;
                                            botData.statusSettings[this.userId] = botData.statusSettings[this.userId] || {};
                                            botData.statusSettings[this.userId].isPublic = true;
                                            saveBotData();
                                            await this.sock.sendMessage(from, { text: '🌍 Bot Public Mode mein set ho gaya!' }, { quoted: msg });
                                            this.sendConnectionStatus();
                                            break;
                                        }
                                        default: {
                                            const handler = commands[commandName];
                                            if (typeof handler === 'function') {
                                                const adminCommands = new Set([
                                                    'af', 'adminonly', 'antibot', 'antiflood', 'antijoin', 'antilink',
                                                    'antispamplus', 'antistatus', 'antisticker', 'antitag', 'ban',
                                                    'banlist', 'demote', 'freeze', 'groupbackup', 'groupfreeze',
                                                    'groupstats', 'grouplogs', 'kickall', 'kickoffline', 'lg',
                                                    'listadmins', 'listmembers', 'lockgroup', 'memberlog', 'mediaonly',
                                                    'ml', 'mu', 'muteuser', 'mutelist', 'nickname', 'promote',
                                                    'raidmode', 'resetwarn', 'restoregroup', 'sb', 'schedule',
                                                    'sch', 'securitycheck', 'setdesc', 'setgrouppic', 'setrules',
                                                    'sgp', 'silentmode', 'stickerguard', 'tagall', 'textonly',
                                                    'topmembers', 'trust', 'ulg', 'umu', 'unban', 'unfreeze',
                                                    'unlockgroup', 'unmute', 'unmuteuser', 'warn', 'warnall',
                                                    'warnlimit', 'warnlist', 'welcome', 'whitelist'
                                                ]);
                                                if (adminCommands.has(commandName)) {
                                                    await handler(this.sock, from, msg, isAdmin, q, botData, saveBotData, this.userId);
                                                } else {
                                                    await handler(this.sock, from, msg, q, isAdmin, botData, saveBotData, this.userId);
                                                }
                                            } else if (this.isPublic || isOwner) {
                                                await this.sock.sendMessage(from, { text: `❌ Command '.${commandName}' not found!\n\nType .menu for all commands.` }, { quoted: msg });
                                            }
                                            break;
                                        }
                                    }
                                } catch (e) {
                                    this.sendLog(`Command error: ${e.message}`, 'error');
                                    try {
                                        await this.sock.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: msg });
                                    } catch (e2) {}
                                }
                            })();
                        }
                    } catch (e) {
                        this.sendLog(`Message processing error: ${e.message}`, 'error');
                    }
                }));
            });

            this.sock.ev.on('group-participants.update', async (update) => {
                const { id, participants, action } = update;
                const metadata = await this.sock.groupMetadata(id);
                const botNumber = jidNormalizedUser(this.sock.user.id);
                const isBotAdmin = metadata.participants.find(p => p.id === botNumber)?.admin;

                if (action === 'add' && isBotAdmin) {
                    const welcomeMsg = botData.statusSettings[this.userId]?.welcomeMsg || `Welcome to ${metadata.subject}!`;
                    for (const participant of participants) {
                        try {
                            await this.sock.sendMessage(id, { text: `Welcome @${participant.split('@')[0]}!\n\n${welcomeMsg}`, mentions: [participant] });
                        } catch (e) {}
                    }
                }
            });

            this.sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect, qr } = update;
                if (qr) {
                    this.sendLog('📱 QR Code generated. Scan it with your phone.', 'info');
                    const socketId = userSockets[this.userId];
                    if (socketId) io.to(socketId).emit('qr', qr);
                }
                if (connection === 'close') {
                    const statusCode = lastDisconnect?.error?.output?.statusCode
                        || lastDisconnect?.error?.statusCode
                        || lastDisconnect?.error?.data?.statusCode;
                    const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
                    this.isConnected = false;
                    this.sendConnectionStatus();
                    if (shouldReconnect) {
                        this.sendLog('🔄 Reconnecting...', 'warning');
                        setTimeout(() => this.initialize(), 3000);
                    } else {
                        this.sendLog('❌ Logged out. Please pair again.', 'error');
                    }
                } else if (connection === 'open') {
                    this.isConnected = true;
                    this.sendLog('✅ Bot connected successfully!', 'success');
                    this.sendConnectionStatus();
                    this.startActiveCheck();
                }
            });

            this.isInitializing = false;
        } catch (err) {
            this.isInitializing = false;
            this.sendLog(`Initialization error: ${err.message}`, 'error');
            throw err;
        }
    }
}

async function handleAutoread(sock, msg) {
    const botData = fs.existsSync(DATA_FILE) ? fs.readJsonSync(DATA_FILE) : {};
    const userId = Object.keys(sessions)[0];
    if (botData.statusSettings?.[userId]?.autoRead) {
        try {
            await sock.readMessages([msg.key]);
        } catch (e) {}
    }
}

async function storeMessage(msg) {
    const msgId = msg.key.id;
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;
    const messageContent = msg.message?.ephemeralMessage?.message || msg.message?.viewOnceMessage?.message || msg.message?.viewOnceMessageV2?.message || msg.message;
    const text = (messageContent?.conversation || messageContent?.extendedTextMessage?.text || messageContent?.imageMessage?.caption || messageContent?.videoMessage?.caption || '').trim();
    
    messageLogs[msgId] = {
        text,
        sender,
        fromMe: msg.key.fromMe,
        timestamp: msg.messageTimestamp
    };
}

async function handleMessageRevocation(sock, msg) {
    const deletedMsgId = msg.message.protocolMessage.key.id;
    if (botData.antiDelete[Object.keys(sessions)[0]]) {
        try {
            const deletedMsg = messageLogs[deletedMsgId];
            if (deletedMsg) {
                const from = msg.key.remoteJid;
                await sock.sendMessage(from, {
                    text: `🗑️ *Message Deleted*\n\nFrom: @${deletedMsg.sender.split('@')[0]}\nMessage: ${deletedMsg.text}`
                });
            }
        } catch (e) {}
    }
}

io.on('connection', (socket) => {
    socket.on('register', (rawUserId) => {
        const userId = normalizeSessionId(rawUserId);
        userSockets[userId] = socket.id;
        if (!sessions[userId]) {
            sessions[userId] = new BotSession(userId);
        }
        socket.data.userId = userId;
        socket.emit('registered', { userId });
        socket.emit('connection-status', { connected: sessions[userId].isConnected, user: userId });
    });

    socket.on('pair', async (rawUserId, rawPairingNumber) => {
        const userId = normalizeSessionId(rawUserId);
        const pairingNumber = normalizePhone(rawPairingNumber);
        if (!sessions[userId]) {
            sessions[userId] = new BotSession(userId);
        }
        userSockets[userId] = socket.id;
        socket.data.userId = userId;
        try {
            await sessions[userId].initialize(pairingNumber);
        } catch (err) {
            socket.emit('pair-error', err.message || 'Unable to generate pairing code.');
        }
    });

    socket.on('disconnect', () => {
        for (const userId in userSockets) {
            if (userSockets[userId] === socket.id) {
                delete userSockets[userId];
            }
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
    console.log(`Panel URL: ${process.env.PUBLIC_URL || `http://localhost:${PORT}`}`);
    loadExistingSessions();
});
