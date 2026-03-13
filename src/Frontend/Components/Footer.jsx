import logo_footer from "../Assets/Images/Logo_Footer.png";
import logo_mufest from "../Assets/Images/Logo_Mufest.png";

const Footer = () => {

    return (
        <footer className="Footer-Section">

            <div className="footer-container">

                {/* ==============================
                    Branding Area
                ============================== */}
                <div className="branding-area">

                    {/* ==============================
                        University Branding Logo
                    ============================== */}
                    <div className="logo-box">
                        <img 
                            src={logo_footer} 
                            alt="Marwadi University" 
                            className="uni-logo" 
                        />
                    </div>

                    {/* Vertical Separator Line */}
                    <div className="vertical-line"></div>

                    {/* ==============================
                        Event Branding Logo
                    ============================== */}
                    <div className="logo-box">
                        <img 
                            src={logo_mufest} 
                            alt="eMulate" 
                            className="event-logo" 
                        />
                    </div>

                </div>

            </div>

            {/* ==============================
                Bottom Copyright Bar
            ============================== */}
            <div className="copyright-bar">
                <p>
                    © Copyright - 2026. All Rights Reserved.
                    <span className="copyright-link"> Mr Dhruv Shah</span>
                </p>
            </div>

        </footer>
    );
};

export default Footer;