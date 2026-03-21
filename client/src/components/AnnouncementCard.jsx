import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const AnnouncementCard = ({ announcement, onUpdate }) => {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    const getPriorityClass = (priority) => {
        switch(priority) {
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            default: return 'priority-low';
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            setLoading(true);
            await api.post(`/comments/${announcement.id}`, { comment });
            setComment('');
            toast.success('Comment added');
            fetchComments();
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await api.get(`/comments/${announcement.id}`);
            setComments(response.data.comments || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const toggleComments = () => {
        if (!showComments) {
            fetchComments();
        }
        setShowComments(!showComments);
    };

    return (
        <div className={`announcement-card ${getPriorityClass(announcement.priority)}`}>
            <div className="card-header">
                <span className={`category-badge category-${announcement.category}`}>
                    {announcement.category}
                </span>
                <span className="date">
                    {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                </span>
            </div>

            <h3 className="card-title">{announcement.title}</h3>
            <p className="card-text">{announcement.content}</p>

            {announcement.file_url && (
                <a href={announcement.file_url} target="_blank" rel="noopener noreferrer" className="file-link">
                    📎 View Attachment
                </a>
            )}

            <div className="meta-info">
                <span>👤 {announcement.creator_name}</span>
                <span>👁️ {announcement.views} views</span>
                <span>💬 {announcement.comment_count || 0} comments</span>
            </div>

            <button onClick={toggleComments} className="comment-toggle">
                {showComments ? 'Hide Comments' : 'Show Comments'}
            </button>

            {showComments && (
                <div className="comments-section">
                    <form onSubmit={handleComment} className="comment-form">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="comment-input"
                        />
                        <button type="submit" disabled={loading || !comment.trim()} className="comment-btn">
                            Post
                        </button>
                    </form>

                    <div className="comments-list">
                        {comments.map(c => (
                            <div key={c.id} className="comment-item">
                                <strong>{c.user_name}:</strong>
                                <p>{c.comment}</p>
                                <small>{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</small>
                            </div>
                        ))}
                        {comments.length === 0 && (
                            <p className="no-comments">No comments yet</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementCard;