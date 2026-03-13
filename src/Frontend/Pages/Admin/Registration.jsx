import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AdminRegistration = () => {
    
    // ========================================
    // State Management
    // ========================================
    const [registrations, setRegistrations] = useState([]);
    const [events, setEvents] = useState([]);

    // State for Update Modal
    const [editId, setEditId] = useState(null);
    const [updateData, setUpdateData] = useState({
        eventId: '',
        grNumbers: '', // Comma-separated string of GR numbers
        paymentStatus: ''
    });


    // ========================================
    // Fetch all registrations
    // ========================================
    const fetchRegistrations = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/registration`);
            const data = await response.json();
            if (response.ok) setRegistrations(data);
        } catch (err) {
            console.error(err);
        }
    };


    // ========================================
    // Fetch events for modal dropdown
    // ========================================
    const fetchEvents = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/event`);
            const data = await response.json();
            if (response.ok) setEvents(data);
        } catch (err) {
            console.error(err);
        }
    };


    // ========================================
    // Initial data fetch
    // ========================================
    useEffect(() => {
        fetchRegistrations();
        fetchEvents();
    }, []);


    // ========================================
    // Delete registration
    // ========================================
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/registration/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                fetchRegistrations();
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
        }
    };


    // ========================================
    // Prefill modal with existing data
    // ========================================
    const handleEditClick = (reg) => {
        setEditId(reg._id);
        setUpdateData({
            eventId: reg.Evn_Id?._id || reg.Evn_Id,
            grNumbers: reg.Students?.map(s => s.Grno).join(', ') || '',
            paymentStatus: reg.Payment
        });
    };


    // ========================================
    // Submit update
    // ========================================
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        // Convert comma-separated string to array
        const grArray = updateData.grNumbers.split(',').map(num => num.trim());

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/registration/update/${editId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: updateData.eventId,
                    grNumbers: grArray,
                    paymentStatus: updateData.paymentStatus
                }),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                fetchRegistrations();
                document.getElementById('closeModal').click(); // Close modal
            } else {
                toast.error(result.message);
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
                    <h3>Registrations Update & Delete</h3>
                </div>

                {/* Registrations Table */}
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Event Name</th>
                                <th>Student GR No</th>
                                <th>Payment Status</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((reg, index) => (
                                <tr key={reg._id}>
                                    <td>{index + 1}</td>
                                    <td>{reg.Evn_Id?.Name}</td>
                                    <td>{reg.Students?.map(s => s.Grno).join(', ')}</td>
                                    <td>
                                        <span className={`fw-bold ${reg.Payment === 'Success' ? 'text-success' : 'text-danger'}`}>
                                            {reg.Payment}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-success btn-sm"
                                            data-bs-toggle="modal"
                                            data-bs-target="#regUpdateModal"
                                            onClick={() => handleEditClick(reg)}
                                        >
                                            Update
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(reg._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bootstrap Modal for Updating Registration */}
            <div className="modal fade" id="regUpdateModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content text-dark">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Registration</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" id="closeModal"></button>
                        </div>

                        <form onSubmit={handleUpdateSubmit}>
                            <div className="modal-body row g-3">
                                {/* Event Dropdown */}
                                <div className="col-12">
                                    <label className="form-label">Select Event Name</label>
                                    <select
                                        className="form-select"
                                        value={updateData.eventId}
                                        onChange={(e) => setUpdateData({ ...updateData, eventId: e.target.value })}
                                    >
                                        {events.map(ev => (
                                            <option key={ev._id} value={ev._id}>{ev.Name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* GR Numbers Input */}
                                <div className="col-12">
                                    <label className="form-label">
                                        Enter Student GR Numbers (comma separated Ex: 138916,235734)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={updateData.grNumbers}
                                        onChange={(e) => setUpdateData({ ...updateData, grNumbers: e.target.value })}
                                    />
                                </div>

                                {/* Payment Status Dropdown */}
                                <div className="col-12">
                                    <label className="form-label">Select Payment Status</label>
                                    <select
                                        className="form-select"
                                        value={updateData.paymentStatus}
                                        onChange={(e) => setUpdateData({ ...updateData, paymentStatus: e.target.value })}
                                    >
                                        <option value="Success">Success</option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegistration;