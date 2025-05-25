
const express = require('express');
const QRCode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
const PORT = process.env.PORT || 8000;

let qrCodeDataURL = '';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

client.on('qr', async qr => {
    qrCodeDataURL = await QRCode.toDataURL(qr);
    console.log('🔄 QR Code atualizado. Acesse /qr para escanear.');
});

client.on('ready', () => {
    console.log('✅ WhatsApp conectado com sucesso!');
});

client.on('message', async msg => {
    const lower = msg.body.toLowerCase();
    const chat = await msg.getChat();
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const sendTyping = async () => {
        await chat.sendStateTyping();
        await delay(1500);
    };

    if (['oi', 'olá', 'ola', 'menu', 'começar', 'inicio'].some(w => lower.includes(w))) {
        await sendTyping();
        await msg.reply(`👋 Olá! Seja bem-vindo(a) à *MindSync* 🧠✨

Aqui, conectamos você ao cuidado psicológico com empatia, acolhimento e preço acessível. 💙

Antes de continuarmos, me diz uma coisa:
Você está aqui como:

1️⃣ Paciente
2️⃣ Psicólogo(a)`);
    } else if (lower.includes('1')) {
        await sendTyping();
        await msg.reply(`🧠 Clique no link abaixo para preencher o formulário de paciente e agendar sua sessão:

📋 https://docs.google.com/forms/d/e/1FAIpQLSeNIEnswqelGUbLkZgmW3dwVU1X_2jtJhlN6Es5_bNtb5gV5A/viewform?usp=sf_link`);
    } else if (lower.includes('2')) {
        await sendTyping();
        await msg.reply(`📄 Ótimo! Se você é psicólogo(a), acesse o link abaixo para se cadastrar na plataforma:

📋 https://docs.google.com/forms/d/e/1FAIpQLSf-GDQCe-0UzPPNAzCb3-uZUOdTCULh1pHku_743Ss4AA37GQ/viewform?usp=sf_link`);
    }
});

client.initialize();

app.get('/qr', (req, res) => {
    if (!qrCodeDataURL) return res.send('QR Code ainda não gerado.');
    res.send(`<img src="${qrCodeDataURL}" style="width:300px;height:300px;" />`);
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor web ouvindo na porta ${PORT}. Acesse /qr para ver o QR Code.`);
});

