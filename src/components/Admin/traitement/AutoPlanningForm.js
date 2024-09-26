import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import Navbar from '../Navbaar/Navbar';
import './AutoPlanningForm.css'; // Import the CSS file

const AutoPlanningForm = () => {
    const [services, setServices] = useState([]);
    const [serviceId, setServiceId] = useState('');
    const [date, setDate] = useState('');
    const [planning, setPlanning] = useState(null);
    const [error, setError] = useState(null);
    const [pdfData, setPdfData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8036/api/services')
            .then(response => {
                setServices(response.data);
            })
            .catch(error => {
                console.error('Error fetching services:', error);
                setError('There was an error fetching the services.');
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:8036/api/plannings/create', null, {
            params: {
                serviceId: serviceId,
                date: date,
            }
        })
        .then(response => {
            console.log('API Response:', response.data);
            setPlanning(response.data);
            setError(null);
            generatePdf(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
            setError('There was an error creating the planning!');
            setPlanning(null);
        });
    };

    const generatePdf = (planningData) => {
        const doc = new jsPDF();
        const pdfContent = `
            Planning ID: ${planningData.id}
            Date: ${planningData.date}
            Service Name: ${planningData.service && planningData.service.nom ? planningData.service.nom : 'No name'}
            Agents: ${planningData.agents && planningData.agents.length > 0 ? planningData.agents.map(agent => agent.nom).join(', ') : 'No agents available'}
        `;
        doc.text(pdfContent, 10, 10);
        const pdfBlob = doc.output('blob');
        setPdfData(pdfBlob);
    };

    const handleDownloadPdf = () => {
        if (pdfData) {
            const url = URL.createObjectURL(pdfData);
            const link = document.createElement('a');
            link.href = url;
            link.download = `planning_${planning.id}.pdf`;
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
        }
    };

    return (
        <div className="auto-planning-form">
            <Navbar />
            <div className="containe3r">
                <h1 className="hjhj">Automatic Planning</h1>
                <form onSubmit={handleSubmit} className="planning-form">
                    <div className="form-group">
                        <label htmlFor="service">Service</label>
                        <select 
                            id="service"
                            value={serviceId} 
                            onChange={(e) => setServiceId(e.target.value)} 
                            required
                        >
                            <option value="">Select a Service</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>{service.nom}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input 
                            type="date" 
                            id="date"
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="submit-button">Create Planning</button>
                </form>

                {error && <p className="error-message">{error}</p>}

                {planning && (
                    <div className="planning-details">
                        <h2 className="details-title">Planning Details</h2>
                        <div className="details-card">
                            <p><strong>ID:</strong> {planning.id}</p>
                            <p><strong>Date:</strong> {planning.date}</p>
                            <p><strong>Service Name:</strong> {planning.service && planning.service.nom ? planning.service.nom : 'No name'}</p>
                            <p><strong>Agents:</strong> 
                                {planning.agents && planning.agents.length > 0 ? (
                                    planning.agents.map(agent => (
                                        <span key={agent.id} className="agent-name">{agent.nom} </span>
                                    ))
                                ) : (
                                    'No agents available'
                                )}
                            </p>
                            <button onClick={handleDownloadPdf} className="download-button">Download PDF</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AutoPlanningForm;
