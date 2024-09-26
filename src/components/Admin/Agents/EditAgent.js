import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditAgent.css'; // Custom CSS for additional styling

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const EditAgentPourAdmin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { agent, admin } = location.state;

    const [cin, setCin] = useState(agent.cin || "");
    const [nom, setNom] = useState(agent.nom || "");
    const [adresse, setAdresse] = useState(agent.adresse || "");
    const [telephone, setTelephone] = useState(agent.telephone || "");
    const [mdp, setMdp] = useState(agent.mdp || "");
    const [email, setEmail] = useState(agent.email || ""); // Ajout de l'email
    const [service, setService] = useState(agent.service ? agent.service.id : "");
    const [showPassword, setShowPassword] = useState(false);
    const [services, setServices] = useState([]); // List of available services
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the list of services
        axios.get('http://localhost:8036/api/services')
            .then(response => setServices(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                cin,
                nom,
                adresse,
                telephone,
                mdp,
                email, // Ajout de l'email
                service: { id: service } // Using selected service ID
            };

            await axios.put(`http://localhost:8036/api/agents/admin/${agent.id}`, updateData);
            navigate('/agents-admin', { state: { admin } });
        } catch (err) {
            setError('Failed to update agent');
            console.error(err);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg border-primary">
                <div className="card-header bg-primary text-white">
                    <h2 className="mb-0">Edit Agent</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleEdit}>
                        <div className="form-group">
                            <input
                                type="text"
                                id="cin"
                                className="form-control"
                                value={cin}
                                onChange={(e) => setCin(e.target.value)}
                                placeholder="CIN" // Ajout du placeholder
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="nom"
                                className="form-control"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                placeholder="Nom" // Ajout du placeholder
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="adresse"
                                className="form-control"
                                value={adresse}
                                onChange={(e) => setAdresse(e.target.value)}
                                placeholder="Adresse" // Ajout du placeholder
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="telephone"
                                className="form-control"
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                                placeholder="Téléphone" // Ajout du placeholder
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email" // Ajout du placeholder
                                required
                            />
                        </div>
                        <div className="form-group position-relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="mdp"
                                className="form-control"
                                value={mdp}
                                onChange={(e) => setMdp(e.target.value)}
                                placeholder="Mot de passe" // Ajout du placeholder
                                required
                            />
                            <button
                                type="button"
                                className="btn-eye"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
                        <div className="form-group">
                            <select
                                id="service"
                                className="form-control"
                                value={service}
                                onChange={(e) => setService(e.target.value)} // Update state with selected service ID
                                required
                            >
                                <option value="">Select Service</option>
                                {services.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {service.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <button className="btn1">
                            <span className="btn1-text-one">Update Agent</span>
                            <span className="btn1-text-two">Updated!</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAgentPourAdmin;
