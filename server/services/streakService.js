const updateStreak = (user) => {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (!user.lastActive) {

        user.streak = 1;
        user.lastActive = today;
        return;
    }

    const lastActive = new Date(user.lastActive);
    lastActive.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
        (today - lastActive) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
        // Already synced today
        return;
    }

    if (diffDays === 1) {
        user.streak += 1;
    } else {
        user.streak = 1;
    }

    user.lastActive = today;
};

module.exports = {
    updateStreak
};