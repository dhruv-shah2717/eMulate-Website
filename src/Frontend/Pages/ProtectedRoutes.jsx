import { Navigate, Outlet } from "react-router-dom";
import Loader from "../Pages/Loader";

/**
 * ProtectedRoutes Component
 * 
 * This component restricts access to routes based on user role.
 * - If userRole is null, it renders nothing (can be replaced with a spinner if needed).
 * - If userRole matches allowedRole, it renders the child routes using <Outlet />.
 * - Otherwise, it redirects the user to the login page.
 * 
 * @param {string|null} userRole - The current user's role.
 * @param {string} allowedRole - The role required to access this route.
 */
const ProtectedRoutes = ({ userRole, allowedRole }) => {
    // If userRole is not loaded yet
    if (userRole === null) {
        return <Loader />; // Can replace with a loader/spinner if desired
    }

    // If userRole matches the allowedRole, render child routes
    if (userRole === allowedRole) {
        return <Outlet />;
    }
    
    // Otherwise, redirect to login
    return <Navigate to="/login" replace />;
};

export default ProtectedRoutes;