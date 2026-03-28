import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ✅ Added here

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.notifications.filter(n => !n.is_read).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    // Close mobile menu when clicking a link
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
                    <span className="logo-icon">📢</span>
                    <span className="logo-text">NoticeBoard</span>
                </Link>

                {/* Mobile Menu Button */}
                <button 
                    className="mobile-menu-btn" 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Menu"
                >
                    ☰
                </button>

                <form onSubmit={handleSearch} className="nav-search">
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">🔍</button>
                </form>

                {/* Mobile Navigation Links */}
                <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                    {/* Close button for mobile */}
                    <button 
                        className="mobile-menu-close" 
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>

                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>
                        Home
                    </Link>
                    
                    <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={closeMobileMenu}>
                        About
                    </Link>

                    <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={closeMobileMenu}>
                        Contact
                    </Link>
                    
                    {user?.role === 'admin' && (
                        <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} onClick={closeMobileMenu}>
                            Admin
                        </Link>
                    )}

                    {['admin', 'teacher'].includes(user?.role) && (
                        <Link to="/create" className={`nav-link create-link ${location.pathname === '/create' ? 'active' : ''}`} onClick={closeMobileMenu}>
                            + Create
                        </Link>
                    )}

                    <div className="nav-notifications">
                        <button
                            className="notif-btn"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            🔔
                            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                        </button>

                        {showNotifications && (
                            <div className="notif-dropdown">
                                <h4>Notifications</h4>
                                {notifications.length === 0 ? (
                                    <p>No notifications</p>
                                ) : (
                                    notifications.map(notif => (
                                        <div
                                            key={notif.id}
                                            className={`notif-item ${!notif.is_read ? 'unread' : ''}`}
                                            onClick={() => markAsRead(notif.id)}
                                        >
                                            <p>{notif.message}</p>
                                            <small>{new Date(notif.created_at).toLocaleDateString()}</small>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="nav-user">
                        <div className="user-menu">
                            <img
                                src={user?.profile_pic || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
                                alt={user?.name}
                                className="user-avatar"
                            />
                            <div className="user-dropdown">
                                <Link to="/profile" onClick={closeMobileMenu}>👤 Profile</Link>
                                <Link to="/settings" onClick={closeMobileMenu}>⚙️ Settings</Link>
                                <Link to="/notifications" onClick={closeMobileMenu}>🔔 Notifications</Link>
                                <hr />
                                <button onClick={() => { logout(); closeMobileMenu(); }}>🚪 Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;