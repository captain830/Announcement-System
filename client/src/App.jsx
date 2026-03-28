import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';
 
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateAnnouncement from './pages/CreateAnnouncement';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import AnnouncementDetails from './pages/AnnouncementDetails';
import SearchResults from './pages/SearchResults';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import About from './pages/About';
import Contact from './pages/Contact';

import './App.css';

function App() {
    return (
        <HelmetProvider>
            <Router>
                <AuthProvider>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route element={<Layout />}>
                            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                            <Route path="/announcement/:id" element={<PrivateRoute><AnnouncementDetails /></PrivateRoute>} />
                            <Route path="/create" element={<PrivateRoute><CreateAnnouncement /></PrivateRoute>} />
                            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                            <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
                            <Route path="/search" element={<PrivateRoute><SearchResults /></PrivateRoute>} />
                            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                            <Route path="/about" element={
                                <PrivateRoute>
                                    <About />
                                </PrivateRoute>
                            } />

                            <Route path="/contact" element={
                                <PrivateRoute>
                                    <Contact />
                                </PrivateRoute>
                            } />
                        </Route>
                    </Routes>
                </AuthProvider>
            </Router>
        </HelmetProvider>
    );
}

export default App;