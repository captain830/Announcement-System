import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { formatDistanceToNow } from 'date-fns';

const AnnouncementDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAnnouncement();
        fetchComments();
    }, [id]);

    const fetchAnnouncement = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/announcements/${id}`);
            setAnnouncement(response.data.announcement);
        } catch (error) {
            console.error('Error fetching announcement:', error);
            toast.error('Announcement not found');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await api.get(`/comments/${id}`);
            setComments(response.data.comments || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmitting(true);
            await api.post(`/comments/${id}`, { comment: newComment });
            setNewComment('');
            toast.success('Comment added successfully!');
            fetchComments();
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAnnouncement = async () => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await api.delete(`/announcements/${id}`);
                toast.success('Announcement deleted successfully');
                navigate('/');
            } catch (error) {
                toast.error('Failed to delete announcement');
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading announcement...</p>
            </div>
        );
    }

    if (!announcement) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>Announcement not found</h3>
                <p>The announcement you're looking for doesn't exist or has been removed.</p>
                <Link to="/" className="btn-primary">Go Home</Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{announcement.title} | NoticeBoard</title>
                <meta name="description" content={announcement.content.substring(0, 160)} />
            </Helmet>

            <div className="announcement-details">
                <div className="details-container">
                    {/* Back Button */}
                    <button onClick={() => navigate(-1)} className="back-btn">
                        ← Back
                    </button>

                    {/* Announcement Card */}
                    <div className={`details-card priority-${announcement.priority}`}>
                        <div className="details-header">
                            <div className="details-meta">
                                <span className={`category-badge category-${announcement.category}`}>
                                    {announcement.category}
                                </span>
                                <span className="priority-badge priority-{announcement.priority}">
                                    {announcement.priority.toUpperCase()}
                                </span>
                                {announcement.is_pinned && (
                                    <span className="pinned-badge">📌 Pinned</span>
                                )}
                            </div>
                            <div className="details-date">
                                Posted {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                            </div>
                        </div>

                        <h1 className="details-title">{announcement.title}</h1>
                        
                        <div className="details-author">
                            <div className="author-info">
                                <span className="author-avatar">
                                    {announcement.creator_name?.charAt(0).toUpperCase()}
                                </span>
                                <span className="author-name">{announcement.creator_name}</span>
                                <span className="author-role role-badge role-{announcement.creator_role}">
                                    {announcement.creator_role}
                                </span>
                            </div>
                            <div className="details-stats">
                                <span>👁️ {announcement.views} views</span>
                                <span>💬 {comments.length} comments</span>
                            </div>
                        </div>

                        <div 
                            className="details-content"
                            dangerouslySetInnerHTML={{ __html: announcement.content }}
                        />

                        {announcement.file_url && (
                            <div className="details-attachment">
                                <a href={announcement.file_url} target="_blank" rel="noopener noreferrer">
                                    📎 Download Attachment
                                </a>
                            </div>
                        )}

                        {/* Admin Actions */}
                        {user?.role === 'admin' && (
                            <div className="details-actions">
                                <button onClick={handleDeleteAnnouncement} className="btn-danger">
                                    🗑️ Delete Announcement
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Comments Section */}
                    <div className="comments-section">
                        <h3>Comments ({comments.length})</h3>

                        {/* Add Comment Form */}
                        <form onSubmit={handleCommentSubmit} className="add-comment-form">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                rows="3"
                                required
                            />
                            <button type="submit" disabled={submitting}>
                                {submitting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </form>

                        {/* Comments List */}
                        <div className="comments-list">
                            {comments.length === 0 ? (
                                <div className="no-comments">
                                    <p>No comments yet. Be the first to comment!</p>
                                </div>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} className="comment-item">
                                        <div className="comment-header">
                                            <strong>{comment.user_name}</strong>
                                            <small>
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                            </small>
                                        </div>
                                        <p>{comment.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnnouncementDetails;