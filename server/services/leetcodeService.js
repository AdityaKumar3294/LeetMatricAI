const { request, gql } = require("graphql-request");

const endpoint = "https://leetcode.com/graphql";

const fetchLeetCodeStats = async (username) => {
    console.log("LeetCode username received:", username);
    try {

        const query = gql`
            query getUserProfile($username: String!) {

                matchedUser(username: $username) {

                    username

                    profile {
                        realName
                        userAvatar
                        ranking
                        reputation
                    }

                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }

                    
                }
            }
        `;

        const variables = {
            username
        };

        const data = await request(endpoint, query, variables);

        if (!data.matchedUser) {
            throw new Error("LeetCode user not found");
        }

        const stats = data.matchedUser.submitStats.acSubmissionNum;

        const totalSolved =
            stats.find(item => item.difficulty === "All")?.count || 0;

        const easySolved =
            stats.find(item => item.difficulty === "Easy")?.count || 0;

        const mediumSolved =
            stats.find(item => item.difficulty === "Medium")?.count || 0;

        const hardSolved =
            stats.find(item => item.difficulty === "Hard")?.count || 0;

        return {
            username: data.matchedUser.username,
            realName: data.matchedUser.profile.realName,
            avatar: data.matchedUser.profile.userAvatar,
            ranking: data.matchedUser.profile.ranking,
            reputation: data.matchedUser.profile.reputation,

            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved
        };

    } catch (error) {

        console.log("========= LEETCODE ERROR =========");
console.log(error.response?.errors);
console.log(error.response?.data);
console.log(error.message);
console.log(error);
console.log("==================================");

throw error;

    }
};

module.exports = {
    fetchLeetCodeStats
};