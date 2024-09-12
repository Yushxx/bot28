// Fonction pour vérifier si l'utilisateur est membre des canaux
async function checkUserMembership(bot, userId, channelIds) {
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

module.exports = { checkUserMembership };
