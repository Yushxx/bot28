const mysql = require('mysql2');
const bot = require('./bot');
const channelIds = [-1001923341484, -1002017559099];

// Créer une connexion à la base de données MySQL
const db = mysql.createConnection({
    host: '109.70.148.57', // Remplacez par l'hôte de votre base de données
    user: 'solkahor_skh', // Remplacez par votre nom d'utilisateur MySQL
    password: 'TesteTest2024', // Remplacez par votre mot de passe MySQL
    database: 'solkahor_skh'// Remplacez par le nom de votre base de données
});

// Se connecter à la base de données
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

// Fonction pour enregistrer l'ID utilisateur dans la base de données
function saveUserToDatabase(chatId, firstName) {
    const sql = 'INSERT INTO users (telegram_id, first_name) VALUES (?, ?)';
    db.query(sql, [chatId, firstName], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion de l\'utilisateur dans la base de données:', err);
        } else {
            console.log('Utilisateur enregistré avec succès, ID:', result.insertId);
        }
    });
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

module.exports = {
    saveUserToDatabase,
    checkUserMembership
};
