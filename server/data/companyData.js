const companyData = {
    Google: {
        difficulty: "★★★★★",

        focus: [
            "Graphs",
            "Dynamic Programming",
            "Trees",
            "Greedy",
            "Sliding Window",
            "System Design"
        ],

        interviewStyle:
            "Optimization, Deep Problem Solving, Communication",

        recommendedProblems: [
            "Word Ladder",
            "Trapping Rain Water",
            "Binary Tree Maximum Path Sum",
            "Merge Intervals",
            "Serialize Binary Tree"
        ]
    },

    Amazon: {
        difficulty: "★★★★☆",

        focus: [
            "Arrays",
            "HashMap",
            "Trees",
            "Heaps",
            "Sliding Window"
        ],

        interviewStyle:
            "Behavioral + DSA",

        recommendedProblems: [
            "LRU Cache",
            "Top K Frequent",
            "K Closest Points",
            "Number of Islands"
        ]
    },

    Microsoft: {
        difficulty: "★★★★☆",

        focus: [
            "Trees",
            "Graphs",
            "Linked List",
            "DP"
        ],

        interviewStyle:
            "Clean Code + Edge Cases",

        recommendedProblems: [
            "Clone Graph",
            "Merge Intervals",
            "Word Break",
            "Lowest Common Ancestor"
        ]
    }
};

module.exports = companyData;