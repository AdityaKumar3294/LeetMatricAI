const generateAICoach = (user) => {

    const total =
        user.leetcodeStats?.totalSolved || 0;

    const easy =
        user.leetcodeStats?.easySolved || 0;

    const medium =
        user.leetcodeStats?.mediumSolved || 0;

    const hard =
        user.leetcodeStats?.hardSolved || 0;

    const xp =
        user.xp || 0;

    const streak =
        user.streak || 0;

    //------------------------------------------
    // Strength
    //------------------------------------------

    let strength = {
        title: "",
        message: ""
    };

    if (easy >= medium && easy >= hard) {

        strength = {
            title: "Strong Foundation",
            message:
                "You have built a solid foundation by solving many Easy problems."
        };

    }

    else if (medium >= easy && medium >= hard) {

        strength = {
            title: "Problem Solver",
            message:
                "You are comfortable solving Medium level interview questions."
        };

    }

    else {

        strength = {
            title: "Advanced Coder",
            message:
                "Excellent Hard problem solving ability."
        };

    }

    //------------------------------------------
    // Weakness
    //------------------------------------------

    let weakness = {
        title: "",
        message: ""
    };

    if (hard < 20) {

        weakness = {
            title: "Hard Problems",
            message:
                "Increase your Hard problem count to improve interview readiness."
        };

    }

    else if (medium < 100) {

        weakness = {
            title: "Medium Problems",
            message:
                "Practice more Medium problems for better consistency."
        };

    }

    else {

        weakness = {
            title: "Consistency",
            message:
                "Keep maintaining your daily coding streak."
        };

    }

    //------------------------------------------
    // Daily Goal
    //------------------------------------------

    let dailyGoal = "";

    if (hard < 20) {

        dailyGoal =
            "Solve 1 Hard + 2 Medium problems today.";

    }

    else {

        dailyGoal =
            "Solve 3 Medium problems and revise old questions.";

    }

    //------------------------------------------
    // Weekly Goal
    //------------------------------------------

    const weeklyGoal =
        "Solve at least 20 problems and participate in the Weekly Contest.";

    //------------------------------------------
    // Interview Readiness
    //------------------------------------------

    let interviewReadiness = "Beginner";

    if (total >= 150)
        interviewReadiness = "Intermediate";

    if (total >= 300)
        interviewReadiness = "Good";

    if (total >= 500)
        interviewReadiness = "Excellent";

    //------------------------------------------
    // Placement Readiness
    //------------------------------------------

    let placement = 30;

    placement += Math.min(total * 0.15, 40);
    placement += Math.min(streak * 2, 20);
    placement += Math.min(xp / 20, 10);

    placement = Math.min(
        Math.round(placement),
        100
    );

    //------------------------------------------
    // Confidence
    //------------------------------------------

    const confidence =
        Math.min(
            60 + Math.floor(total / 10),
            99
        );

    //------------------------------------------
    // Return
    //------------------------------------------

    return {

        strength,

        weakness,

        dailyGoal,

        weeklyGoal,

        interviewReadiness,

        placementReadiness: placement,

        confidence

    };

};

module.exports = {
    generateAICoach
};