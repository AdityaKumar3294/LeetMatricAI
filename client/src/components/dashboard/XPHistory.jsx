import {
    Zap,
    Trophy,
    Flame,
    Code2,
    Star
} from "lucide-react";

import { useEffect, useState } from "react";

import { useTheme } from "../../context/ThemeContext";

import { getXPHistory } from "../../services/xpService";


const XPHistory = () => {

    const { theme } = useTheme();

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchHistory = async () => {

            try {

                const response = await getXPHistory();

                setHistory(response.history || []);

            } catch (error) {

                console.log(
                    "XP History Error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchHistory();

    }, []);


    const getIcon = (type) => {

        switch (type) {

            case "problem":
                return (
                    <Code2
                        size={20}
                        className="text-blue-500"
                    />
                );

            case "streak":
                return (
                    <Flame
                        size={20}
                        className="text-orange-500"
                    />
                );

            case "badge":
                return (
                    <Trophy
                        size={20}
                        className="text-yellow-500"
                    />
                );

            case "contest":
                return (
                    <Star
                        size={20}
                        className="text-purple-500"
                    />
                );

            default:
                return (
                    <Zap
                        size={20}
                        className="text-green-500"
                    />
                );

        }

    };


    const formatTime = (date) => {

        if (!date) return "Just now";

        const diff =
            Math.floor(
                (new Date() - new Date(date)) / 1000
            );

        if (diff < 60)
            return "Just now";

        if (diff < 3600)
            return `${Math.floor(diff / 60)} min ago`;

        if (diff < 86400)
            return `${Math.floor(diff / 3600)} hours ago`;

        if (diff < 604800)
            return `${Math.floor(diff / 86400)} days ago`;

        return new Date(date).toLocaleDateString();

    };


    return (

        <div
            className={`rounded-2xl border p-6 shadow-md
            hover:shadow-xl transition-all duration-300
            ${
                theme === "dark"
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-slate-200"
            }`}
        >

            {/* Header */}

            <div className="flex items-center gap-3 mb-6">

                <Zap
                    className="text-yellow-500"
                    size={24}
                />

                <h2
                    className={`text-xl font-bold
                    ${
                        theme === "dark"
                            ? "text-white"
                            : "text-slate-900"
                    }`}
                >
                    XP History
                </h2>

            </div>


            {/* Loading */}

            {loading && (

                <div
                    className={`text-center py-6
                    ${
                        theme === "dark"
                            ? "text-slate-400"
                            : "text-slate-600"
                    }`}
                >
                    Loading XP history...
                </div>

            )}


            {/* Empty */}

            {!loading && history.length === 0 && (

                <div
                    className={`rounded-xl p-6 text-center
                    ${
                        theme === "dark"
                            ? "bg-slate-800 text-slate-400"
                            : "bg-slate-100 text-slate-600"
                    }`}
                >
                    No XP activity yet.
                </div>

            )}


            {/* History */}

            {!loading && history.length > 0 && (

                <div className="space-y-3">

                    {history.map((item) => (

                        <div
                            key={item._id}
                            className={`flex items-center justify-between
                            rounded-xl p-4
                            ${
                                theme === "dark"
                                    ? "bg-slate-800"
                                    : "bg-slate-100"
                            }`}
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className={`p-2 rounded-lg
                                    ${
                                        theme === "dark"
                                            ? "bg-slate-700"
                                            : "bg-white"
                                    }`}
                                >

                                    {getIcon(item.type)}

                                </div>


                                <div>

                                    <h3
                                        className={`font-semibold
                                        ${
                                            theme === "dark"
                                                ? "text-white"
                                                : "text-slate-900"
                                        }`}
                                    >
                                        {item.reason}
                                    </h3>

                                    <p
                                        className={`text-xs mt-1
                                        ${
                                            theme === "dark"
                                                ? "text-slate-500"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        {formatTime(
                                            item.createdAt
                                        )}
                                    </p>

                                </div>

                            </div>


                            <span
                                className="font-bold text-green-500"
                            >
                                +{item.amount} XP
                            </span>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};


export default XPHistory;