import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import './CreatePlanning.css';
const ManualPlanning = () => {
    const [agents, setAgents] = useState([]);
    const [selectedAgents, setSelectedAgents] = useState([]);
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const secretaire = location.state?.secretaire;

    useEffect(() => {
        axios.get(`http://localhost:8036/api/agents/service/${secretaire.service.id}`)
            .then(response => setAgents(response.data))
            .catch(error => console.error('Error fetching agents:', error));
    }, [secretaire]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:8036/api/plannings/manual/${secretaire.id}`,
                { date, agentIds: selectedAgents }
            );
            if (response.status === 201) {
                setMessage('Planning created successfully!');
            }
        } catch (err) {
            setMessage('Error creating planning. Please try again.');
        }
    };

    const handleAgentChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedAgents(value);
    };

    return (
        <div className="contaer manual-planning">
            <Navbar />
            <h2>Create Manual Planning</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Date:</label>
                    <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Select Agents:</label>
                    <select multiple className="form-control" value={selectedAgents} onChange={handleAgentChange} required>
                        {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>{agent.nom}</option>
                        ))}
                    </select>
                </div>
                {message && <p className="message">{message}</p>}
                <button type="submit" className="btn">Submit</button>
            </form>
        </div>
    );
};

export default ManualPlanning;
