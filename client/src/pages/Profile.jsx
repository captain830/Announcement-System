import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        department: user?.department || '',
        year: user?.year || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.put('/users/profile', formData);
            updateUser(response.data.user);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Update error:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const getInitials = () => {
        return user?.name?.charAt(0).toUpperCase() || 'U';
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {getInitials()}
                </div>
                <div className="profile-info">
                    <h2>{user?.name}</h2>
                    <p>{user?.email}</p>
                    <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
                </div>
            </div>

            {!isEditing ? (
                <>
                    <div className="profile-details">
                        <div className="detail-item">
                            <label>Full Name</label>
                            <p>{user?.name}</p>
                        </div>
                        <div className="detail-item">
                            <label>Email</label>
                            <p>{user?.email}</p>
                        </div>
                        <div className="detail-item">
                            <label>Role</label>
                            <p>{user?.role}</p>
                        </div>
                        <div className="detail-item">
                            <label>Department</label>
                            <p>{user?.department || 'Not specified'}</p>
                        </div>
                        <div className="detail-item">
                            <label>Year</label>
                            <p>{user?.year || 'Not specified'}</p>
                        </div>
                        <div className="detail-item">
                            <label>Member Since</label>
                            <p>{new Date(user?.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="edit-profile-btn"
                    >
                        ✏️ Edit Profile
                    </button>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Department</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="e.g., Computer Science"
                        />
                    </div>
                    <div className="form-group">
                        <label>Year</label>
                        <input
                            type="text"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            placeholder="e.g., 3rd Year"
                        />
                    </div>
                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    name: user?.name || '',
                                    email: user?.email || '',
                                    department: user?.department || '',
                                    year: user?.year || ''
                                });
                            }} 
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="btn-submit"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;