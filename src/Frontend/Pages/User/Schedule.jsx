import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Schedule = () => {

    // ================================
    // State Management
    // ================================
    const [scheduleData, setScheduleData] = useState([]);


    // Loading state
    const [loading, setLoading] = useState(true);


    // ========================================
    // Fetch Events Data
    // ========================================
    useEffect(() => {

        const fetchEvents = async () => {

            try {

                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/event`
                );

                const data = await response.json();

                // Assuming API returns array of events
                setScheduleData(data);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false); // Stop loading
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

                    {/* Section Heading */}
                    <div className="category-header">
                        <h3>Event Schedule</h3>
                    </div>

                    {/* Responsive Table Wrapper */}
                    <div className="table-responsive">

                        <table className="table custom-glass-table">

                            {/* Table Header */}
                            <thead>
                                <tr>
                                    <th>Event Name</th>
                                    <th>Ev-Cordinator</th>
                                    <th>Contact Number</th>
                                    <th>Location</th>
                                    <th>Day</th>
                                    <th>Time</th>
                                    <th>Event Type</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>

                                {loading ? (

                                    // Loading State
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-4"
                                        >
                                            Loading Events...
                                        </td>
                                    </tr>

                                ) : scheduleData.length > 0 ? (

                                    scheduleData.map((item, index) => (
                                        <tr key={index}>

                                            <td className="fw-bold">
                                                {item.Name}
                                            </td>

                                            <td>
                                                {item.Evn_Cordinator}
                                            </td>

                                            <td>
                                                {item.Evn_Co_Number}
                                            </td>

                                            <td>
                                                {item.Location}
                                            </td>

                                            <td>
                                                {item.Day}
                                            </td>

                                            <td>
                                                {item.Time}
                                            </td>

                                            <td>
                                                <span
                                                    className={`event-badge ${
                                                        item.Cat_Id.Name?.toLowerCase()
                                                    }`}
                                                >
                                                    {item.Cat_Id.Name}
                                                </span>
                                            </td>

                                        </tr>
                                    ))

                                ) : (

                                    // No Data Found
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-4"
                                        >
                                            No Events Found
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

export default Schedule;