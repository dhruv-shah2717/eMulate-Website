import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const Product = () => {

    // ==============================
    // Get Event ID from URL
    // ==============================
    const { id } = useParams();


    // ==============================
    // State Management
    // ==============================
    const [event, setEvent] = useState(null);


    // ==============================
    // Fetch Event Data by ID
    // ==============================
    useEffect(() => {

        const fetchEventDetails = async () => {
            try {

                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/event/${id}`
                );

                const data = await response.json();

                // Set event data
                setEvent(data);

            } catch (err) {

                console.error(err);

            }
        };

        fetchEventDetails();

    }, [id]);


    // ==============================
    // Not Found UI
    // ==============================
    if (!event) {
        return (
            <section className="Eventcard-Section">
                <div className="d-flex justify-content-center">
                    <div className="event-main-card">
                        <div className="text-center">
                            Event Not Found
                        </div>
                    </div>
                </div>
            </section>
        );
    }


    // ==============================
    // Registration Status Logic
    // ==============================
    const regstatus =
        event.Seats > 0 ? "Seats Available" : "Seats Full";
    
    const disablebtn =
        event.Seats > 0 ? true : false;

    const statusclass =
        event.Seats > 0 ? "reg-badge-open" : "reg-badge-close";


    // ========================================
    // JSX Rendering
    // ========================================
    return (
        <section className="Eventcard-Section Dhruv">

            <div className="d-flex justify-content-center">

                <div className="event-main-card">

                    <div className="row g-0">

                        {/* ==============================
                            LEFT SIDE: Event Information
                        ============================== */}
                        <div className="col-md-7 info-side">

                            {/* Registration Status Badge */}
                            <span className={statusclass}>
                                {regstatus}
                            </span>

                            {/* Event Title */}
                            <h2 className="event-name-title">
                                {event.Name}
                            </h2>

                            {/* Event Details List */}
                            <ul className="details-list">

                                <li>
                                    <div className="icon-indicator"></div>
                                    <i className="bi bi-calendar3"></i>
                                    <span>
                                        <strong>Day:</strong> {event.Day}
                                    </span>
                                </li>

                                <li>
                                    <div className="icon-indicator"></div>
                                    <i className="bi bi-clock"></i>
                                    <span>
                                        <strong>Time:</strong> {event.Time}
                                    </span>
                                </li>

                                <li>
                                    <div className="icon-indicator"></div>
                                    <i className="bi bi-geo-alt"></i>
                                    <span>
                                        <strong>Location:</strong> {event.Location}
                                    </span>
                                </li>

                                <li>
                                    <div className="icon-indicator"></div>
                                    <i className="bi bi-tag"></i>
                                    <span>
                                        <strong>Event Type:</strong>{" "}
                                        {event.Cat_Id.Name}
                                    </span>
                                </li>

                                <li>
                                    <div className="icon-indicator"></div>
                                    <i className="bi bi-people"></i>
                                    <span>
                                        <strong>Team Size:</strong> ({event.Group})
                                    </span>
                                </li>

                            </ul>

                            {/* Event Description */}
                            <p className="description-text">
                                {event.Description}
                            </p>

                        </div>


                        {/* ==============================
                            RIGHT SIDE: Contact Section
                        ============================== */}
                        <div className="col-md-5 contact-side">

                            <h5 className="side-title">
                                Contact Persons
                            </h5>

                            {/* Event Coordinator */}
                            <div className="coord-info">
                                <label>Event Coordinator</label>
                                <h6>{event.Evn_Cordinator}</h6>
                                <p className="phone-accent">
                                    <i className="bi bi-telephone-fill"></i>{" "}
                                    {event.Evn_Co_Number}
                                </p>
                            </div>

                            {/* Student Coordinator */}
                            <div className="coord-info">
                                <label>Student Coordinator</label>
                                <h6>{event.Stu_Cordinator}</h6>
                                <p className="phone-accent">
                                    <i className="bi bi-telephone-fill"></i>{" "}
                                    {event.Stu_Co_Number}
                                </p>
                            </div>

                            {/* Registration Button */}
                            {disablebtn == true ? (

                                <Link
                                    to={`/registration/${event._id}`}
                                    className="mt-auto"
                                >
                                    <button className="register-btn-small">
                                        Register Now ₹ {event.Price}
                                    </button>
                                </Link>

                            ) : (
                                    
                                <button className="register-btn-small bg-danger">
                                    Seats Full
                                </button>
                                    
                            )}
                            
                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default Product;