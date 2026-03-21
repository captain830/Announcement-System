import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminPanel = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [pendingAnnouncements, setPendingAnnouncements] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAnnouncements: 0,
        totalComments: 0,
        totalViews: 0
    });
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const [usersRes, pendingRes, statsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/pending-announcements'),
                api.get('/admin/stats')
            ]);
            setUsers(usersRes.data.users);
            setPendingAnnouncements(pendingRes.data.announcements);
            setStats(statsRes.data.stats);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveAnnouncement = async (id) => {
        try {
            await api.put(`/announcements/${id}/approve`);
            toast.success('Announcement approved!');
            fetchAdminData();
        } catch (error) {
            toast.error('Failed to approve announcement');
        }
    };

    const handleRejectAnnouncement = async (id) => {
        try {
            await api.delete(`/announcements/${id}`);
            toast.success('Announcement rejected');
            fetchAdminData();
        } catch (error) {
            toast.error('Failed to reject announcement');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                toast.success('User deleted');
                fetchAdminData();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const handleToggleUserRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'student' : 'admin';
        try {
            await api.put(`/admin/users/${id}/role`, { role: newRole });
            toast.success(`User role updated to ${newRole}`);
            fetchAdminData();
        } catch (error) {
            toast.error('Failed to update user role');
        }
    };

    if (loading) {
        return <div className="loading">Loading admin panel...</div>;
    }

    return (
        <div className="admin-panel">
            <header className="admin-header">
                <h1>🛡️ Admin Panel</h1>
                <p>Manage users, announcements, and system settings</p>
            </header>

            {/* Stats Overview */}
            <div className="admin-stats">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📢</div>
                    <div className="stat-info">
                        <h3>{stats.totalAnnouncements}</h3>
                        <p>Announcements</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💬</div>
                    <div className="stat-info">
                        <h3>{stats.totalComments}</h3>
                        <p>Comments</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👁️</div>
                    <div className="stat-info">
                        <h3>{stats.totalViews}</h3>
                        <p>Total Views</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Users ({users.length})
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    ⏳ Pending ({pendingAnnouncements.length})
                </button>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="admin-users">
                    <h2>All Users</h2>
                    <div className="users-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Member Since</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td><strong>{user.name}</strong></td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`role-badge role-${user.role}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.department || '-'}</td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="actions">
                                            <button
                                                onClick={() => handleToggleUserRole(user.id, user.role)}
                                                className="btn-icon btn-role"
                                                title="Change Role"
                                            >
                                                🔄
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="btn-icon btn-delete"
                                                title="Delete User"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pending Announcements Tab */}
            {activeTab === 'pending' && (
                <div className="admin-pending">
                    <h2>Pending Announcements</h2>
                    {pendingAnnouncements.length === 0 ? (
                        <div className="no-data">No pending announcements</div>
                    ) : (
                        <div className="pending-grid">
                            {pendingAnnouncements.map(announcement => (
                                <div key={announcement.id} className="pending-card">
                                    <div className="pending-header">
                                        <h3>{announcement.title}</h3>
                                        <span className="priority-badge priority-{announcement.priority}">
                                            {announcement.priority}
                                        </span>
                                    </div>
                                    <p className="pending-content">{announcement.content}</p>
                                    <div className="pending-meta">
                                        <span>👤 {announcement.creator_name}</span>
                                        <span>📅 {new Date(announcement.created_at).toLocaleDateString()}</span>
                                        <span>🏷️ {announcement.category}</span>
                                    </div>
                                    <div className="pending-actions">
                                        <button
                                            onClick={() => handleApproveAnnouncement(announcement.id)}
                                            className="btn-approve"
                                        >
                                            ✅ Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectAnnouncement(announcement.id)}
                                            className="btn-reject"
                                        >
                                            ❌ Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;