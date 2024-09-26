import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import "./AutoPlanning.css"
import Navbar from './Navbar';

const AutoPlanning = () => {
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const secretaire = location.state?.secretaire;

    const handleAutoPlanning = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8036/api/plannings/auto/${secretaire.id}`,
                { date }
            );
            if (response.status === 201) {
                setMessage('Automatic planning created successfully!');
            }
        } catch (err) {
            setMessage('Error creating automatic planning. Please try again.');
        }
    };

    return (
        <div className="auto-planning">
        <Navbar/>
            <h2>Create Automatic Planning</h2>
            <div className="form-group">
                <label>Date:</label>
                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            {message && <p className="message">{message}</p>}
            <button onClick={handleAutoPlanning} className="btn">Create Automatic Planning</button>
        </div>
    );
};

export default AutoPlanning;
