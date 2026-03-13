import React from "react";

const Help = () => {

    // ========================================
    // JSX Rendering
    // ========================================
    return (
        <section className="Help-Section Dhruv">

            <div className="help-card d-flex justify-content-center align-items-center">

                <div className="glass-card full-width">

                    <div className="row mt-2">

                        {/* ==============================
                            Left Side: Heading & Description
                        ============================== */}
                        <div className="col-lg-5 d-flex flex-column justify-content-center border-end-desktop get-in">

                            <h2 className="display-6 fw-bold mb-3">
                                Get in Touch
                            </h2>

                            <p className="description">
                                Have questions about the events or registration?
                                Reach out to our team, and we will get back to you shortly.
                            </p>

                        </div>


                        {/* ==============================
                            Right Side: Contact Details
                        ============================== */}
                        <div className="col-lg-7">

                            <div className="contact-list">

                                {/* ==============================
                                    Venue / Address
                                ============================== */}
                                <div className="contact-item">

                                    <div className="icon-box">
                                        <i className="bi bi-geo-alt-fill"></i>
                                    </div>

                                    <div className="contact-text">
                                        <h5>Venue Address</h5>
                                        <p>
                                            Marwadi University, Rajkot-Morbi Highway,
                                            Rajkot, Gujarat 360003
                                        </p>
                                    </div>

                                </div>


                                {/* ==============================
                                    Email Support
                                ============================== */}
                                <div className="contact-item">

                                    <div className="icon-box">
                                        <i className="bi bi-envelope-fill"></i>
                                    </div>

                                    <div className="contact-text">
                                        <h5>Email Support</h5>
                                        <p>MarwadiUniversity@gmail.com</p>
                                    </div>

                                </div>


                                {/* ==============================
                                    Phone Numbers
                                ============================== */}
                                <div className="contact-item">

                                    <div className="icon-box">
                                        <i className="bi bi-telephone-fill"></i>
                                    </div>

                                    <div className="contact-text">
                                        <h5>Call Us</h5>
                                        <p>+91 98765 43210</p>
                                        <p>+91 87654 32109</p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default Help;