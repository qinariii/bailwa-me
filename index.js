const { makeWASocket, useMultiFileAuthState, MessageType} = require('@whiskeysockets/baileys')
const pino = require('pino')
const qrcode = require('qrcode-terminal');

async function connectWhatsapp() {
    const auth = await useMultiFileAuthState("sessions");
    const socket = makeWASocket({
        printQRInTerminal: true,
        browser: ["QinaaBot!!", "Safari", "1.0.0"],
        auth: auth.state,
        logger: pino({ level: "silent" }),
    });

    socket.ev.on("creds.update", auth.saveCreds);
    socket.ev.on("connection.update", async({ connection }) => {
        if (connection === "open" ) {
            console.log("BOT WHATSAPP READY");
        }   else if (connection === "close") {
            await connectWhatsapp();
        }
    });

    socket.ev.on("messages.upsert", async ({ messages, type }) => {
        const chat = messages[0]
        const pesan = (chat.message?.extendedTextMessage?.text ?? chat.message?.ephemeralMessage?.message?.extendedTextMessage?.text ?? chat.message?.conversation)?.toLowerCase() || ""

        if (pesan == '/ping') {
            await socket.sendMessage(chat.key.remoteJid, { text: "Hello World."}, { quoted: chat })
            await socket.sendMessage(chat.key.remoteJid, { text: "Hello World."})
        }
    })
}
connectWhatsapp()