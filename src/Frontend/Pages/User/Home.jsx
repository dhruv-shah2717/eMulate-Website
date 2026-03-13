import React, { useState, useEffect } from "react";
import Hero from "../../Assets/Images/Hero.png";
import { NavLink } from "react-router-dom";

function Home() {

    // ==============================
    // State Management
    // ==============================
    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);


    // ==============================
    // Static Registration Events Data
    // ==============================
    const registrationEvents = [
        { name: "Tech Events", price: "₹ 50" },
        { name: "Non Tech Events", price: "₹ 100" },
        { name: "Fun Events", price: "₹ 50" },
    ];


    // ==============================
    // Fetch Categories & Events Data
    // ==============================
    useEffect(() => {

        const fetchData = async () => {
            try {

                // Fetch Categories and Events from backend
                const [catRes, eventRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/category`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/event`)
                ]);

                const catData = await catRes.json();
                const eventData = await eventRes.json();

                // Set fetched data to state
                setCategories(catData);
                setEvents(eventData);

            } catch (err) {

                console.error(err);
            }

            finally { 

                // Stop loading spinner
                setLoading(false);
            }
        };

        fetchData();

    }, []);


    // ========================================
    // JSX Rendering
    // ========================================
    return (
        <main className="Home-page">

            {/* ==============================
                Hero Image Section
            ============================== */}
            <section className="Heroimage-Section">
                <img
                    src={Hero}
                    alt="Hero"
                    className="hero-main-img"
                />
            </section>


            {/* ==============================
                General Registration Section
            ============================== */}
            <section className="Genralregister-Section Dhruv Mahek">

                <div className="glass-card">

                    <div className="card-header">
                        <i className="bi bi-pencil-square"></i>
                        <h3>General Registration</h3>
                        <p className="accent-text">
                            Last Date: 30th Jan, 2026
                        </p>
                    </div>

                    {/* Registration Event List */}
                    <div className="event-list">
                        {registrationEvents.map((event, index) => (
                            <div key={index} className="event-item">
                                <span>{event.name}</span>
                                <span className="price-badge">
                                    {event.price}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Special Offer Section */}
                    <div className="offer-border">

                        <div className="offer-item">
                            <p>Fashion Show - Audition</p>
                            <div className="glass-pill">
                                ₹ 500 (Per Team)
                            </div>
                        </div>

                        <div className="offer-item">
                            <p>Fashion Show - Finalist</p>
                            <div className="glass-pill">
                                ₹ 5000 (Per team)
                            </div>
                        </div>

                    </div>

                </div>

            </section>


            {/* ==============================
                Dynamic Events Section
            ============================== */}
            <section className="Events-Sections Dhruv Mahek">

                <div className="glass-card">

                    {loading ? (

                        // Loading State
                        <div className="text-center">
                            <div>Events Loading...</div>
                        </div>
                    
                    ) : events.length === 0 ? (
                        
                            // If no data found
                            <div className="text-center">
                                <div>Events Not Found</div>
                            </div>
                    
                    ) : (

                        categories.map((cat) => {

                            // Filter events belonging to current category
                            const filteredEvents = events.filter(
                                (ev) => ev.Cat_Id?._id === cat._id
                            );

                            // If no events in this category, do not render it
                            if (filteredEvents.length === 0) return null;

                            return (
                                <div key={cat._id} className="category-wrapper">

                                    {/* Category Header */}
                                    <div className="category-header">
                                        <h3>{cat.Name}</h3>
                                    </div>

                                    <div className="container-fluid px-0 mb-5">
                                        <div className="row g-2">

                                            {filteredEvents.map((event) => (
                                                <div
                                                    key={event._id}
                                                    className="col-lg-4 col-md-6 col-12"
                                                >
                                                    {/* Navigate to Product Page using DB ID */}
                                                    <NavLink
                                                        to={`/product/${event._id}`}
                                                        className="event-item"
                                                    >
                                                        <i className="bi bi-check2-circle"></i>
                                                        <span>{event.Name}</span>
                                                    </NavLink>
                                                </div>
                                            ))}

                                        </div>
                                    </div>

                                </div>
                            );
                        })
                                       
                    )}

                </div>

            </section>

        </main>
    );
}

export default Home;
