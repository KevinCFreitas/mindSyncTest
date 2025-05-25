const express = require('express');
const QRCode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
const PORT = process.env.PORT || 3000;

let qrCodeDataURL = '';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', async qr => {
    qrCodeDataURL = await QRCode.toDataURL(qr);
    console.log('✅ QR Code gerado e disponível em /qr');
});

client.on('ready', () => {
    console.log('✅ Bot da MindSync conectado com sucesso!');
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

client.on('message', async msg => {
    const chat = await msg.getChat();
    const lower = msg.body.toLowerCase();

    const responder = async (texto) => {
        await chat.sendStateTyping();
        await delay(1500);
        await client.sendMessage(msg.from, texto);
    };

    if (['oi', 'olá', 'ola', 'menu', 'começar', 'início', 'inicio'].some(w => lower.includes(w))) {
        await responder(`👋 Olá! Seja bem-vindo(a) à *MindSync* 🧠✨

Aqui, conectamos você ao cuidado psicológico com empatia, acolhimento e preço acessível. 💙

Antes de continuarmos, me diz uma coisa:
Você está aqui como:

1️⃣ Paciente  
2️⃣ Psicólogo(a)`);
    } else if (lower.includes('1')) {
        await responder(`📋 Vamos começar seu cadastro como *Paciente*!

1. Nome completo:
2. Idade:
3. Já fez terapia antes? (Sim/Não)
4. Preferência: Psicólogo(a) homem/mulher/tanto faz
5. Horário ideal para atendimento:`);
    } else if (lower.includes('2')) {
        await responder(`📄 Cadastro de *Psicólogo(a)*

Por favor, envie:
1. Nome completo
2. Número do CRP
3. Especialidades
4. Anos de experiência
5. Cidade/Estado
6. Modalidade de atendimento (online/presencial)
7. Anexar:
   - 📎 Carteira do CRP
   - 📎 Certidão de regularidade do CRP
   - 📎 Diploma
   - 📎 Comprovante de endereço`);
    } else if (lower.includes('valor') || lower.includes('preço') || lower.includes('pix')) {
        await responder(`💰 Cada sessão custa *R$50,00* e tem duração média de 40 minutos.

O pagamento é feito via *Pix*, e após o pagamento sua sessão será confirmada. Deseja saber os dados para pagamento?`);
    } else if (lower.includes('sair') || lower.includes('desistir')) {
        await responder(`❌ Sem problemas, você pode voltar quando quiser. A sua jornada de cuidado com a mente é única, e estaremos aqui sempre que precisar 💙`);
    } else {
        await responder(`🤖 Desculpa, não entendi. Você pode me dizer se é *Paciente* ou *Psicólogo(a)*?`);
    }
});

client.initialize();

app.get('/', (req, res) => {
    res.send('🧠 MindSync Bot está rodando!');
});
app.get('/qr', (req, res) => {
    if (!qrCodeDataURL) return res.send('QR Code ainda não gerado.');
    res.send(`<img src="${qrCodeDataURL}" style="width:300px;height:300px;" />`);
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor web ouvindo na porta ${PORT}. Acesse /qr para ver o QR Code.`);
});
