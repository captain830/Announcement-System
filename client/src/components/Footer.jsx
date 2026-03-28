import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);
    const currentYear = new Date().getFullYear();

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email');
            return;
        }
        setSubscribing(true);
        setTimeout(() => {
            toast.success('Subscribed successfully!');
            setEmail('');
            setSubscribing(false);
        }, 1000);
    };

    // Your actual social media links with Font Awesome icons
    const socialLinks = [
        { 
            name: 'GitHub', 
            icon: 'fab fa-github', 
            url: 'https://github.com/captain830',
            color: '#333'
        },
        { 
            name: 'Twitter', 
            icon: 'fab fa-twitter', 
            url: 'https://x.com/ndungudavid641',
            color: '#1da1f2'
        },
        { 
            name: 'Facebook', 
            icon: 'fab fa-facebook-f', 
            url: 'https://www.facebook.com/profile.php?id=61575683799118',
            color: '#1877f2'
        },
        { 
            name: 'YouTube', 
            icon: 'fab fa-youtube', 
            url: 'https://www.youtube.com/@DavidNdungu-k3q',
            color: '#ff0000'
        },
        { 
            name: 'Instagram', 
            icon: 'fab fa-instagram', 
            url: 'https://www.instagram.com/captain_the_1/',
            color: '#e4405f'
        }
    ];

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Brand Section */}
                <div className="footer-section">
                    <h3>📢 NoticeBoard</h3>
                    <p>Your central hub for campus announcements and updates. Stay informed, stay connected with the latest happenings around campus.</p>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li>
                    </ul>
                </div>

                {/* Resources */}
                <div className="footer-section">
                    <h4>Resources</h4>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Support</a></li>
                        <li><a href="#">API Documentation</a></li>
                        <li><a href="#">Developer Portal</a></li>
                        <li><a href="#">Status Page</a></li>
                    </ul>
                </div>

                {/* Newsletter & Social */}
                <div className="footer-section">
                    <h4>Stay Updated</h4>
                    <p>Subscribe to get the latest announcements directly to your inbox.</p>
                    <form onSubmit={handleSubscribe} className="newsletter-form">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={subscribing}>
                            {subscribing ? '...' : 'Subscribe'}
                        </button>
                    </form>
                    
                    {/* Social Media with Font Awesome */}
                    <div className="footer-social">
                        <h4>Follow Me</h4>
                        <div className="social-links">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                    aria-label={social.name}
                                >
                                    <i className={social.icon}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info Bar with Font Awesome */}
            <div className="footer-contact">
                <div className="contact-info-row">
                    <span className="contact-icon"><i className="fas fa-envelope"></i></span>
                    <span>support@noticeboard.com</span>
                    <span className="separator">•</span>
                    <span className="contact-icon"><i className="fas fa-phone-alt"></i></span>
                    <span>+254 700 123 456</span>
                    <span className="separator">•</span>
                    <span className="contact-icon"><i className="fas fa-map-marker-alt"></i></span>
                    <span>Main Campus, Technology Building</span>
                </div>
            </div>

            {/* Copyright with Font Awesome heart */}
            <div className="footer-bottom">
                <p>&copy; {currentYear} NoticeBoard. All rights reserved. | Made with <i className="fas fa-heart" style={{ color: '#ef4444' }}></i> by Captain</p>
            </div>
        </footer>
    );
};

export default Footer;