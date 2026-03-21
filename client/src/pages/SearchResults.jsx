import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import AnnouncementCard from '../components/AnnouncementCard';
import { Helmet } from 'react-helmet-async';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        if (query) {
            searchAnnouncements();
        }
    }, [query]);

    const searchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/announcements/search?q=${encodeURIComponent(query)}`);
            setResults(response.data.announcements);
            setTotalResults(response.data.count);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Searching for "{query}"...</p>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Search Results for "{query}" | NoticeBoard</title>
            </Helmet>

            <div className="search-results">
                <div className="search-header">
                    <h1>Search Results</h1>
                    <p>Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"</p>
                </div>

                {results.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No results found</h3>
                        <p>Try searching with different keywords or browse all announcements.</p>
                        <Link to="/" className="btn-primary">Browse All</Link>
                    </div>
                ) : (
                    <div className="announcements-grid">
                        {results.map(announcement => (
                            <AnnouncementCard
                                key={announcement.id}
                                announcement={announcement}
                                onUpdate={searchAnnouncements}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchResults;