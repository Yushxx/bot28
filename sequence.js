// Limite de signaux pour les utilisateurs gratuits
const freeSequenceLimit = 5;

// Liste des utilisateurs pro
const proUserIds = [5873712733, 6461768442]; // Remplacez ces IDs par les IDs des utilisateurs pro

// Séquences d'utilisateurs
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

module.exports = {
    generateAppleSequence,
    freeSequenceLimit,
    proUserIds,
    userSequences
};
