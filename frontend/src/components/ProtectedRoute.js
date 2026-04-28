import { Navigate, useLocation } from "react-router-dom";
import { getHomePath, getStoredToken, getStoredUser } from "../utils/auth";

export default function ProtectedRoute({ allowedRoles, children }) {
    const location = useLocation();
    const token = getStoredToken();
    const user = getStoredUser();

    if (!token || !user) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={getHomePath(user.role)} replace />;
    }

    return children;
}
