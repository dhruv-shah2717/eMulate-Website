import React, { useState } from 'react';
import toast from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setRole }) => {

    // ========================================
    // State Management
    // ========================================
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); // Track field + server errors
    const navigate = useNavigate();


    // ========================================
    // Form Validation Function
    // ========================================
    const validate = () => {

        let tempErrors = {};

        // Username Validation
        if (!username) {
            tempErrors.username = "Username is required";
        } else if (username.length < 5) {
            tempErrors.username = "Username must be at least 5 characters";
        }

        // Password Validation
        if (!password) {
            tempErrors.password = "Password is required";
        } else if (password.length < 6) {
            tempErrors.password = "Password must be at least 6 characters";
        }

        setErrors(tempErrors);

        // Return true if no errors
        return Object.keys(tempErrors).length === 0;
    };


    // ========================================
    // Handle Login Submit
    // ========================================
    const handleSimpleLogin = async (e) => {

        e.preventDefault();

        if (validate()) {

            try {

                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/authentication/login`,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            Grno: username,
                            Password: password
                        }),
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setRole(data.user.role);

                    toast.success(data.message);

                    if (data.user.role === 'Admin') {
                        navigate("/admin");
                    } else {
                        navigate("/");
                    }
                } else {

                    toast.error(data.message);
                }

            } catch (err) {
                console.error(err);
            }
        }
    };


    // ========================================
    // JSX Rendering
    // ========================================
    return (
        <section className="Login-Section Dhruv">

            <div className="glass-card d-flex justify-content-center align-items-center">

                <div className="glass-login-card">

                    {/* Header */}
                    <div className="login-header">
                        <i className="bi bi-shield-lock"></i>
                        <h2>Login</h2>
                    </div>

                    <form
                        onSubmit={handleSimpleLogin}
                        className="login-form"
                    >

                        {/* Username Field */}
                        <div className="form-group mb-3 text-start">

                            <label className="form-label">
                                Enter GR NO
                            </label>

                            <input
                                type="text"
                                className={`form-control ${errors.username ? 'is-invalid' : ''
                                    }`}
                                placeholder="138916"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);

                                    // Clear username error while typing
                                    if (errors.username)
                                        setErrors({
                                            ...errors,
                                            username: ""
                                        });
                                }}
                            />

                            {errors.username && (
                                <div className="error-text">
                                    {errors.username}
                                </div>
                            )}

                        </div>

                        {/* Password Field */}
                        <div className="form-group mb-4 text-start">

                            <label className="form-label">
                                Enter Password
                            </label>

                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''
                                    }`}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);

                                    // Clear password error while typing
                                    if (errors.password)
                                        setErrors({
                                            ...errors,
                                            password: ""
                                        });
                                }}
                            />

                            {errors.password && (
                                <div className="error-text">
                                    {errors.password}
                                </div>
                            )}

                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="login-btn w-100 mb-3"
                        >
                            Login
                        </button>

                        {/* Footer Links */}
                        <div className="login-footer">
                            <Link
                                to="/forgot"
                                className="float-start"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                    </form>

                </div>
            </div>
        </section>
    );
};

export default Login;