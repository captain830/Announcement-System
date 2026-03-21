import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/notifications');
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            toast.success('All notifications marked as read');
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            toast.success('Notification deleted');
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading notifications...</p>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Notifications | NoticeBoard</title>
            </Helmet>

            <div className="notifications-page">
                <div className="notifications-header">
                    <h1>🔔 Notifications</h1>
                    {notifications.length > 0 && (
                        <button onClick={markAllAsRead} className="btn-secondary">
                            Mark All as Read
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔕</div>
                        <h3>No notifications</h3>
                        <p>You're all caught up! New notifications will appear here.</p>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {notifications.map(notif => (
                            <div 
                                key={notif.id} 
                                className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                                onClick={() => markAsRead(notif.id)}
                            >
                                <div className="notification-icon">
                                    {notif.type === 'announcement' ? '📢' : 
                                     notif.type === 'comment' ? '💬' : '🔔'}
                                </div>
                                <div className="notification-content">
                                    <p>{notif.message}</p>
                                    <small>{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}</small>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notif.id);
                                    }}
                                    className="delete-notif"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Notifications;