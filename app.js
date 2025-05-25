const QRCode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    authStrategy: new LocalAuth({ dataPath: './session' })
});

client.on('qr', async qr => {
    const qrImageUrl = await QRCode.toDataURL(qr);
    console.log('⚠️ Escaneie este QR Code com o WhatsApp:');
    console.log(qrImageUrl);
});

client.on('ready', () => {
    console.log('✅ WhatsApp conectado com sucesso!');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

client.on('message', async msg => {
    const chat = await msg.getChat();
    const nome = (await msg.getContact()).pushname || 'amigo(a)';
    const lower = msg.body.toLowerCase();

    const sendTyping = async () => {
        await chat.sendStateTyping();
        await delay(1500);
    };

    if (['oi', 'olá', 'ola', 'menu', 'começar', 'inicio'].some(w => lower.includes(w))) {
        await sendTyping();
        await client.sendMessage(msg.from, `👋 Olá! Seja bem-vindo(a) à *MindSync* 🧠✨

Aqui, conectamos você ao cuidado psicológico com empatia, acolhimento e preço acessível. 💙

Antes de continuarmos, me diz uma coisa:
Você está aqui como:

1️⃣ Paciente
2️⃣ Psicólogo(a)`);
    } else if (lower.includes('1') || lower.includes('paciente')) {
        await sendTyping();
        await client.sendMessage(msg.from, `📋 *Formulário do Paciente:*

Por favor, responda as seguintes perguntas:

🧑‍💼 Nome completo:
📞 Número de WhatsApp:
📅 Melhor dia e horário para atendimento:
💬 Preferência por atendimento: Texto, Vídeo ou Áudio

Digite tudo em uma única mensagem 😉`);
    } else if (lower.includes('2') || lower.includes('psicólogo') || lower.includes('psicologa')) {
        await sendTyping();
        await client.sendMessage(msg.from, `📋 *Formulário para Profissionais:*

Envie os seguintes dados em uma única mensagem:

🧑‍⚕️ Nome completo
🆔 Número do CRP
📄 Diploma (anexo ou link)
📬 Comprovante de endereço (anexo ou link)
📜 Certidão de regularidade do CRP
🧠 Áreas de atuação / experiência

Assim que analisarmos, entraremos em contato! 💙`);
    } else if (msg.body.length > 20 && msg.body.includes(' ')) {
        await sendTyping();
        await client.sendMessage(msg.from, `✅ Obrigado(a), ${nome}! Recebemos suas informações.
Nosso time analisará e entrará em contato pelo WhatsApp em breve. 💬`);
    }
});