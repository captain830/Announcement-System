import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import api from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            await api.post('/contact', formData);
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Contact Us | NoticeBoard</title>
                <meta name="description" content="Get in touch with the NoticeBoard team" />
            </Helmet>

            <div className="contact-page">
                <div className="contact-header">
                    <h1>📧 Contact Us</h1>
                    <p>Have questions or feedback? We'd love to hear from you!</p>
                </div>

                <div className="contact-container">
                    <div className="contact-info">
                        <div className="info-card">
                            <div className="info-icon">📍</div>
                            <h3>Visit Us</h3>
                            <p>Main Campus<br />Technology Building, Room 301<br />Nairobi, Kenya</p>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">📞</div>
                            <h3>Call Us</h3>
                            <p>+254 700 123 456<br />+254 700 123 457</p>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">✉️</div>
                            <h3>Email Us</h3>
                            <p>support@noticeboard.com<br />admin@noticeboard.com</p>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">🕒</div>
                            <h3>Hours</h3>
                            <p>Monday - Friday: 8:00 AM - 5:00 PM<br />Saturday: 9:00 AM - 1:00 PM<br />Sunday: Closed</p>
                        </div>
                    </div>

                    <div className="contact-form-container">
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Your Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="What is this regarding?"
                                />
                            </div>

                            <div className="form-group">
                                <label>Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    placeholder="Tell us how we can help..."
                                />
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;