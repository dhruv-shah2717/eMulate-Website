import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Event = () => {
    
    // ========================================
    // State Management
    // ========================================
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formErrors, setFormErrors] = useState({});

    const [formData, setFormData] = useState({
        EventName: '',
        EventPrice: '',
        GroupType: '',
        EventSeats: '',
        EventLocation: '',
        EventDay: '',
        EventTime: '',
        EventCoordinator: '',
        EventCoordinatorNumber: '',
        StudentCoordinator: '',
        StudentCoordinatorNumber: '',
        Category: '',
        EventDescription: ''
    });

    const [editId, setEditId] = useState(null);

    const [updateData, setUpdateData] = useState({
        EventName: '',
        EventPrice: '',
        GroupType: '',
        EventSeats: '',
        EventLocation: '',
        EventDay: '',
        EventTime: '',
        EventCoordinator: '',
        EventCoordinatorNumber: '',
        StudentCoordinator: '',
        StudentCoordinatorNumber: '',
        Category: '',
        EventDescription: ''
    });


    // ========================================
    // Fetch Categories
    // ========================================
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/category`);
            const data = await response.json();
            if (response.ok) setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };


    // ========================================
    // Fetch Events
    // ========================================
    const fetchEvents = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/event`);
            const data = await response.json();
            if (response.ok) setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };


    // ========================================
    // Load data on component mount
    // ========================================
    useEffect(() => {
        fetchCategories();
        fetchEvents();
    }, []);


    // ========================================
    // Delete Event
    // ========================================
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/event/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                fetchEvents();
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    
    // ========================================
    // Prefill Update Modal
    // ========================================
    const handleEditClick = (ev) => {
        setEditId(ev._id);
        setUpdateData({
            EventName: ev.Name,
            EventPrice: ev.Price,
            GroupType: ev.Group,
            EventSeats: ev.Seats,
            EventLocation: ev.Location,
            EventDay: ev.Day,
            EventTime: ev.Time,
            EventCoordinator: ev.Evn_Cordinator,
            EventCoordinatorNumber: ev.Evn_Co_Number,
            StudentCoordinator: ev.Stu_Cordinator,
            StudentCoordinatorNumber: ev.Stu_Co_Number,
            Category: ev.Cat_Id?._id || ev.Cat_Id,
            EventDescription: ev.Description
        });
    };


    // ========================================
    // Update Form Handlers
    // ========================================
    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const dataToSubmit = {
            Name: updateData.EventName,
            Price: Number(updateData.EventPrice),
            Group: updateData.GroupType,
            Seats: Number(updateData.EventSeats),
            Location: updateData.EventLocation,
            Time: updateData.EventTime,
            Day: updateData.EventDay,
            Evn_Cordinator: updateData.EventCoordinator,
            Evn_Co_Number: updateData.EventCoordinatorNumber,
            Stu_Cordinator: updateData.StudentCoordinator,
            Stu_Co_Number: updateData.StudentCoordinatorNumber,
            Cat_Id: updateData.Category,
            Description: updateData.EventDescription
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/event/update/${editId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                fetchEvents();
                document.getElementById('closeUpdateModal').click();
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
        }
    };


    // ========================================
    // Field Validation
    // ========================================
    const validateField = (name, value) => {
        let error = "";
        const nameRegex = /^[a-zA-Z\s]+$/;

        switch (name) {
            case 'EventName':
                if (value.length < 3) error = "Min 3 characters required.";
                else if (!nameRegex.test(value)) error = "Only letters allowed.";
                break;
            case 'EventPrice':
            case 'EventSeats':
                if (!value || isNaN(value)) error = "Must be a number.";
                break;
            case 'EventLocation':
            case 'EventDay':
            case 'EventTime':
            case 'EventCoordinator':
            case 'StudentCoordinator':
                if (value.length < 3) error = "Min 3 characters required.";
                break;
            case 'EventCoordinatorNumber':
            case 'StudentCoordinatorNumber':
                if (value.length < 10) error = "Min 10 digits required.";
                break;
            case 'EventDescription':
                if (value.length < 10) error = "Min 10 characters required.";
                break;
            case 'GroupType':
            case 'Category':
                if (!value) error = "Please select an option.";
                break;
            default:
                break;
        }

        setFormErrors(prev => ({ ...prev, [name]: error }));
    };


    // ========================================
    // Add Event Handlers
    // ========================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let tempErrors = {};
        Object.keys(formData).forEach(key => {
            validateField(key, formData[key]);
            if (!formData[key]) tempErrors[key] = "Field is required";
        });

        if (Object.values(formErrors).some(err => err !== "") || Object.keys(tempErrors).length > 0) return;

        const dataToSubmit = {
            Name: formData.EventName,
            Price: Number(formData.EventPrice),
            Group: formData.GroupType,
            Seats: Number(formData.EventSeats),
            Location: formData.EventLocation,
            Time: formData.EventTime,
            Day: formData.EventDay,
            Evn_Cordinator: formData.EventCoordinator,
            Evn_Co_Number: formData.EventCoordinatorNumber,
            Stu_Cordinator: formData.StudentCoordinator,
            Stu_Co_Number: formData.StudentCoordinatorNumber,
            Cat_Id: formData.Category,
            Description: formData.EventDescription
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/event/add`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                setFormData({
                    EventName: '',
                    EventPrice: '',
                    GroupType: '',
                    EventSeats: '',
                    EventLocation: '',
                    EventDay: '',
                    EventTime: '',
                    EventCoordinator: '',
                    EventCoordinatorNumber: '',
                    StudentCoordinator: '',
                    StudentCoordinatorNumber: '',
                    Category: '',
                    EventDescription: ''
                });
                setFormErrors({});
                fetchEvents();
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
            {/* Add / Update Event Card */}
            <div className="table-card glass-card">
                <div className="card-title card-header">
                    <h3>Events Add, Update, Delete</h3>
                </div>

                {/* Add Event Form */}
                <div className="container mt-4 mb-4">
                    <form className="row g-3" onSubmit={handleSubmit}>
                        {/* Event Name */}
                        <div className="col-md-6">
                            <label className="form-label">Enter Event Name</label>
                            <input
                                type="text"
                                name="EventName"
                                className="form-control"
                                value={formData.EventName}
                                onChange={handleChange}
                                placeholder="Ex: Code Storm"
                            />
                            {formErrors.EventName && <div className="text-danger small mt-1">{formErrors.EventName}</div>}
                        </div>

                        {/* Event Price */}
                        <div className="col-md-6">
                            <label className="form-label">Enter Event Price</label>
                            <input
                                type="number"
                                name="EventPrice"
                                className="form-control"
                                value={formData.EventPrice}
                                onChange={handleChange}
                                placeholder="Ex: 50"
                            />
                            {formErrors.EventPrice && <div className="text-danger small mt-1">{formErrors.EventPrice}</div>}
                        </div>

                        {/* Group Type */}
                        <div className="col-md-6">
                            <label className="form-label">Select Group Type</label>
                            <select
                                name="GroupType"
                                className="form-select"
                                value={formData.GroupType}
                                onChange={handleChange}
                            >
                                <option value="">Select Size</option>
                                <option value="Solo">Solo</option>
                                <option value="Duo">Duo</option>
                                <option value="Squad">Squad</option>
                            </select>
                            {formErrors.GroupType && <div className="text-danger small mt-1">{formErrors.GroupType}</div>}
                        </div>

                        {/* Event Seats */}
                        <div className="col-md-6">
                            <label className="form-label">Enter Event Seats</label>
                            <input
                                type="number"
                                name="EventSeats"
                                className="form-control"
                                value={formData.EventSeats}
                                onChange={handleChange}
                                placeholder="Ex: 50"
                            />
                            {formErrors.EventSeats && <div className="text-danger small mt-1">{formErrors.EventSeats}</div>}
                        </div>

                        {/* Event Location */}
                        <div className="col-md-6">
                            <label className="form-label">Enter Event Location</label>
                            <input
                                type="text"
                                name="EventLocation"
                                className="form-control"
                                value={formData.EventLocation}
                                onChange={handleChange}
                                placeholder="Ex: MA204, MB404"
                            />
                            {formErrors.EventLocation && <div className="text-danger small mt-1">{formErrors.EventLocation}</div>}
                        </div>

                        {/* Event Day */}
                        <div className="col-md-3">
                            <label className="form-label">Enter Event Day</label>
                            <input
                                type="text"
                                name="EventDay"
                                className="form-control"
                                value={formData.EventDay}
                                onChange={handleChange}
                                placeholder="Ex: Monday, Tuesday"
                            />
                            {formErrors.EventDay && <div className="text-danger small mt-1">{formErrors.EventDay}</div>}
                        </div>

                        {/* Event Time */}
                        <div className="col-md-3">
                            <label className="form-label">Enter Event Time</label>
                            <input
                                type="text"
                                name="EventTime"
                                className="form-control"
                                value={formData.EventTime}
                                onChange={handleChange}
                                placeholder='Ex: 2:00am to 3:00pm'
                            />
                            {formErrors.EventTime && <div className="text-danger small mt-1">{formErrors.EventTime}</div>}
                        </div>

                        {/* Event Coordinator */}
                        <div className="col-md-6">
                            <label className="form-label">Enter Event Coordinator</label>
                            <input
                                type="text"
                                name="EventCoordinator"
                                className="form-control"
                                value={formData.EventCoordinator}
                                onChange={handleChange}
                                placeholder="Ex: Mahek, Krisha"
                            />
                            {formErrors.EventCoordinator && <div className="text-danger small mt-1">{formErrors.EventCoordinator}</div>}
                        </div>

                        {/* Coordinator Number */}
                        <div className="col-md-6">
                            <label className="form-label">Enter Coordinator Number</label>
                            <input
                                type="tel"
                                name="EventCoordinatorNumber"
                                className="form-control"
                                value={formData.EventCoordinatorNumber}
                                onChange={handleChange}
                                placeholder="Ex: 1234567890,0987654321"
                            />
                            {formErrors.EventCoordinatorNumber && <div className="text-danger small mt-1">{formErrors.EventCoordinatorNumber}</div>}
                        </div>

                        {/* Student Coordinator */}
                        <div className="col-md-6">
                            <label className="form-label">Enter Student Coordinator</label>
                            <input
                                type="text"
                                name="StudentCoordinator"
                                className="form-control"
                                value={formData.StudentCoordinator}
                                onChange={handleChange}
                                placeholder="Ex: Dhruv, Raj"
                            />
                            {formErrors.StudentCoordinator && <div className="text-danger small mt-1">{formErrors.StudentCoordinator}</div>}
                        </div>

                        {/* Student Coordinator Number */}
                        <div className="col-md-6">
                            <label className="form-label">Enter Student Number</label>
                            <input
                                type="tel"
                                name="StudentCoordinatorNumber"
                                className="form-control"
                                value={formData.StudentCoordinatorNumber}
                                onChange={handleChange}
                                placeholder="Ex: 1234567890,0987654321"
                            />
                            {formErrors.StudentCoordinatorNumber && <div className="text-danger small mt-1">{formErrors.StudentCoordinatorNumber}</div>}
                        </div>

                        {/* Category */}
                        <div className="col-md-6">
                            <label className="form-label">Select Category Name</label>
                            <select
                                name="Category"
                                className="form-select"
                                value={formData.Category}
                                onChange={handleChange}
                            >
                                <option value="">Select Name</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.Name}</option>
                                ))}
                            </select>
                            {formErrors.Category && <div className="text-danger small mt-1">{formErrors.Category}</div>}
                        </div>

                        {/* Event Description */}
                        <div className="col-12">
                            <label className="form-label">Enter Event Description</label>
                            <textarea
                                name="EventDescription"
                                className="form-control"
                                rows="3"
                                value={formData.EventDescription}
                                onChange={handleChange}
                                placeholder="Ex: Lorem ipsum dolor sit amet consectetur adipisicing elit..."
                            ></textarea>
                            {formErrors.EventDescription && <div className="text-danger small mt-1">{formErrors.EventDescription}</div>}
                        </div>

                        {/* Submit Button */}
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary btn-sm" disabled={formData.EventName.length < 3}>
                                Add Event
                            </button>
                        </div>
                    </form>
                </div>

                {/* Events Table */}
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Event Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((ev, index) => (
                                <tr key={ev._id}>
                                    <td>{index + 1}</td>
                                    <td>{ev.Name}</td>
                                    <td>{ev.Cat_Id?.Name}</td>
                                    <td>{ev.Price}</td>
                                    <td>
                                        <button
                                            className="btn btn-success btn-sm"
                                            data-bs-toggle="modal"
                                            data-bs-target="#updateModal"
                                            onClick={() => handleEditClick(ev)}
                                        >
                                            Update
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(ev._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Modal */}
            <div className="modal fade" id="updateModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content text-dark">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Event</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" id="closeUpdateModal"></button>
                        </div>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="modal-body row g-3">
                                {/* Repeat all fields same as Add Form with updateData */}
                                {/* Event Name */}
                                <div className="col-md-6">
                                    <label className="form-label">Enter Event Name</label>
                                    <input type="text" name="EventName" className="form-control" value={updateData.EventName} onChange={handleUpdateChange} />
                                </div>

                                {/* Event Price */}
                                <div className="col-md-6">
                                    <label className="form-label">Enter Event Price</label>
                                    <input type="number" name="EventPrice" className="form-control" value={updateData.EventPrice} onChange={handleUpdateChange} />
                                </div>

                                {/* Group Type */}
                                <div className="col-md-6">
                                    <label className="form-label">Select Group Type</label>
                                    <select name="GroupType" className="form-select" value={updateData.GroupType} onChange={handleUpdateChange}>
                                        <option value="">Select Size</option>
                                        <option value="Solo">Solo</option>
                                        <option value="Duo">Duo</option>
                                        <option value="Squad">Squad</option>
                                    </select>
                                </div>

                                {/* Event Seats */}
                                <div className="col-md-6">
                                    <label className="form-label">Enter Event Seats</label>
                                    <input type="number" name="EventSeats" className="form-control" value={updateData.EventSeats} onChange={handleUpdateChange} />
                                </div>

                                {/* Event Location */}
                                <div className="col-md-6">
                                    <label className="form-label">Enter Event Location</label>
                                    <input type="text" name="EventLocation" className="form-control" value={updateData.EventLocation} onChange={handleUpdateChange} />
                                </div>

                                {/* Event Day */}
                                <div className="col-md-3">
                                    <label className="form-label">Enter Event Day</label>
                                    <input type="text" name="EventDay" className="form-control" value={updateData.EventDay} onChange={handleUpdateChange} />
                                </div>

                                {/* Event Time */}
                                <div className="col-md-3">
                                    <label className="form-label">Enter Event Time</label>
                                    <input type="text" name="EventTime" className="form-control" value={updateData.EventTime} onChange={handleUpdateChange} />
                                </div>

                                {/* Event Coordinator */}
                                <div className="col-md-6">
                                    <label className="form-label">Enter Event Coordinator</label>
                                    <input type="text" name="EventCoordinator" className="form-control" value={updateData.EventCoordinator} onChange={handleUpdateChange} />
                                </div>

                                {/* Coordinator Number */}
                                <div className="col-md-6">
                                    <label className="form-label">Enter Coordinator Number</label>
                                    <input type="tel" name="EventCoordinatorNumber" className="form-control" value={updateData.EventCoordinatorNumber} onChange={handleUpdateChange} />
                                </div>

                                {/* Student Coordinator */}
                                <div className="col-md-6">
                                    <label className="form-label">Enter Student Coordinator</label>
                                    <input type="text" name="StudentCoordinator" className="form-control" value={updateData.StudentCoordinator} onChange={handleUpdateChange} />
                                </div>

                                {/* Student Coordinator Number */}
                                <div className="col-md-6">
                                    <label className="form-label">Enter Student Number</label>
                                    <input type="tel" name="StudentCoordinatorNumber" className="form-control" value={updateData.StudentCoordinatorNumber} onChange={handleUpdateChange} />
                                </div>

                                {/* Category */}
                                <div className="col-md-6">
                                    <label className="form-label">Select Category Name</label>
                                    <select name="Category" className="form-select" value={updateData.Category} onChange={handleUpdateChange}>
                                        <option value="">Select Name</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.Name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Event Description */}
                                <div className="col-12">
                                    <label className="form-label">Enter Event Description</label>
                                    <textarea name="EventDescription" className="form-control" rows="3" value={updateData.EventDescription} onChange={handleUpdateChange}></textarea>
                                </div>
                            </div>

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

export default Event;
