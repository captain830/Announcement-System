import React from 'react';
import { Helmet } from 'react-helmet-async';

const About = () => {
    return (
        <>
            <Helmet>
                <title>About Us | NoticeBoard</title>
                <meta name="description" content="Learn about NoticeBoard - Your campus communication platform" />
            </Helmet>

            <div className="about-page">
                <div className="about-hero">
                    <h1>About NoticeBoard</h1>
                    <p>Your central hub for campus announcements and communication</p>
                </div>

                <div className="about-content">
                    <div className="about-section">
                        <h2>📢 Our Mission</h2>
                        <p>
                            NoticeBoard is dedicated to improving communication within educational institutions. 
                            We believe that timely and accessible information is essential for a thriving campus community.
                        </p>
                    </div>

                    <div className="about-section">
                        <h2>✨ What We Offer</h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon">📢</div>
                                <h3>Instant Announcements</h3>
                                <p>Post and receive important updates in real-time</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">🔍</div>
                                <h3>Smart Search</h3>
                                <p>Find past announcements quickly and easily</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">💬</div>
                                <h3>Interactive Comments</h3>
                                <p>Engage with the community through comments</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">🔔</div>
                                <h3>Real-time Notifications</h3>
                                <p>Never miss important updates</p>
                            </div>
                        </div>
                    </div>

                    <div className="about-section">
                        <h2>👥 Our Team</h2>
                        <p>
                            NoticeBoard was created by a passionate team of developers dedicated to improving 
                            campus communication. We're constantly working to add new features and improve 
                            your experience.
                        </p>
                    </div>

                    <div className="about-section">
                        <h2>📞 Contact Us</h2>
                        <p>
                            Have questions or suggestions? We'd love to hear from you!
                        </p>
                        <p>
                            <strong>Email:</strong> support@noticeboard.com<br />
                            <strong>Location:</strong> Main Campus, Technology Building
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;