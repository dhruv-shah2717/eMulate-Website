import React, { useState, useEffect } from "react";

const Participate = () => {

    // ==============================
    // State Management
    // ==============================
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);


    // ==============================
    // Fetch Registration Data
    // ==============================
    useEffect(() => {

        const fetchEvents = async () => {
            try {

                // Fetch registration data from backend
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/registration/student/grno`, {
                    method: 'GET',
                    credentials: 'include', 
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();

                // Set fetched data to state
                setScheduleData(data);

            } catch (err) {

                console.error(err);

            } finally {

                // Stop loading spinner
                setLoading(false);

            }
        };

        fetchEvents();

    }, []);


    // ========================================
    // JSX Rendering
    // ========================================
    return (
        <section className="Schedule-Section Dhruv">

            <div className="schedule-card d-flex justify-content-center">

                <div className="glass-card full-width">

                    {/* ==============================
                        Section Header
                    ============================== */}
                    <div className="category-header">
                        <h3>Your Participation</h3>
                    </div>


                    {/* ==============================
                        Responsive Table
                    ============================== */}
                    <div className="table-responsive">

                        <table className="table custom-glass-table">

                            {/* Table Head */}
                            <thead>
                                <tr>
                                    <th>Event Name</th>
                                    <th>Location</th>
                                    <th>Day</th>
                                    <th>Time</th>
                                    <th>Members</th>
                                    <th>Payment</th>
                                    <th>Attend</th>
                                    <th>Rank</th>
                                </tr>
                            </thead>


                            {/* Table Body */}
                            <tbody>

                                {scheduleData.length > 0 ? (

                                    scheduleData.map((item, index) => (

                                        <tr key={index}>

                                            {/* Accessing populated Event details */}
                                            <td className="fw-bold">
                                                {item.Evn_Id.Name}
                                            </td>

                                            <td>
                                                {item.Evn_Id.Location}
                                            </td>

                                            <td>
                                                {item.Evn_Id.Day}
                                            </td>

                                            <td>
                                                {item.Evn_Id.Time}
                                            </td>

                                            {/* Students GR Numbers */}
                                            <td>
                                                {item.Students?.map((s) => s.Grno).join(", ")}
                                            </td>

                                            {/* Payment Status */}
                                            <td>
                                                <span
                                                    className={`fw-bold ${
                                                        item.Payment === "Success"
                                                            ? "text-success"
                                                            : "text-danger"
                                                    }`}
                                                >
                                                    {item.Payment}
                                                </span>
                                            </td>

                                            {/* Attendance Status */}
                                            <td>
                                                {item.Attend == true ? "Yes" : "No"}
                                            </td>

                                            {/* Rank Display */}
                                            <td>
                                                {item.Rank === 0 ? 0 : item.Rank}
                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    // If no data found
                                    <tr>
                                        <td colSpan="8" className="text-center py-4">
                                            {loading
                                                ? "Loading data..."
                                                : "Registrations Not Found"}
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default Participate;