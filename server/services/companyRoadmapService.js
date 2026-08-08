// =======================================
// Generate Company Roadmap
// =======================================

const generateCompanyRoadmap = (stats) => {

    const roadmap = [];

    if (stats.totalSolved < 150) {

        roadmap.push({
            company: "Amazon",
            focus: "Arrays, Strings, Hash Maps"
        });

        roadmap.push({
            company: "Microsoft",
            focus: "Binary Search, Trees"
        });

    } else if (stats.totalSolved < 300) {

        roadmap.push({
            company: "Amazon",
            focus: "Trees, Graphs, Sliding Window"
        });

        roadmap.push({
            company: "Microsoft",
            focus: "Dynamic Programming, Backtracking"
        });

        roadmap.push({
            company: "Adobe",
            focus: "Greedy, Binary Search"
        });

    } else {

        roadmap.push({
            company: "Google",
            focus: "Graphs, DP, Advanced Trees"
        });

        roadmap.push({
            company: "Amazon",
            focus: "Systematic DSA Revision"
        });

        roadmap.push({
            company: "Microsoft",
            focus: "Hard DP, Graph Algorithms"
        });

        roadmap.push({
            company: "Adobe",
            focus: "Contest-Level Problems"
        });

        roadmap.push({
            company: "Flipkart",
            focus: "Greedy, Graphs, Strings"
        });

    }

    return roadmap;
};

module.exports = {
    generateCompanyRoadmap
};