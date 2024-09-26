import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddAgent.css';

const AddAgent = () => {
    const [agent, setAgent] = useState({
        cin: '',
        nom: '',
        telephone: '',
        mdp: '',
        email: '',
        serviceId: '',
        adresse: '' // Ajout de l'adresse
    });
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:8036/api/services');
            if (Array.isArray(response.data)) {
                setServices(response.data);
            } else {
                console.error('Unexpected response format:', response.data);
                setServices([]);
            }
        } catch (error) {
            console.error('There was an error fetching the services!', error);
            setError('Failed to fetch services. Please try again later.');
            setServices([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAgent({ ...agent, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8036/api/agents/service/${agent.serviceId}`, agent);
            if (response.status === 200) {
                navigate('/agents-admin');
            }
        } catch (error) {
            console.error('There was an error creating the agent!', error);
            setError('Failed to create agent. Please check your input and try again.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h2>Add New Agent</h2>
                </div>
                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="cin"
                                name="cin"
                                value={agent.cin}
                                onChange={handleChange}
                                placeholder="CIN" // Ajout du placeholder
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="nom"
                                name="nom"
                                value={agent.nom}
                                onChange={handleChange}
                                placeholder="Nom" 
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="telephone"
                                name="telephone"
                                value={agent.telephone}
                                onChange={handleChange}
                                placeholder="Téléphone" // Ajout du placeholder
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={agent.email}
                                onChange={handleChange}
                                placeholder="Email" // Ajout du placeholder
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                id="mdp"
                                name="mdp"
                                value={agent.mdp}
                                onChange={handleChange}
                                placeholder="Mot de passe" // Ajout du placeholder
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="adresse"
                                name="adresse"
                                value={agent.adresse}
                                onChange={handleChange}
                                placeholder="Adresse" // Ajout du placeholder
                                required
                            />
                        </div>
                        <div className="form-group">
                            <select
                                className="form-control"
                                id="serviceId"
                                name="serviceId"
                                value={agent.serviceId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a Service</option>
                                {services.length > 0 ? (
                                    services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.nom}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No services available</option>
                                )}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Add Agent
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAgent;
