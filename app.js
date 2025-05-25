const QRCode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    authStrategy: new LocalAuth({
        dataPath: './session'
    })
});

client.on('qr', async qr => {
    const qrImageUrl = await QRCode.toDataURL(qr);
    console.log('🟨 Escaneie o QR Code com o WhatsApp Web:');
    console.log(qrImageUrl);
});

client.on('ready', () => {
    console.log('✅ Bot conectado com sucesso!');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

client.on('message', async msg => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const nome = contact.pushname || 'amigo(a)';
    const lower = msg.body.toLowerCase();

    const sendTyping = async () => {
        await chat.sendStateTyping();
        await delay(1500);
    };

    if (['oi', 'olá', 'ola', 'menu', 'começar', 'inicio'].some(w => lower.includes(w))) {
        await sendTyping();
        await client.sendMessage(msg.from, `🤖 Oi, ${nome}! Aqui é o assistente da MindSync. Como posso te ajudar?

1️⃣ Agendar uma sessão
2️⃣ Saber mais sobre os profissionais
3️⃣ Como funciona a MindSync`);
    } else if (lower.includes('1') || lower.includes('agendar')) {
        await sendTyping();
        await client.sendMessage(msg.from, `📅 Vamos agendar sua sessão! Me diga:
🗓 Dia e horário preferido
👤 Psicólogo(a) de preferência ou se quer indicação
💬 Formato: [Texto | Vídeo | Áudio]`);
    } else if (lower.includes('2') || lower.includes('profissionais')) {
        await sendTyping();
        await client.sendMessage(msg.from, `📘 Nossa equipe é formada por psicólogos(as) experientes, especializados(as) em:
- Ansiedade
- Luto
- Relacionamentos
- Autoconhecimento
- Depressão
Quer ajuda pra escolher?`);
    } else if (lower.includes('3') || lower.includes('funciona')) {
        await sendTyping();
        await client.sendMessage(msg.from, `📌 A MindSync conecta você com psicólogos(as) online por apenas R$50,00 por sessão. Tudo feito com empatia, ética e segurança.`);
    } else if (lower.includes('pix') || lower.includes('pagar') || lower.includes('valor')) {
        await sendTyping();
        await client.sendMessage(msg.from, `💸 O pagamento é via Pix. Cada sessão custa R$50,00 com duração de 40 minutos.
Após o pagamento, sua sessão será confirmada.`);
    } else if (lower.includes('sair') || lower.includes('pausar')) {
        await sendTyping();
        await client.sendMessage(msg.from, `⚠️ Sem problemas! Quando quiser voltar, estarei por aqui. Cuide da sua mente. 💙`);
    } else if (lower.includes('ajuda') || lower.includes('não sei')) {
        await sendTyping();
        await client.sendMessage(msg.from, `🔁 Me diga o que você quer fazer:
1️⃣ Agendar sessão
2️⃣ Ver profissionais
3️⃣ Entender como funciona
Ou fale comigo com suas palavras mesmo!`);
    } else if (lower.includes('áudio') || lower.includes('vídeo') || lower.includes('texto') || lower.includes('dia') || lower.includes('horário')) {
        await sendTyping();
        await client.sendMessage(msg.from, `📌 Agora só falta seu nome completo e número de WhatsApp. Me manda aqui!`);
    } else if (msg.body.length > 10 && msg.body.includes(' ')) {
        await sendTyping();
        await client.sendMessage(msg.from, `✅ Tudo certo, ${nome}! Nossa equipe vai entrar em contato para confirmar sua sessão.
Qualquer dúvida, é só me chamar.`);
    }
});