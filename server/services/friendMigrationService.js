const User = require("../models/User");

const repairMutualFriends = async () => {

    try {

        const users = await User.find({})
            .select("_id friends");

        for (const user of users) {

            for (const friendId of user.friends) {

                const friend =
                    await User.findById(friendId)
                        .select("_id friends");

                if (!friend) {
                    continue;
                }

                const alreadyMutual =
                    friend.friends.some(

                        (id) =>
                            id.toString() ===
                            user._id.toString()

                    );

                if (!alreadyMutual) {

                    friend.friends.push(
                        user._id
                    );

                    await friend.save();

                }

            }

        }

        console.log(
            "✅ Mutual friendship repair completed."
        );

    } catch (error) {

        console.log(
            "Friend migration error:",
            error
        );

    }

};

module.exports = {
    repairMutualFriends
};