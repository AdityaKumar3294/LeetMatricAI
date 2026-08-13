import { useEffect, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import LeaderboardTable
    from "../components/leaderboard/LeaderboardTable";

import { getLeaderboard }
    from "../services/leaderboardService";

import { useTheme }
    from "../context/ThemeContext";


function Leaderboard() {

    const { theme } = useTheme();

    const [leaderboard, setLeaderboard] = useState([]);

    const [currentUser, setCurrentUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const fetchLeaderboard = async () => {

            try {

                const response =
                    await getLeaderboard();

                console.log(
                    "Leaderboard Response:",
                    response
                );

                setLeaderboard(
                    response.leaderboard || []
                );

                setCurrentUser(
                    response.currentUser || null
                );

            }

            catch (error) {

                console.log(
                    "Leaderboard Error:",
                    error
                );

            }

            finally {

                setLoading(false);

            }

        };


        fetchLeaderboard();

    }, []);


    if (loading) {

        return (

            <div className="flex justify-center items-center h-screen">

                <p className="text-xl font-semibold">
                    Loading Leaderboard...
                </p>

            </div>

        );

    }


    return (

        <div
            className={`flex min-h-screen
            transition-colors duration-300
            ${
                theme === "dark"
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-900"
            }`}
        >

            {/* Sidebar */}

            <Sidebar />


            {/* Main */}

            <div className="flex-1 ml-64">

                <Navbar />


                <main className="p-6">

                    {/* Heading */}

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold">

                            🏆 Leaderboard

                        </h1>

                        <p
                            className={`mt-2
                            ${
                                theme === "dark"
                                    ? "text-slate-400"
                                    : "text-slate-600"
                            }`}
                        >
                            Compete with other developers
                            and climb the rankings.
                        </p>

                    </div>


                    {/* Leaderboard */}

                    <LeaderboardTable
                        leaderboard={leaderboard}
                        currentUser={currentUser}
                    />

                </main>

            </div>

        </div>

    );

}


export default Leaderboard;