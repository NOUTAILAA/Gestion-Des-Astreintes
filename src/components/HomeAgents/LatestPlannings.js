import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import for table support
import './LatestPlanning.css'; // Importer le fichier CSS

const LatestPlanningsTable = () => {
    const [plannings, setPlannings] = useState({});

    useEffect(() => {
        // Fetch the latest plannings from the API
        axios.get('http://localhost:8036/api/plannings/latest')
            .then(response => {
                setPlannings(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the plannings!', error);
            });
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["Service ID", "Service Name", "Date", "Agents"];
        const tableRows = [];

        Object.entries(plannings).forEach(([serviceKey, planning]) => {
            const agents = planning.agents.map(agent => agent.nom).join(", ");
            tableRows.push([
                planning.service.id,
                planning.service.nom,
                planning.date,
                agents || 'No agents assigned'
            ]);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.save('latest-plannings.pdf');
    };

    return (
        <div className="latest-plannings-wrapper">
            <Navbar />
            
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Service ID</th>
                        <th>Service Name</th>
                        <th>Date</th>
                        <th>Agents</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(plannings).map(([serviceKey, planning]) => (
                        <tr key={serviceKey}>
                            <td>{planning.service.id}</td>
                            <td>{planning.service.nom}</td>
                            <td>{planning.date}</td>
                            <td>
                                {planning.agents.length > 0 ? (
                                    <ul>
                                        {planning.agents.map(agent => (
                                            <li key={agent.id}>{agent.nom}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>No agents assigned</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={generatePDF} className="btnnn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
            </button>
        </div>
    );
};

export default LatestPlanningsTable;
