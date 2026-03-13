import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../Assets/Images/Logo_Footer.png";
import toast from "react-hot-toast";

const AdminNav = ({ setRole }) => {

    // ========================================
    // Navigation & State
    // ========================================
    const navigate = useNavigate();          // For programmatic navigation
    const [open, setOpen] = useState(false); // Sidebar toggle state


    // ========================================
    // Logout Function
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

                // Reset role if function exists
                if (setRole) {
                    setRole("Normal");
                }

                navigate("/");

            } else {
                toast.error(data.message);
            }

        } catch (err) {
            console.error("Logout Error:", err);
            toast.error("Something went wrong");
        }
    };

    // ========================================
    // Send Mu Fest Passes Function
    // ========================================
    const handleGeneratePasses = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/authentication/genrate/mufestpass`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
    
            const data = await response.json();
    
            if (response.ok) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <>
            {/* ================= Sidebar ================= */}
            <aside className={`sidebar ${open ? "show" : ""}`}>

                {/* ===== Logo Section ===== */}
                <div className="logo">
                    <Link to="/admin">
                        <img src={logo} alt="Logo" />
                    </Link>
                </div>

                {/* ===== Menu Heading ===== */}
                <div className="menu-heading">MAIN</div>

                {/* ===== Navigation Menu ===== */}
                <nav className="nav-menu">

                    <NavLink
                        to="/admin"
                        className="nav-item"
                        onClick={() => setOpen(false)}
                    >
                        <i className="bi bi-speedometer2"></i>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/admincategory"
                        className="nav-item"
                        onClick={() => setOpen(false)}
                    >
                        <i className="bi bi bi-list-ul"></i>
                        <span>Category</span>
                    </NavLink>

                    <NavLink
                        to="/adminevent"
                        className="nav-item"
                        onClick={() => setOpen(false)}
                    >
                        <i className="bi bi-calendar4-event"></i>
                        <span>Event</span>
                    </NavLink>

                    <NavLink
                        to="/adminregistration"
                        className="nav-item"
                        onClick={() => setOpen(false)}
                    >
                        <i className="bi bi-pencil-square"></i>
                        <span>Registration</span>
                    </NavLink>

                    <NavLink
                        to="/adminparticipate"
                        className="nav-item"
                        onClick={() => setOpen(false)}
                    >
                        <i className="bi bi-people"></i>
                        <span>Participate</span>
                    </NavLink>

                    <div
                        className="nav-item"
                        onClick={handleGeneratePasses}
                    >
                        <i className="bi bi-envelope"></i>
                        <span>Send MU Pass</span>
                    </div>

                    {/* ===== Logout Item ===== */}
                    <div
                        className="nav-item"
                        onClick={handleLogout}
                        style={{ cursor: "pointer" }}
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                    </div>

                </nav>
            </aside>


            {/* ================= Header ================= */}
            <header className="header">

                {/* Hamburger Icon */}
                <i
                    className="bi bi-list hamburger"
                    onClick={() => setOpen(!open)}
                ></i>

                {/* Admin Profile Section */}
                <div className="user-profile">
                    <i className="bi bi-person"></i>
                    <span>Hello Admin!</span>
                </div>

            </header>
        </>
    );
};

export default AdminNav;