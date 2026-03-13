import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Styles
import "./Frontend/Styles/Default.css";
import "./Frontend/Styles/Toast.css";
import "./Frontend/Styles/Navbar.css";
import "./Frontend/Styles/Footer.css";
import "./Frontend/Styles/Home.css";
import "./Frontend/Styles/Login.css";
import "./Frontend/Styles/Schedule.css";
import "./Frontend/Styles/Registration.css";
import "./Frontend/Styles/Help.css";
import "./Frontend/Styles/Product.css";
import "./Frontend/Styles/Admin.css";

// Components
import Navbar from "./Frontend/Components/Navbar";
import Footer from "./Frontend/Components/Footer";
import AdminNavbar from "./Frontend/Components/AdminNavbar";
import Loader from "./Frontend/Pages/Loader";

// User Pages
import Home from "./Frontend/Pages/User/Home";
import Login from "./Frontend/Pages/User/Login";
import Help from "./Frontend/Pages/User/Help";
import Schedule from "./Frontend/Pages/User/Schedule";
import Registration from "./Frontend/Pages/User/Registration";
import Product from "./Frontend/Pages/User/Product";
import Participate from "./Frontend/Pages/User/Participate";

// Admin Pages
import AdminDashboard from "./Frontend/Pages/Admin/Dashboard";
import AdminCategory from "./Frontend/Pages/Admin/Category";
import AdminEvent from "./Frontend/Pages/Admin/Event";
import AdminRegistration from "./Frontend/Pages/Admin/Registration";
import AdminParticipate from "./Frontend/Pages/Admin/Participate";

// Protected Route Component
import ProtectedRoutes from "./Frontend/Pages/ProtectedRoutes";


function App() {
    const [role, setRole] = useState(null);      // Current user role
    const [loading, setLoading] = useState(true); // Loading state while fetching role

    // Fetch user role on mount
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/authentication/checkrole`, {
                    credentials: 'include',
                });
                const data = await res.json();
                setRole(data.Role);
            } catch {
                setRole('Normal'); // Default to Normal if fetch fails
            } finally {
                setLoading(false);
            }
        };
        verifyUser();
    }, []);

    if (loading) return <Loader />;

    // Toast configuration
    const toastCfg = {
        duration: 2000,
        className: "my-toast",
        success: { className: "my-toast my-toast-success" },
        error: { className: "my-toast my-toast-error" },
        warning: { className: "my-toast my-toast-warning" },
        loading: { className: "my-toast my-toast-loading" },
    };

    return (
        <>
            <Toaster position="top-center" toastOptions={toastCfg} />

            <Routes>
                {/* --- 1. PUBLIC & USER LAYOUT --- */}
                <Route
                    element={
                        <>
                            <Navbar role={role} setRole={setRole} />
                            <Outlet /> {/* Renders Home, Schedule, etc. */}
                            <Footer />
                        </>
                    }
                >
                    {/* Public Pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setRole={setRole} />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/product/:id" element={<Product />} />

                    {/* User Protected Pages */}
                    <Route element={<ProtectedRoutes userRole={role} allowedRole="User" />}>
                        <Route path="/participate" element={<Participate />} />
                        <Route path="/registration/:id" element={<Registration />} />
                    </Route>
                </Route>

                {/* --- 2. ADMIN LAYOUT --- */}
                <Route element={<ProtectedRoutes userRole={role} allowedRole="Admin" />}>
                    <Route
                        element={
                            <div className="admin-layout admin">
                                <AdminNavbar setRole={setRole} />
                                <main className="main-content">
                                    <Outlet /> {/* Renders Admin Dash, Events, etc. */}
                                </main>
                            </div>
                        }
                    >
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admincategory" element={<AdminCategory />} />
                        <Route path="/adminevent" element={<AdminEvent />} />
                        <Route path="/adminregistration" element={<AdminRegistration />} />
                        <Route path="/adminparticipate" element={<AdminParticipate />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;