import React, { useState, useEffect } from "react";
import { data, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../Assets/Images/Logo.png";
import logo_icon from "../Assets/Images/Logo_Icon.png";
import { toast } from "react-hot-toast";

const Navbar = ({ role, setRole }) => {

    // ========================================
    // State Management
    // ========================================
    const [isOpen, setIsOpen] = useState(false);           // Controls mobile menu toggle
    const [isSmallScreen, setIsSmallScreen] = useState(false); // Detect small screen for logo change

    const location = useLocation();   // Detect route change
    const navigate = useNavigate();   // For programmatic navigation


    // ========================================
    // Screen Resize Effect
    // ========================================
    useEffect(() => {

        const checkScreen = () => {
            setIsSmallScreen(window.innerWidth < 500);
        };

        checkScreen(); // Run once on mount

        window.addEventListener("resize", checkScreen);

        // Cleanup event listener
        return () => window.removeEventListener("resize", checkScreen);

    }, []);


    // ========================================
    // Logout Handler
    // ========================================
    const handleLogout = async () => {
        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/authentication/logout`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setRole("Normal");        // Reset role after logout
                navigate("/");            // Redirect to home page
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            console.error(err);
        }
    };


    // ========================================
    // Close Mobile Menu On Route Change
    // ========================================
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);


    return (
        <section className="Navbar-Section">
            <nav className="navbar-container">
                <div className="custom-navbar">

                    {/* ================= Logo Section ================= */}
                    <NavLink to="/" className="nav-logo">
                        <img
                            src={isSmallScreen ? logo_icon : logo}
                            alt="Marwadi University"
                            className={isSmallScreen ? "img-icon" : "img-full"}
                        />
                    </NavLink>


                    {/* ================= Navigation Links ================= */}
                    <ul className={`nav-links ${isOpen ? "mobile-active" : ""}`}>

                        <li>
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? "active-link" : ""}`
                                }
                            >
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/schedule"
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? "active-link" : ""}`
                                }
                            >
                                Schedule
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/participate"
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? "active-link" : ""}`
                                }
                            >
                                Participate
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/help"
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? "active-link" : ""}`
                                }
                            >
                                Help
                            </NavLink>
                        </li>

                        {/* Only show Logout if user is NOT 'Normal' */}

                    </ul>


                    {/* ================= Right Side Actions ================= */}
                    <div className="nav-actions">

                        {/* If role is 'Normal' show Login icon otherwise show Logout button */}
                        {role === "Normal" ? (

                            <NavLink to="/login" className="profile-icon">
                                <i className="bi bi-person-circle"></i>
                            </NavLink>

                        ) : (

                            <button
                                className="nav-logout-btn"
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#222831",
                                    fontWeight: "500",
                                    opacity: "0.7",
                                }}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        )}


                        {/* ================= Mobile Toggler ================= */}
                        <button
                            className="mobile-toggler"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <div className={`hamburger ${isOpen ? "open" : ""}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>

                    </div>

                </div>
            </nav>
        </section>
    );
};

export default Navbar;