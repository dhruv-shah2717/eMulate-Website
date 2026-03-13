import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Participate = () => {
    
    // ========================================
    // State Management
    // ========================================
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [registrations, setRegistrations] = useState([]);


    // ========================================
    // Fetch all events on component mount
    // ========================================
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/event`);
                const data = await response.json();
                if (response.ok) setEvents(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEvents();
    }, []);


    // ========================================
    // Fetch registrations whenever selectedEvent changes
    // ========================================
    useEffect(() => {
        const fetchFilteredRegistrations = async () => {
            if (!selectedEvent) {
                setRegistrations([]);
                return;
            }
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/registration/${selectedEvent}`);
                const data = await response.json();
                if (response.ok) {
                    const mappedData = data.map(reg => ({
                        ...reg,
                        Attend: reg.Attend === true || reg.Attend === "true",
                        Rank: reg.Rank ? reg.Rank.toString() : "0"
                    }));
                    setRegistrations(mappedData);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchFilteredRegistrations();
    }, [selectedEvent]);


    // ========================================
    // Toggle attendance for a registration
    // ========================================
    const handleToggleAttendance = async (id, currentVal) => {
        const newVal = !currentVal;

        // Optimistic UI update
        setRegistrations(prev =>
            prev.map(reg => reg._id === id ? { ...reg, Attend: newVal } : reg)
        );

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/registration/attendance/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Attend: newVal })
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
            // Revert UI if failed
            setRegistrations(prev =>
                prev.map(reg => reg._id === id ? { ...reg, Attend: currentVal } : reg)
            );
        }
    };


    // ========================================
    // Update rank for a registration
    // ========================================
    const handleRankChange = async (id, newRank) => {
        setRegistrations(prev =>
            prev.map(reg => reg._id === id ? { ...reg, Rank: newRank } : reg)
        );

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/registration/rank/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Rank: newRank })
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    
    // ========================================
    // JSX Rendering
    // ========================================
    return (
        <div className="dashboard-content">
            <div className="table-card glass-card">
                {/* Card Header */}
                <div className="card-title card-header">
                    <h3>Event Attendance & Rank</h3>
                </div>

                {/* Event Selection */}
                <div className="container mt-4 mb-4">
                    <div className="col-md-6">
                        <label className="form-label font-weight-bold">Select Event</label>
                        <select
                            className="form-select"
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                        >
                            <option value="">-- Choose an Event --</option>
                            {events.map(ev => (
                                <option key={ev._id} value={ev._id}>{ev.Name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Registrations Table */}
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Student Name</th>
                                <th>Status</th>
                                <th>Rank</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.length > 0 ? (
                                registrations
                                    .filter(reg => reg.Payment === 'Success')
                                    .map((reg, index) => (
                                        <tr key={reg._id}>
                                            <td>{index + 1}</td>
                                            <td>{reg.Students?.map(s => s.Name).join(', ')}</td>

                                            {/* Attendance Switch */}
                                            <td>
                                                <div className="form-check form-switch d-flex align-items-center">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }}
                                                        checked={reg.Attend}
                                                        onChange={() => handleToggleAttendance(reg._id, reg.Attend)}
                                                    />
                                                    <span className={`ms-2 badge ${reg.Attend ? 'bg-success' : 'bg-secondary'}`}>
                                                        {reg.Attend ? "Present" : "Absent"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Rank Selector */}
                                            <td>
                                                <select
                                                    className="form-select form-select-sm"
                                                    disabled={!reg.Attend}
                                                    value={reg.Rank}
                                                    onChange={(e) => handleRankChange(reg._id, e.target.value)}
                                                >
                                                    <option value="0">None</option>
                                                    <option value="1">Winner</option>
                                                    <option value="2">1st Runner Up</option>
                                                    <option value="3">2nd Runner Up</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">Select an event to load data.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Participate;