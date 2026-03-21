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
        // Simulate subscription
        setTimeout(() => {
            toast.success('Subscribed successfully!');
            setEmail('');
            setSubscribing(false);
        }, 1000);
    };

    // Social Media Links with proper URLs
    const socialLinks = [
        { name: 'Facebook', icon: '📘', url: 'https://facebook.com/noticeboard', color: '#1877f2' },
        { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/noticeboard', color: '#1da1f2' },
        { name: 'Instagram', icon: '📷', url: 'https://instagram.com/noticeboard', color: '#e4405f' },
        { name: 'LinkedIn', icon: '🔗', url: 'https://linkedin.com/company/noticeboard', color: '#0a66c2' },
        { name: 'YouTube', icon: '▶️', url: 'https://youtube.com/@noticeboard', color: '#ff0000' },
        { name: 'GitHub', icon: '🐙', url: 'https://github.com/noticeboard', color: '#333' }
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
                    
                    {/* Social Media */}
                    <div className="footer-social">
                        <h4>Follow Us</h4>
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
                                    <span className="social-icon">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info Bar */}
            <div className="footer-contact">
                <div className="contact-info-row">
                    <span className="contact-icon">📧</span>
                    <span>support@noticeboard.com</span>
                    <span className="separator">•</span>
                    <span className="contact-icon">📞</span>
                    <span>+254 700 123 456</span>
                    <span className="separator">•</span>
                    <span className="contact-icon">📍</span>
                    <span>Main Campus, Technology Building</span>
                </div>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <p>&copy; {currentYear} NoticeBoard. All rights reserved. | Made with ❤️ for better campus communication</p>
            </div>
        </footer>
    );
};

export default Footer;