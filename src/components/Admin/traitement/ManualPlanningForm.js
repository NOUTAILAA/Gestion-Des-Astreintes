import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import './ManualPlanningForm.css';
import Navbar from '../Navbaar/Navbar';

const ManualPlanningForm = () => {
    const [serviceId, setServiceId] = useState('');
    const [agentIds, setAgentIds] = useState([]);
    const [date, setDate] = useState('');
    const [agents, setAgents] = useState([]);
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8036/api/services')
            .then(response => {
                setServices(response.data || []); // Toujours initialiser à un tableau vide si aucune donnée
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des services:', error);
                setServices([]);
            });

        axios.get('http://localhost:8036/api/agents')
            .then(response => {
                setAgents(response.data || []); // Toujours initialiser à un tableau vide si aucune donnée
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des agents:', error);
                setAgents([]);
            });
    }, []);

    useEffect(() => {
        if (serviceId) {
            const fetchAgentsByService = async () => {
                try {
                    const response = await axios.get(`http://localhost:8036/api/agents/service/${serviceId}`);
                    setAgents(response.data || []); // Toujours initialiser à un tableau vide si aucune donnée
                } catch (err) {
                    console.error('Erreur lors de la récupération des agents par service:', err);
                    setAgents([]);
                }
            };

            fetchAgentsByService();
        } else {
            setAgents([]); // Réinitialiser les agents à un tableau vide si aucun service n'est sélectionné
        }
    }, [serviceId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedAgentIds = agentIds.map(id => parseInt(id));

        axios.post('http://localhost:8036/api/plannings/manual', {
            serviceId: parseInt(serviceId),
            date,
            agentIds: formattedAgentIds
        })
        .then(response => {
            console.log('Planning créé:', response.data);
            
            setServiceId('');
            setAgentIds([]);
            setDate('');
            setError('');

        })
        .catch(error => {
            setError('Échec de la création du planning');
            console.error('Erreur lors de la création du planning:', error.response?.data || error.message);
        });
    };

    return (
    <div className="hey">
    
        <div className="containe2r mt-4">
        <Navbar/>
        
            <h2 className='HHH'>Planning Manuel</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Service</label>
                    {services.length > 0 ? (
                        services.map(service => (
                            <div className="form-checkk" key={service.id}>
                                <Form.Check 
                                    type="radio"
                                    id={`service-${service.id}`}
                                    label={service.nom}
                                    value={service.id}
                                    checked={serviceId === service.id.toString()}
                                    onChange={(e) => setServiceId(e.target.value)}
                                />
                            </div>
                        ))
                    ) : (
                        <p>Aucun service disponible</p>
                    )}
                </div>
                {serviceId && (
                    <div className="form-group">
                        <label>Agents</label>
                        <select
                            multiple
                            className="form-control"
                            value={agentIds}
                            onChange={(e) =>
                                setAgentIds([...e.target.selectedOptions].map(option => option.value))
                            }
                        >
                            {agents.length > 0 ? (
                                agents.map(agent => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.nom}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Aucun agent disponible</option>
                            )}
                        </select>
                    </div>
                )}
                <button type="submit" className="btn btn-primary">Créer </button>
                {error && <p className="text-danger mt-2">{error}</p>}
            </form>
        </div>
        </div>
    );
};

export default ManualPlanningForm;
