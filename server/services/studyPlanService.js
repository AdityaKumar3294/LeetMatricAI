// =======================================
// Generate Personalized Study Plan
// =======================================

const generateStudyPlan = (stats) => {

    const plan = [];

    // Beginner
    if (stats.totalSolved < 100) {

        plan.push("Solve 5 Easy problems daily.");
        plan.push("Focus on Arrays, Strings and HashMap.");
        plan.push("Revise basic recursion.");
        plan.push("Attempt one Weekly Contest.");

    }

    // Intermediate
    else if (stats.totalSolved < 300) {

        plan.push("Solve 2 Medium problems daily.");
        plan.push("Practice Trees and Binary Search.");
        plan.push("Start Dynamic Programming.");
        plan.push("Participate in Weekly Contest.");

    }

    // Advanced
    else {

        plan.push("Solve at least 1 Hard problem every day.");
        plan.push("Master Graphs and Dynamic Programming.");
        plan.push("Practice Greedy and Advanced Trees.");
        plan.push("Participate in Weekly + Biweekly Contests.");
        plan.push("Revise previously solved Medium problems.");

    }

    // Hard problems recommendation
    if (stats.hardSolved < 30) {
        plan.push("Increase Hard problem practice.");
    }

    // Medium recommendation
    if (stats.mediumSolved < 150) {
        plan.push("Focus more on Medium-level questions.");
    }

    return plan;
};

module.exports = {
    generateStudyPlan
};