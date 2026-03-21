import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

const CreateAnnouncement = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'general',
        priority: 'low',
        expiry_date: '',
        schedule_date: ''
    });
    const [scheduleLater, setScheduleLater] = useState(false);

    const categories = [
        'academic', 'event', 'administrative', 'emergency', 'club', 'general'
    ];

    const priorities = [
        { value: 'low', label: 'Low', color: '#10b981' },
        { value: 'medium', label: 'Medium', color: '#f59e0b' },
        { value: 'high', label: 'High', color: '#ef4444' }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }
        
        if (!formData.content.trim()) {
            toast.error('Content is required');
            return;
        }

        try {
            setLoading(true);
            const dataToSend = { ...formData };
            
            if (!scheduleLater) {
                delete dataToSend.schedule_date;
            }
            
            await api.post('/announcements', dataToSend);
            toast.success('Announcement created successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create announcement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Create Announcement | NoticeBoard</title>
            </Helmet>

            <div className="create-container">
                <div className="create-header">
                    <h1>Create New Announcement</h1>
                    <p>Share important updates with the campus community</p>
                </div>

                <form onSubmit={handleSubmit} className="create-form">
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter announcement title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Content *</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your announcement here..."
                            rows="8"
                            required
                            className="content-textarea"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange}>
                                {priorities.map(p => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={scheduleLater}
                                onChange={(e) => setScheduleLater(e.target.checked)}
                            />
                            Schedule for later
                        </label>
                    </div>

                    {scheduleLater && (
                        <div className="form-group">
                            <label>Schedule Date & Time</label>
                            <input
                                type="datetime-local"
                                name="schedule_date"
                                value={formData.schedule_date}
                                onChange={handleChange}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Expiry Date (Optional)</label>
                        <input
                            type="date"
                            name="expiry_date"
                            value={formData.expiry_date}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/')} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="btn-submit">
                            {loading ? 'Creating...' : 'Publish Announcement'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateAnnouncement;