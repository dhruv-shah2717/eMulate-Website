import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    
    // ========================================
    // State Management
    // ========================================
    const [stats, setStats] = useState({
        studentCount: 0,
        participantCount: 0,
        eventCount: 0,
        totalRevenue: 0
    });
    const [students, setStudents] = useState([]);
    const [errors, setErrors] = useState({});

    // --- ADD STUDENT FORM STATE ---
    const [newStudent, setNewStudent] = useState({
        Grno: '',
        Name: '',
        Email: '',
        Phone: '',
        Password: '',
        Course: 'Btech',
        Role: 'Normal'
    });

    // --- MODAL / UPDATE STATE ---
    const [selectedStudent, setSelectedStudent] = useState({
        _id: '',
        Grno: '',
        Name: '',
        Email: '',
        Phone: '',
        Password: '',
        Course: 'Btech',
        Role: 'Normal'
    });

    const baseUrl = import.meta.env.VITE_API_BASE_URL;


    // ========================================
    // Validation Logic
    // ========================================
    const validateField = (name, value) => {
        let error = "";
        if (name === 'Grno' && !/^\d{6}$/.test(value)) error = "GR No must be 6 digits.";
        if (name === 'Name' && value.length < 3) error = "Name must be at least 3 characters.";
        if (name === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format.";
        if (name === 'Phone' && !/^\d{10}$/.test(value)) error = "Phone must be 10 digits.";
        if (name === 'Password' && value.length < 3) error = "Password must be at least 3 characters.";

        setErrors(prev => ({ ...prev, [name]: error }));
        return error === "";
    };


    // ========================================
    // Fetch Dashboard Data
    // ========================================
    const fetchDashboardData = async () => {
        try {
            const [studentRes, eventRes, regRes] = await Promise.all([
                fetch(`${baseUrl}/api/student`),
                fetch(`${baseUrl}/api/event`),
                fetch(`${baseUrl}/api/registration`)
            ]);

            const studentData = await studentRes.json();
            const eventData = await eventRes.json();
            const regData = await regRes.json();

            if (studentRes.ok) {
                const successfulRegs = regData.filter(reg => reg.Payment === 'Success');
                const revenue = successfulRegs.reduce((acc, curr) => acc + Number(curr.Evn_Id?.Price || 0), 0);

                setStats({
                    studentCount: studentData.length,
                    participantCount: successfulRegs.length,
                    eventCount: eventData.length,
                    totalRevenue: revenue
                });

                setStudents(studentData);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchDashboardData(); }, []);


    // ========================================
    // Add Student Logic
    // ========================================
    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setNewStudent(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasErrors = Object.values(errors).some(err => err !== "");
        if (hasErrors) return;

        try {
            const res = await fetch(`${baseUrl}/api/student/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newStudent)
            });

            const result = await res.json();
            if (res.ok) {
                toast.success(result.message);
                setNewStudent({ Grno: '', Name: '', Email: '', Phone: '', Password: '', Course: 'Btech', Role: 'Normal' });
                fetchDashboardData();
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
        }
    };


    // ========================================
    // Update Modal Logic
    // ========================================
    const handleEditClick = (student) => {
        setSelectedStudent({ ...student });
        setErrors({});
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setSelectedStudent(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleUpdate = async () => {
        const hasErrors = Object.values(errors).some(err => err !== "");
        if (hasErrors) return;

        try {
            const res = await fetch(`${baseUrl}/api/student/update/${selectedStudent._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(selectedStudent)
            });

            const result = await res.json();
            if (res.ok) {
                toast.success(result.message);
                document.getElementById('closeModal').click();
                fetchDashboardData();
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error("Update failed");
        }
    };


    // ========================================
    // Delete Student Logic
    // ========================================
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${baseUrl}/api/student/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const result = await res.json();
            if (res.ok) {
                toast.success(result.message);
                fetchDashboardData();
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
            <h1 className="page-title">Dashboard</h1>

            {/* --- STAT CARDS --- */}
            <div className="cards">
                <div className="card">
                    <i className="bi bi-people card-icon"></i>
                    <div>
                        <h3>Students</h3>
                        <p className="text-center h5">{stats.studentCount}</p>
                    </div>
                </div>
                <div className="card">
                    <i className="bi bi-currency-rupee card-icon"></i>
                    <div>
                        <h3>Revenue</h3>
                        <p className="text-center h5">₹ {stats.totalRevenue}</p>
                    </div>
                </div>
                <div className="card">
                    <i className="bi bi-people card-icon"></i>
                    <div>
                        <h3>Participants</h3>
                        <p className="text-center h5">{stats.participantCount}</p>
                    </div>
                </div>
                <div className="card">
                    <i className="bi bi-calendar4-event card-icon"></i>
                    <div>
                        <h3>Events</h3>
                        <p className="text-center h5">{stats.eventCount}</p>
                    </div>
                </div>
            </div>

            {/* --- ADD STUDENT FORM --- */}
            <div className="table-card glass-card">
                <div className="card-title card-header">
                    <h3>Students Add, Update, Delete</h3>
                </div>
                <div className="container mt-4 mb-4">
                    <form className="row g-3" onSubmit={handleSubmit}>
                        {/* --- Form Fields --- */}
                        {['Grno', 'Name', 'Email', 'Phone', 'Password'].map(field => (
                            <div className="col-md-6" key={field}>
                                <label className="form-label">{`Enter Student ${field}`}</label>
                                <input
                                    name={field}
                                    type="text"
                                    className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                                    value={newStudent[field]}
                                    onChange={handleAddChange}
                                    placeholder={field === 'Grno' ? 'Ex: 138916' : `Ex: ${field}`}
                                />
                                {errors[field] && <div className="text-danger mt-1 small">{errors[field]}</div>}
                            </div>
                        ))}

                        <div className="col-md-3">
                            <label className="form-label">Select Course</label>
                            <select name="Course" className="form-select" value={newStudent.Course} onChange={handleAddChange}>
                                <option value="Btech">Btech</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Pharma">Pharmacy</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Select Role</label>
                            <select name="Role" className="form-select" value={newStudent.Role} onChange={handleAddChange}>
                                <option value="Normal">Normal</option>
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        <div className="col-12">
                            <button type="submit" className="btn btn-primary btn-sm" disabled={newStudent.Grno.length < 6}>
                                Add Student
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- STUDENTS TABLE --- */}
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Gr No</th>
                                <th>Email</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map((student, index) => (
                                    <tr key={student._id}>
                                        <td>{index + 1}</td>
                                        <td>{student.Name}</td>
                                        <td>{student.Grno}</td>
                                        <td>{student.Email}</td>
                                        <td>
                                            <button
                                                className="btn btn-success btn-sm"
                                                data-bs-toggle="modal"
                                                data-bs-target="#updateModal"
                                                onClick={() => handleEditClick(student)}
                                            >
                                                Update
                                            </button>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(student._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No Students Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- UPDATE MODAL --- */}
            <div className="modal fade" id="updateModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Student Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" id="closeModal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row g-3">
                                {['Grno', 'Name', 'Email', 'Phone'].map(field => (
                                    <div className="col-md-6" key={field}>
                                        <label className="form-label">{`Enter Student ${field}`}</label>
                                        <input
                                            name={field}
                                            type="text"
                                            className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                                            value={selectedStudent[field]}
                                            onChange={handleUpdateChange}
                                        />
                                        {errors[field] && <div className="text-danger small">{errors[field]}</div>}
                                    </div>
                                ))}

                                <div className="col-md-6">
                                    <label className="form-label">Select Course</label>
                                    <select name="Course" className="form-select" value={selectedStudent.Course} onChange={handleUpdateChange}>
                                        <option value="Btech">Btech</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Pharma">Pharmacy</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Select Role</label>
                                    <select name="Role" className="form-select" value={selectedStudent.Role} onChange={handleUpdateChange}>
                                        <option value="Normal">Normal</option>
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary btn-sm" onClick={handleUpdate}>Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;