import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        email_notifications: true,
        push_notifications: true,
        dark_mode: false,
        language: 'en'
    });

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/users/settings', settings);
            toast.success('Settings saved successfully!');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentPassword = formData.get('current_password');
        const newPassword = formData.get('new_password');
        const confirmPassword = formData.get('confirm_password');

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            await api.put('/users/change-password', {
                current_password: currentPassword,
                new_password: newPassword
            });
            toast.success('Password changed successfully!');
            e.target.reset();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <>
            <Helmet>
                <title>Settings | NoticeBoard</title>
            </Helmet>

            <div className="settings-page">
                <h1>⚙️ Settings</h1>

                {/* Notification Settings */}
                <div className="settings-section">
                    <h2>Notification Preferences</h2>
                    <form onSubmit={handleSubmit} className="settings-form">
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="email_notifications"
                                    checked={settings.email_notifications}
                                    onChange={handleChange}
                                />
                                Email Notifications
                            </label>
                            <p>Receive email updates about new announcements and comments</p>
                        </div>

                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="push_notifications"
                                    checked={settings.push_notifications}
                                    onChange={handleChange}
                                />
                                Push Notifications
                            </label>
                            <p>Get real-time notifications in your browser</p>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </form>
                </div>

                {/* Password Change */}
                <div className="settings-section">
                    <h2>Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="settings-form">
                        <div className="form-group">
                            <label>Current Password</label>
                            <input type="password" name="current_password" required />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" name="new_password" required minLength="6" />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" name="confirm_password" required />
                        </div>
                        <button type="submit" className="btn-primary">Change Password</button>
                    </form>
                </div>

                {/* Account Info */}
                <div className="settings-section">
                    <h2>Account Information</h2>
                    <div className="account-info">
                        <p><strong>Name:</strong> {user?.name}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Role:</strong> {user?.role}</p>
                        <p><strong>Member since:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;