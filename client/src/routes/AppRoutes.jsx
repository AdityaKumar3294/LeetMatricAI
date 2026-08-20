import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Notes from "../pages/Notes";
import Friends from "../pages/Friends";
import Leaderboard from "../pages/Leaderboard";
import NotFound from "../pages/NotFound";
import PublicProfile from "../pages/PublicProfile";
import FriendComparison from "../pages/FriendComparison";
import NoteDetails from "../pages/NoteDetails";
import AIAnalysis from "../pages/AIAnalysis";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Public */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* Dashboard */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* AI Performance Analysis */}

                <Route
                    path="/ai-analysis"
                    element={
                        <ProtectedRoute>
                            <AIAnalysis />
                        </ProtectedRoute>
                    }
                />


                {/* Profile */}

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />


                {/* Notes */}

                <Route
                    path="/notes"
                    element={
                        <ProtectedRoute>
                            <Notes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/notes/:noteId"
                    element={
                        <ProtectedRoute>
                            <NoteDetails />
                        </ProtectedRoute>
                    }
                />


                {/* Friends */}

                <Route
                    path="/friends"
                    element={
                        <ProtectedRoute>
                            <Friends />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/friends/profile/:userId"
                    element={
                        <ProtectedRoute>
                            <PublicProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/friends/compare/:friendId"
                    element={
                        <ProtectedRoute>
                            <FriendComparison />
                        </ProtectedRoute>
                    }
                />


                {/* Leaderboard */}

                <Route
                    path="/leaderboard"
                    element={
                        <ProtectedRoute>
                            <Leaderboard />
                        </ProtectedRoute>
                    }
                />


                {/* 404 */}

                <Route
                    path="*"
                    element={
                        <ProtectedRoute>
                            <NotFound />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


export default AppRoutes;