import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Wait until AuthContext finishes checking the token
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400"></div>

                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Checking authentication...
                    </p>
                </div>
            </div>
        );
    }

    // No authenticated user → send to login
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Authenticated → allow access
    return children;
};

export default ProtectedRoute;