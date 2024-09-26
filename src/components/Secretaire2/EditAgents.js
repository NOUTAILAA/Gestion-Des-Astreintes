import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditAgents.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const EditAgent = () => {
    const { id } = useParams();
    const [agent, setAgent] = useState({
        nom: '',
        cin: '',
        adresse: '',
        telephone: '',
        email: '',
        mdp: ''
    });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [services, setServices] = useState([]);
    const [emailExists, setEmailExists] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                const response = await axios.get(`http://localhost:8036/api/agents/${id}`);
                setAgent(response.data);
            } catch (error) {
                setError('Erreur lors de la récupération des détails de l\'agent');
            }
        };

        fetchAgent();
    }, [id]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:8036/api/services');
                setServices(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des services');
            }
        };

        fetchServices();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAgent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Function to check if the email exists
    const checkEmailExists = async (email) => {
        try {
            const response = await axios.get(`http://localhost:8036/api/agents/check-email?email=${email}`);
            return response.data.exists; // Assuming the API returns { exists: true/false }
        } catch (error) {
            console.error('Error checking email:', error);
            return false; // Default to not existing on error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailExists = await checkEmailExists(agent.email);

        if (emailExists) {
            setEmailExists(true);
            alert('L\'email existe déjà. Veuillez en saisir un autre.');
            return;
        }

        try {
            await axios.put(`http://localhost:8036/api/agents/${id}`, agent);
            navigate('/Newagents'); // Navigate after update
        } catch (error) {
            setError('EMAIL Déjà existant');
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg border-primary">
                <div className="card-header bg-primary text-white">
                    <h2 className="mb-0">Modifier l'agent</h2>
                </div>
                <div className="card-body">
                    {error && <p className="text-danger">{error}</p>}
                    {emailExists && <p className="text-danger">L'email existe déjà.</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                id="cin"
                                className="form-control"
                                name="cin"
                                value={agent.cin}
                                onChange={handleChange}
                                placeholder='CIN'
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="nom"
                                className="form-control"
                                name="nom"
                                value={agent.nom}
                                onChange={handleChange}
                                placeholder='NOM'

                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="adresse"
                                className="form-control"
                                name="adresse"
                                value={agent.adresse}
                                onChange={handleChange}
                                placeholder='ADRESSE'

                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="telephone"
                                className="form-control"
                                name="telephone"
                                value={agent.telephone}
                                onChange={handleChange}
                                placeholder='PHONE'

                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                name="email"
                                value={agent.email}
                                onChange={handleChange}
                                placeholder='EMAIL'

                                required
                            />
                        </div>
                        <div className="form-group position-relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="mdp"
                                className="form-control"
                                name="mdp"
                                value={agent.mdp}
                                onChange={handleChange}
                                placeholder='MOT DE PASSE'

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
                        <button type="submit" className="btn">
                            <span className="btn-text-one">Mettre à jour</span>
                            <span className="btn-text-two">Mis à jour!</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAgent;
