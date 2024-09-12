const TelegramBot = require('node-telegram-bot-api');
const { checkUserMembership } = require('./membership');
const { generateAppleSequence, freeSequenceLimit, proUserIds, userSequences } = require('./sequence');
const token = '7282753875:AAEcih5wYDaniimZD_5lWt3qhn7ElhQvGl4';

// Créez une instance de TelegramBot
const bot = new TelegramBot(token, { polling: true });

// Fonction pour enregistrer l'ID utilisateur dans la base de données
const { saveUserToDatabase } = require('./membership');

// Gestion de la commande /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.chat.first_name || "Utilisateur";

    // Stocker l'ID utilisateur dans la base de données
    saveUserToDatabase(chatId, firstName);

    const welcomeMessage = `Salut ${firstName}, bienvenue dans le hack Apple of Fortune! Veuillez rejoindre les canaux puis cliquez sur check.`;
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

module.exports = bot;
