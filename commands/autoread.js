/**
 * Arslan Bot - A WhatsApp Bot
 * Autoread Command - Automatically read all messages
 */

const fs = require('fs');
const path = require('path');

// Path to store the configuration
const configPath = path.join(__dirname, '..', 'data', 'autoread.json');

// Initialize configuration file if it doesn't exist
function initConfig() {
    const dataDir = path.dirname(configPath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({ enabled: false }, null, 2));
    }
    return JSON.parse(fs.readFileSync(configPath));
}

// Toggle autoread feature
async function autoreadCommand(sock, chatId, message) {
    try {
        // Check if sender is the owner (bot itself)
        if (!message.key.fromMe) {
            await sock.sendMessage(chatId, {
                text: '❌ This command is only available for the owner!',
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363408426516135@newsletter',
                        newsletterName: '𝗧𝗘𝗔𝗠-𝗕𝗟𝗔𝗖𝗞-𝗛𝗔T',
                        serverMessageId: -1
                    }
                }
            });
            return;
        }

        // Get command arguments
        const args = message.message?.conversation?.trim().split(' ').slice(1) || 
                    message.message?.extendedTextMessage?.text?.trim().split(' ').slice(1) || 
                    [];
        
        // Initialize or read config
        const config = initConfig();
        
        // Toggle based on argument or toggle current state if no argument
        if (args.length > 0) {
            const action = args[0].toLowerCase();
            if (action === 'on' || action === 'enable') {
                config.enabled = true;
            } else if (action === 'off' || action === 'disable') {
                config.enabled = false;
            } else {
                await sock.sendMessage(chatId, {
                    text: `📖 *Auto-Read — Usage Guide* 📖

━━━━━━━━━━━━━━━━━━━━
📋 *Usage (Istemaal):*

🟢 *.autoread on*
   → Auto-read chalu hoga.
   → Bot sab messages automatically read kar lega.
   → Messages blue ticks ho jayenge.

🔴 *.autoread off*
   → Auto-read band hoga.
   → Ab messages read nahi honge automatically.

🔄 *.autoread* (bina on/off)
   → Current state toggle ho jayega.
   → Agar ON hai tu OFF ho jayega, aur vice versa.

━━━━━━━━━━━━━━━━━━━━
💡 *Tip:* Sirf bot owner ye command use kar sakta hai.`,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363408426516135@newsletter',
                            newsletterName: '𝗧𝗘𝗔𝗠-𝗕𝗟𝗔𝗖𝗞-𝗛𝗔T',
                            serverMessageId: -1
                        }
                    }
                });
                return;
            }
        } else {
            // Toggle current state
            config.enabled = !config.enabled;
        }

        // Save updated configuration
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        
        // Send confirmation message with Urdu guide
        await sock.sendMessage(chatId, {
            text: `✅ Auto-Read ${config.enabled ? 'ON' : 'OFF'} ho gaya!

${config.enabled ? '📖 Ab bot sab messages automatically read kar raha hai.' : '📖 Ab bot messages automatically read nahi kar raha.'}

━━━━━━━━━━━━━━━━━━━━
📋 *Usage Guide:*
🟢 .autoread on → Auto-read chalu
103	🔴 .autoread off → Auto-read band
104	🔄 .autoread → Toggle

💡 *Tip:* Sirf bot owner ye command use kar sakta hai.`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363408426516135@newsletter',
                    newsletterName: '𝗧𝗘𝗔𝗠-𝗕𝗟𝗔𝗖𝗞-𝗛𝗔T',
                    serverMessageId: -1
                }
            }
        });
        
    } catch (error) {
        console.error('Error in autoread command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing command!',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363408426516135@newsletter',
                    newsletterName: '𝗧𝗘𝗔𝗠-𝗕𝗟𝗔𝗖𝗞-𝗛𝗔T',
                    serverMessageId: -1
                }
            }
        });
    }
}

// Function to check if autoread is enabled
function isAutoreadEnabled() {
    try {
        const config = initConfig();
        return config.enabled;
    } catch (error) {
        console.error('Error checking autoread status:', error);
        return false;
    }
}

// Function to check if bot is mentioned in a message
function isBotMentionedInMessage(message, botNumber) {
    if (!message.message) return false;
    
    // Check for mentions in contextInfo (works for all message types)
    const messageTypes = [
        'extendedTextMessage', 'imageMessage', 'videoMessage', 'stickerMessage',
        'documentMessage', 'audioMessage', 'contactMessage', 'locationMessage'
    ];
    
    // Check for explicit mentions in mentionedJid array
    for (const type of messageTypes) {
        if (message.message[type]?.contextInfo?.mentionedJid) {
            const mentionedJid = message.message[type].contextInfo.mentionedJid;
            if (mentionedJid.some(jid => jid === botNumber)) {
                return true;
            }
        }
    }
    
    // Check for text mentions in various message types
    const textContent = 
        message.message.conversation || 
        message.message.extendedTextMessage?.text ||
        message.message.imageMessage?.caption ||
        message.message.videoMessage?.caption || '';
    
    if (textContent) {
        // Check for @mention format
        const botUsername = botNumber.split('@')[0];
        if (textContent.includes(`@${botUsername}`)) {
            return true;
        }
        
        // Check for bot name mentions (optional, can be customized)
        const botNames = [global.botname?.toLowerCase(), 'bot', '𝗧𝗘𝗔𝗠-𝗕𝗟𝗔𝗖𝗞-𝗛𝗔T', '𝗧𝗘𝗔𝗠-𝗕𝗟𝗔𝗖𝗞-𝗛𝗔T'];
        const words = textContent.toLowerCase().split(/\s+/);
        if (botNames.some(name => words.includes(name))) {
            return true;
        }
    }
    
    return false;
}

// Function to handle autoread functionality
async function handleAutoread(sock, message) {
    if (isAutoreadEnabled()) {
        // Get bot's ID
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        
        // Check if bot is mentioned
        const isBotMentioned = isBotMentionedInMessage(message, botNumber);
        
        // If bot is mentioned, read the message internally but don't mark as read in UI
        if (isBotMentioned) {
            
            // We don't call sock.readMessages() here, so the message stays unread in the UI
            return false; // Indicates message was not marked as read
        } else {
            // For regular messages, mark as read normally
            const key = { remoteJid: message.key.remoteJid, id: message.key.id, participant: message.key.participant };
            await sock.readMessages([key]);
            //console.log('✅ Marked message as read from ' + (message.key.participant || message.key.remoteJid).split('@')[0]);
            return true; // Indicates message was marked as read
        }
    }
    return false; // Autoread is disabled
}

module.exports = {
    autoreadCommand,
    isAutoreadEnabled,
    isBotMentionedInMessage,
    handleAutoread
};
