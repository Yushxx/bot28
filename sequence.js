// Fonction pour générer une séquence de jeu Apple
function generateAppleSequence() {
    const sequence = ["🟩", "🟩", "🟩", "🟩", "🍎"];
    for (let i = sequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
    }
    return sequence.join(" ");
}

module.exports = { generateAppleSequence };
