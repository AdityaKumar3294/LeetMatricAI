import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                        <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                        <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/notes"
                    element={
                        <ProtectedRoute>
                        <Notes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/friends"
                    element={
                        <ProtectedRoute>
                        <Friends />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/leaderboard"
                    element={
                        <ProtectedRoute>
                        <Leaderboard />
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
                <Route path="*" element={
                    <ProtectedRoute>
                        <NotFound />
                    </ProtectedRoute>
                    } />

                <Route
                    path="/friends/compare/:friendId"
                    element={
                    <ProtectedRoute>
                    <FriendComparison />
                    </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;