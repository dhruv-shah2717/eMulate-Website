import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

const Registration = () => {

    // ================================
    // Router Hooks
    // ================================
    const { id } = useParams(); // Get event ID from URL
    const navigate = useNavigate();


    // ================================
    // State Management
    // ================================
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [grNumbers, setGrNumbers] = useState(['']);
    const [studentsList, setStudentsList] = useState([
        { name: '', email: '', phone: '', course: '' }
    ]);
    const [errors, setErrors] = useState({});


    // ================================
    // Fetch Events Data
    // ================================
    useEffect(() => {

        const fetchEvents = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/event`);
                const data = await response.json();
                setEvents(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchEvents();

    }, []);


    // ================================
    // Auto Select Event From URL ID
    // ================================
    useEffect(() => {

        if (id && events.length > 0) {

            const event = events.find(ev => ev._id === id);

            if (event) {

                setSelectedEventId(id);

                // Determine group size
                const size =
                    event.Group === "Solo"
                        ? 1
                        : event.Group === "Duo"
                        ? 2
                        : 4;

                // Create empty fields based on group size
                setGrNumbers(new Array(size).fill(''));
                setStudentsList(
                    new Array(size).fill({
                        name: '',
                        email: '',
                        phone: '',
                        course: ''
                    })
                );

                setErrors({});
            }
        }

    }, [id, events]);


    // ================================
    // Handle Event Selection
    // ================================
    const handleEventSelection = (e) => {

        const eventId = e.target.value;
        setSelectedEventId(eventId);

        const event = events.find(ev => ev._id === eventId);

        if (event) {

            const size =
                event.Group === "Solo"
                    ? 1
                    : event.Group === "Duo"
                    ? 2
                    : 4;

            setGrNumbers(new Array(size).fill(''));
            setStudentsList(
                new Array(size).fill({
                    name: '',
                    email: '',
                    phone: '',
                    course: ''
                })
            );

            setErrors({});
        }
    };


    // ================================
    // Handle GR Input Change
    // ================================
    const handleGrChange = (index, value) => {

        const updatedGrs = [...grNumbers];
        updatedGrs[index] = value;
        setGrNumbers(updatedGrs);
    };


    // ================================
    // Fetch Student By GR Number
    // ================================
    const handleFetch = async (index) => {

        const gr = grNumbers[index];

        // Validate empty GR
        if (!gr) {
            setErrors(prev => ({ ...prev, [index]: "GR Required" }));
            return;
        }

        // Check duplicate GR entries
        const isDuplicate = grNumbers.some(
            (val, i) => val === gr && i !== index
        );

        if (isDuplicate) {
            setErrors(prev => ({
                ...prev,
                [index]: "This student is already added"
            }));

            const updatedStudents = [...studentsList];
            updatedStudents[index] = {
                name: '',
                email: '',
                phone: '',
                course: ''
            };

            setStudentsList(updatedStudents);
            return;
        }

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/student/${gr}`
            );

            const data = await response.json();

            if (response.ok) {

                const updatedStudents = [...studentsList];

                // SUCCESS TOAST (unchanged)
                toast.success("Student details fetch succesfully!");

                updatedStudents[index] = {
                    name: data.Name,
                    email: data.Email,
                    phone: data.Phone,
                    course: data.Course
                };

                setStudentsList(updatedStudents);
                setErrors(prev => ({ ...prev, [index]: null }));

            } else {

                setErrors(prev => ({ ...prev, [index]: "Not Found" }));

                const updatedStudents = [...studentsList];
                updatedStudents[index] = {
                    name: '',
                    email: '',
                    phone: '',
                    course: ''
                };

                setStudentsList(updatedStudents);
            }

        } catch (err) {

            console.error(err);
            setErrors(prev => ({ ...prev, [index]: "Server Error" }));
        }
    };


    // ================================
    // Handle Registration Submission
    // ================================
    const handleRegister = async () => {

        const userChoice = window.confirm(
            "Payment Required: Click 'OK' for Success or 'Cancel' to simulate Failure."
        );

        const paymentStatus = userChoice ? 'Success' : 'Failed';

        const registrationData = {
            eventId: selectedEventId,
            grNumbers: grNumbers,
            paymentStatus: paymentStatus
        };

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/registration/add`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registrationData),
                }
            );

            const result = await response.json();

            if (response.ok) {

                if (paymentStatus === 'Success') {

                    // SUCCESS TOAST
                    toast.success(result.message);

                    setTimeout(() => {
                        navigate('/participate');
                    }, 1500);
                }

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
        <section className="Registration-Section Dhruv">
            <div className="d-flex justify-content-center">
                <div className="glass-login-card registration-wide-card">

                    {/* Header */}
                    <div className="login-header text-center">
                        <i className="bi bi-pencil-square"></i>
                        <h2>Event Registration</h2>
                    </div>

                    <div className="row g-4">

                        {/* LEFT SIDE */}
                        <div className="col-lg-5">

                            <h5
                                className="form-label mb-4 text-uppercase"
                                style={{ color: 'var(--accent)' }}
                            >
                                Search Student
                            </h5>

                            <div className="form-group mb-4 text-start">
                                <label className="form-label">
                                    Select Event
                                </label>

                                <select
                                    className="form-control form-select"
                                    value={selectedEventId}
                                    onChange={handleEventSelection}
                                >
                                    <option value="">
                                        -- Choose Event --
                                    </option>

                                    {events
                                        .filter(event => event.Seats > 0)
                                        .map((event) => (
                                            <option
                                                key={event._id}
                                                value={event._id}
                                            >
                                                {event.Name} ({event.Group})
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* GR Input Section */}
                            <div
                                style={{
                                    maxHeight: '250px',
                                    overflowY: 'auto'
                                }}
                            >
                                {grNumbers.map((gr, index) => (
                                    <div
                                        key={index}
                                        className="form-group mb-3 text-start"
                                    >
                                        <label className="form-label">
                                            Member {index + 1} GR Number
                                        </label>

                                        <div className="d-flex gap-2">

                                            <input
                                                type="text"
                                                className={`form-control ${
                                                    errors[index]
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                placeholder="Ex: 921001"
                                                value={gr}
                                                onChange={(e) =>
                                                    handleGrChange(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <button
                                                className="login-btn outline-btn m-0 py-1 px-3"
                                                onClick={() =>
                                                    handleFetch(index)
                                                }
                                                style={{ width: 'auto' }}
                                            >
                                                Fetch
                                            </button>

                                        </div>

                                        {errors[index] && (
                                            <div className="text-danger small">
                                                {errors[index]}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* RIGHT SIDE */}
                        <div className="col-lg-7">

                            <div className="search-divider">

                                <h6
                                    className="form-label mb-4 text-uppercase"
                                    style={{ color: 'var(--accent)' }}
                                >
                                    Student Details
                                </h6>

                                <div
                                    style={{
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        paddingRight: '10px'
                                    }}
                                >
                                    {studentsList.map((student, index) => (
                                        <div
                                            key={index}
                                            className="row g-3 text-start mb-4 pb-3"
                                            style={{
                                                borderBottom:
                                                    '1px solid rgba(255,255,255,0.1)'
                                            }}
                                        >

                                            <p className="text-muted small mb-1">
                                                Participant {index + 1}
                                            </p>

                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={student.name}
                                                    readOnly
                                                    placeholder="Fetch to load..."
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    Email
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={student.email}
                                                    readOnly
                                                    placeholder="Fetch to load..."
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={student.phone}
                                                    readOnly
                                                    placeholder="Fetch to load..."
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    Course
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={student.course}
                                                    readOnly
                                                    placeholder="Fetch to load..."
                                                />
                                            </div>

                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="login-btn w-100 mt-3"
                                    disabled={
                                        !selectedEventId ||
                                        studentsList.some(s => !s.name)
                                    }
                                    onClick={handleRegister}
                                >
                                    Confirm Registration
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Registration;