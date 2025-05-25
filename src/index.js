
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🤖 Bot pronto!');
});

client.on('message', message => {
    const chat = message.getChat();

    if (message.body.toLowerCase().includes('oi') || message.body.toLowerCase().includes('olá')) {
        message.reply('Olá! Você é um *cliente* ou um *profissional*?');
    }

    if (message.body.toLowerCase().includes('profissional')) {
        message.reply('Preencha esse formulário para se cadastrar como profissional:
https://forms.gle/seu-formulario-aqui');
    }

    if (message.body.toLowerCase().includes('cliente')) {
        message.reply('Ótimo! Você pode acessar nosso site aqui: https://mindsync.com.br');
    }

    chat.then(c => {
        if (c.isGroup) {
            message.reply('🚨 Este é um grupo. Algumas funções do bot são limitadas aqui.');
        }
    });
});

client.initialize();
