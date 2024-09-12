const TelegramBot = require('node-telegram-bot-api');
const { generateAppleSequence } = require('./sequence');
const { checkUserMembership } = require('./membership');
const http = require('http');

// Variables globales
const token = '7282753875:AAEcih5wYDaniimZD_5lWt3qhn7ElhQvGl4';
const bot = new TelegramBot(token, { polling: true });
const channelIds = [-1001923341484, -1002017559099];
const freeSequenceLimit = 5;
const proUserIds = [5873712733, 6461768442]; // Remplacer par les vrais IDs
let userSequences = {};

// Gestion de la commande /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const name = msg.chat.first_name || "Utilisateur";

    // Stocker l'ID utilisateur
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
        const isMember = await checkUserMembership(bot, chatId, channelIds);
        if (!isMember) {
            bot.sendMessage(chatId, 'Veuillez rejoindre les canaux d\'abord.');
        } else {
            const tutorialMessage = `Pour profiter des hacks, veuillez créer un compte authentique en utilisant le code promo ZFree221\n pour connecter le bot aux algorithmes.\nVeuillez regarder ce tutoriel 👇`;
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
        bot.sendMessage(chatId, 'Veuillez envoyer votre id.');
    } else if (callbackData === 'get_signal') {
        handleSignalRequest(bot, chatId);
    } else if (callbackData === 'pro_version') {
        bot.sendMessage(chatId, 'Contactez l\'admin @medatt00 pour obtenir la version pro.');
    }
});

// Gestion des messages (vérification de l'ID 1xbet)
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (/^\d+$/.test(text)) {
        const userId = parseInt(text);
        if (userId >= 900000000 && userId <= 999999999) {
            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Recevoir le signal', callback_data: 'get_signal' }]
                    ]
                }
            };
            bot.sendMessage(chatId, 'ID accepté.', options);
        } else {
            bot.sendMessage(chatId, 'ID refusé. Veuillez créer d\'abord un nouveau compte.');
        }
    }
});

// Fonction pour gérer les demandes de signal
function handleSignalRequest(bot, chatId) {
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
}

module.exports = bot;
