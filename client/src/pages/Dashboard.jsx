import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AnnouncementCard from '../components/AnnouncementCard';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('latest');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({
        total: 0,
        views: 0,
        comments: 0
    });

    useEffect(() => {
        fetchAnnouncements();
        fetchStats();
    }, [filter, sortBy, currentPage]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await api.get('/announcements', {
                params: {
                    category: filter !== 'all' ? filter : undefined,
                    sort: sortBy,
                    page: currentPage,
                    limit: 9
                }
            });
            setAnnouncements(response.data.announcements);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/announcements/stats');
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const categories = [
        { value: 'all', label: 'All', icon: '📌' },
        { value: 'academic', label: 'Academic', icon: '📚' },
        { value: 'event', label: 'Events', icon: '🎉' },
        { value: 'administrative', label: 'Administrative', icon: '🏛️' },
        { value: 'emergency', label: 'Emergency', icon: '⚠️' },
        { value: 'club', label: 'Clubs', icon: '🎯' },
        { value: 'general', label: 'General', icon: '📢' }
    ];

    const sortOptions = [
        { value: 'latest', label: 'Latest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'popular', label: 'Most Viewed' },
        { value: 'trending', label: 'Most Comments' }
    ];

    return (
        <>
            <Helmet>
                <title>Dashboard | NoticeBoard</title>
                <meta name="description" content="Stay updated with latest campus announcements" />
            </Helmet>

            <div className="dashboard">
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="hero-content">
                        <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                        <p>Stay informed with the latest campus announcements and updates.</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📢</div>
                        <div className="stat-info">
                            <h3>{stats.total}</h3>
                            <p>Total Announcements</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">👁️</div>
                        <div className="stat-info">
                            <h3>{stats.views}</h3>
                            <p>Total Views</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💬</div>
                        <div className="stat-info">
                            <h3>{stats.comments}</h3>
                            <p>Total Comments</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <h3>--</h3>
                            <p>Active Users</p>
                        </div>
                    </div>
                </div>

                {/* Filters & Sorting */}
                <div className="controls-section">
                    <div className="filter-group">
                        <label>Category:</label>
                        <div className="category-filters">
                            {categories.map(cat => (
                                <button
                                    key={cat.value}
                                    className={`filter-chip ${filter === cat.value ? 'active' : ''}`}
                                    onClick={() => setFilter(cat.value)}
                                >
                                    <span>{cat.icon}</span> {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="sort-group">
                        <label>Sort by:</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Announcements Grid */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading announcements...</p>
                    </div>
                ) : (
                    <>
                        <div className="announcements-grid">
                            {announcements.map(announcement => (
                                <AnnouncementCard
                                    key={announcement.id}
                                    announcement={announcement}
                                    onUpdate={fetchAnnouncements}
                                />
                            ))}
                        </div>

                        {announcements.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">📭</div>
                                <h3>No announcements found</h3>
                                <p>Check back later for updates or create a new announcement.</p>
                                {['admin', 'teacher'].includes(user?.role) && (
                                    <button onClick={() => navigate('/create')} className="btn-primary">
                                        + Create Announcement
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="page-btn"
                                >
                                    ← Previous
                                </button>
                                <span className="page-info">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="page-btn"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Dashboard;