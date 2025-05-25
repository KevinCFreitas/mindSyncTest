const express = require('express');
const QRCode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
const PORT = process.env.PORT || 3000;

let qrCodeDataURL = null;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', async qr => {
  qrCodeDataURL = await QRCode.toDataURL(qr);
  console.log('⚠️ Escaneie o QR Code em /qr');
});

client.on('ready', () => {
  console.log('✅ Bot da MindSync conectado com sucesso!');
});

client.on('message', async msg => {
  const lower = msg.body.toLowerCase();
  const chat = await msg.getChat();
  const contact = await msg.getContact();
  const nome = contact.pushname || "amigo(a)";

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
  } else if (lower.includes('1') || lower.includes('paciente')) {
    await sendTyping();
    await msg.reply(`🧠 Vamos começar seu atendimento!

Qual é o seu nome completo?
Qual é a sua principal queixa ou demanda?
Tem alguma preferência por tipo de atendimento? (texto, áudio ou vídeo)
Qual horário e dia prefere para atendimento?

Em instantes um profissional entrará em contato!`);
  } else if (lower.includes('2') || lower.includes('psicólogo') || lower.includes('psicologa')) {
    await sendTyping();
    await msg.reply(`🧑‍⚕️ Seja bem-vindo(a) à equipe MindSync!

Por favor, envie os seguintes documentos:
📌 Registro no CRP
📌 Certidão de regularidade do CRP
📌 Diploma
📌 Comprovante de residência

Após análise, entraremos em contato para dar continuidade ao credenciamento.`);
  } else {
    await sendTyping();
    await msg.reply(`🤖 Desculpe, não entendi sua mensagem. Responda com "paciente" ou "psicólogo(a)" para continuar.`);
  }
});

client.initialize();

app.get('/qr', (req, res) => {
    if (!qrCodeDataURL) return res.send('⚠️ QR Code ainda não gerado.');
    res.send(`
        <html>
            <body style="display:flex;align-items:center;justify-content:center;height:100vh;">
                <img src="${qrCodeDataURL}" style="width:300px;height:300px;" />
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor web ouvindo na porta ${PORT}. Acesse /qr para ver o QR Code.`);
});
