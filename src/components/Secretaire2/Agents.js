import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './agentssssssss.css'; // Import the CSS file
import Navbar from './Navbar';
const Agents = () => {
    const [agents, setAgents] = useState([]);
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [agentsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const secretaire = location.state?.secretaire;

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const secretaire = JSON.parse(localStorage.getItem('secretaire'));
                if (secretaire) {
                    setServiceId(secretaire.serviceId);
                    const response = await axios.get(`http://localhost:8036/api/secretaires/${secretaire.id}/agents`);
                    setAgents(response.data);
                    setFilteredAgents(response.data);
                }
            } catch (error) {
                setError('Erreur lors de la récupération des agents');
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    useEffect(() => {
        const results = agents.filter(agent =>
            agent.nom && agent.nom.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAgents(results);
    }, [searchTerm, agents]);

    const indexOfLastAgent = currentPage * agentsPerPage;
    const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
    const currentAgents = filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);

    const handleEdit = (id) => {
        navigate(`/neweditagent/${id}`);
    };

    const handleDelete = async (id) => {
        // Show a confirmation dialog before deleting
        const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet agent ?");
    
        if (isConfirmed) {
            try {
                await axios.delete(`http://localhost:8036/api/agents/${id}`);
                setAgents(agents.filter(agent => agent.id !== id));
            } catch (error) {
                setError('Erreur lors de la suppression de l\'agent');
            }
        }
    };
    

    const handleAddAgent = () => {
        if (secretaire) {
            navigate('/add-agenttt', { state: { secretaire, serviceId: secretaire.service.id } });
        } else {
            console.error('Secretaire is undefined');
        }
    };
    const handleManualPlanning = () => {
      
            navigate('/manualPlanning', { state: { secretaire, serviceId: secretaire.service.id } });
        
       
    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);

    return (
        <div className="containeer">
            <Navbar />
            <div className="card">
                <div className="card-header">
                    <h2>Agents de votre service</h2>
                    <button onClick={handleAddAgent} className="HH">Ajouter un Agent</button>
                </div>
                <div className="card-body">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <>
                            <div className="group">
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    aria-label="Search agents"
                                />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <svg
                                    className="icon-search"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                            <table >
                                <thead className='TABLEE'>
                                    <tr>
                                        <th>CIN</th>
                                        <th>Nom</th>
                                        <th>Adresse</th>
                                        <th>Téléphone</th>
                                        <th>Service</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentAgents.map(agent => (
                                        <tr key={agent.id} className="table-row">
                                            <td>{agent.cin}</td>
                                            <td>{agent.nom}</td>
                                            <td>{agent.adresse}</td>
                                            <td>{agent.telephone}</td>
                                            <td>{agent.service ? agent.service.nom : 'N/A'}</td>
                                            <td>
                                                <svg
                                                    className="icon-edit"
                                                    onClick={() => handleEdit(agent.id)}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M12 20h9"></path>
                                                    <path d="M9 20h-6a2 2 0 0 1-2-2v-6"></path>
                                                    <path d="M3 13l9 9 12-12-9-9-12 12"></path>
                                                </svg>
                                                <svg
                                                    className="icon-delete"
                                                    onClick={() => handleDelete(agent.id)}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M21 4H8l-1-1H3"></path>
                                                    <path d="M19 6V22a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                                    <path d="M8 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    aria-label="Previous page"
                                >
                                    &lt;
                                </button>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={index + 1 === currentPage ? 'active' : ''}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    aria-label="Next page"
                                >
                                    &gt;
                                </button>
                            </div>
                        </>
                    )}
                </div>

            </div>
            
        </div>
       
    );
};

export default Agents;
