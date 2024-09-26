import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AgentList.css'; // Custom CSS for additional styling
import ReactPaginate from 'react-paginate';
import Navbar from '../Navbaar/Navbar'; // Assurez-vous que le chemin est correct

const AgentList = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [agentsPerPage] = useState(6);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        fetchAgents();
    }, [currentPage, searchTerm]); // Include searchTerm in dependencies

    const fetchAgents = async () => {
        try {
            const response = await axios.get('http://localhost:8036/api/agents');
            setAgents(response.data);
            setLoading(false);
        } catch (error) {
            console.error("There was an error fetching the agents!", error);
            setLoading(false);
        }
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
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
    

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase()); // Update search term state
    };

    const filteredAgents = agents.filter(agent =>
        (agent.nom && agent.nom.toLowerCase().includes(searchTerm)) ||
        (agent.cin && agent.cin.toLowerCase().includes(searchTerm)) ||
        (agent.adresse && agent.adresse.toLowerCase().includes(searchTerm)) ||
        (agent.telephone && agent.telephone.toLowerCase().includes(searchTerm))
    );
    

    const indexOfLastAgent = (currentPage + 1) * agentsPerPage;
    const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
    const currentAgents = filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);

    return (
        
    
    
        <div className="contaer mt-4">
        <Navbar/> 
            <div className="card">
                <div className="HHJ">
                    <h2 className="mb-0">List of Agents</h2>
                    <Link to="/add-agent-admin" className="btn btn-success">
                        Add Agent
                    </Link>
                </div>
               

                <div className="card-body">
                
                    <div className="input-container mb-4">
                        <input
                            type="text"
                            id="search"
                            placeholder="Search Agents..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <div className="underline"></div>
                        <img
                            src="https://img.icons8.com/ios-filled/50/000000/search.png"
                            alt="Search"
                            className="search-icon"
                        />
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th>CIN</th>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Phone</th>
                                        <th>Service</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentAgents.map((agent) => (
                                        <tr key={agent.id} className="table-row">
                                            <td>{agent.cin}</td>
                                            <td>{agent.nom}</td>
                                            <td>{agent.adresse}</td>
                                            <td>{agent.telephone}</td>
                                            <td>{agent.service ? agent.service.nom : 'No Service'}</td>
                                            <td>
                                                <Link to={`/edit-agent-admin/${agent.id}`} state={{ agent }}>
                                                    <img
                                                        src="https://img.icons8.com/?size=100&id=88584&format=png&color=000000"
                                                        alt="Edit"
                                                        className="icon-edit"
                                                    />
                                                </Link>
                                                <img
                                                    src="https://img.icons8.com/ios-filled/50/000000/delete-forever.png"
                                                    alt="Delete"
                                                    className="icon-delete ml-2"
                                                    onClick={() => handleDelete(agent.id)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                breakLabel={"..."}
                                pageCount={Math.ceil(filteredAgents.length / agentsPerPage)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link"}
                                activeClassName={"active"}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentList;
