const request = require('request');
const fs = require('fs');
const http = require('http');
const TelegramBot = require('node-telegram-bot-api');

const token = '7282753875:AAEcih5wYDaniimZD_5lWt3qhn7ElhQvGl4';
const bot = new TelegramBot(token, { polling: true });

const channelIds = [-1001923341484, -1002017559099];
const freeSequenceLimit = 5; // Limite de signaux pour les utilisateurs gratuits
const proUserIds = [5873712733, 6461768442]; // Remplacez ces IDs par les IDs des utilisateurs pro
let userSequences = {};

// Fonction pour générer une séquence de jeu Apple
function generateAppleSequence() {
    const sequence = ["🟩", "🟩", "🟩", "🟩", "🍎"];
    for (let i = sequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
    }
    return sequence.join(" ");
}

// Fonction pour vérifier si l'utilisateur est membre des canaux
async function checkUserMembership(userId) {
    for (let channelId of channelIds) {
        try {
            const status = await bot.getChatMember(channelId, userId);
            if (status.status === 'left' || status.status === 'kicked') {
                return false;
            }
        } catch (error) {
            console.error('Erreur lors de la vérification des canaux:', error);
            return false;
        }
    }
    return true;
}

// Fonction pour envoyer une requête POST au script PHP
function storeUserId(userId) {
    request.post({
        url: 'http://solkah.org/b/save.php',
        form: { user_id: userId }
    }, (error, response, body) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de la requête POST:', error);
        } else {
            console.log('Réponse du serveur:', body);
        }
    });
}

// Gestion de la commande /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const name = msg.chat.first_name || "Utilisateur";
    
    // Stocker l'ID utilisateur en envoyant une requête POST
    storeUserId(chatId);

    // Stocker l'ID utilisateur (ceci est un exemple, à améliorer pour un stockage permanent)
    userSequences[chatId] = { count: 0, lastSequenceTime: 0 };

    const welcomeMessage = `Salut ${name}, bienvenue dans le hack Apple of Fortune! Veuillez rejoindre les canaux puis cliquez sur check.`;
    
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Canal 1', url: 'https://t.me/+DZ119_DCChAwOWI0' }],
                [{ text: 'Canal 2', url: 'https://t.me/+5XrGoQkNTgkxY2U0' }],
                [{ text: 'Check ✅️', callback_data: 'check_channels' }]
            ]
        }
    };
    bot.sendMessage(chatId, welcomeMessage, options);
});

// Gestion du bouton "Check"
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const callbackData = query.data;

    if (callbackData === 'check_channels') {
        const isMember = await checkUserMembership(chatId);
        if (!isMember) {
            bot.sendMessage(chatId, 'Veuillez rejoindre les canaux d\'abord.');
        } else {
            const tutorialMessage = `Pour profiter des hacks, veuillez créer un compte authentique en utilisant le code promo ZFree221\n pour connecter le bot aux algorithmes.\nVeuillez regarder\n ce tutoriel 👇`;
            bot.sendMessage(chatId, tutorialMessage);
            bot.sendVideo(chatId, 'https://t.me/gsgzheh/7').then(() => {
                const options = {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Suivant ✅️', callback_data: 'next_step' }]
                        ]
                    }
                };
                bot.sendMessage(chatId, 'Cliquez sur Suivant \npour continuer.', options);
            });
        }
    } else if (callbackData === 'next_step') {
        bot.sendMessage(chatId, 'Veuillez envoyer votre id .');
    } else if (callbackData === 'get_signal') {
        const now = Date.now();
        const user = userSequences[chatId] || { count: 0, lastSequenceTime: 0 };
        const isProUser = proUserIds.includes(chatId);

        if (now - user.lastSequenceTime < 5 * 60 * 1000) {
            bot.sendMessage(chatId, 'Veuillez attendre le prochain signal dans 5 minutes.');
        } else if (!isProUser && user.count >= freeSequenceLimit) {
            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Version Pro', callback_data: 'pro_version' }]
                    ]
                }
            };
            bot.sendMessage(chatId, 'Votre essai gratuit est terminé pour aujourd\'hui.', options);
        } else {
            // Logique pour envoyer les signaux
            const sequenceTemplateApple = `🔔 CONFIRMED ENTRY!\n🍎 Apple : 3\n🔐 Attempts: 4\n⏰ Validity: 5 minutes\n`;
            const signalMessage = `${sequenceTemplateApple}2.41:${generateAppleSequence()}\n1.93:${generateAppleSequence()}\n1.54:${generateAppleSequence()}\n1.23:${generateAppleSequence()}`;

            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Next Signal ✅', callback_data: 'get_signal' }]
                    ]
                }
            };
            bot.sendMessage(chatId, signalMessage, options);
            user.count++;
            user.lastSequenceTime = now;
            userSequences[chatId] = user;
        }
    } else if (callbackData === 'pro_version') {
        bot.sendMessage(chatId, 'Contactez l\'admin @medatt00 pour obtenir la version pro.');
    }
});

// Vérification de l'ID 1xbet
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (/^\d+$/.test(text)) {
        const userId = parseInt(text);
        if (userId >= 900000000 && userId <= 999999999) {
            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Reçoit le signal', callback_data: 'get_signal' }]
                    ]
                }
            };
            bot.sendMessage(chatId, 'ID accepté.', options);
        } else {
            bot.sendMessage(chatId, 'ID refusé. Veuillez créer d\'abord un nouveau compte.');
        }
    }
});

// Créez un serveur HTTP simple qui renvoie "I'm alive" lorsque vous accédez à son URL
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("I'm alive");
    res.end();
});

// Écoutez le port 8080
server.listen(8080, () => {
    console.log("Keep alive server is running on port 8080");
});
