import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddAgent.css'; // Custom styles

const AddAgent = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize the navigate hook
    const { serviceId } = location.state || {}; // Get serviceId from location state
    const [agentData, setAgentData] = useState({
        nom: '',
        cin: '',
        telephone: '',
        email: '',
        adresse: '',
        mdp: '', // Password field
    });
    const [emailExists, setEmailExists] = useState(false); // State to track email existence

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAgentData({ ...agentData, [name]: value });
        
        // Reset emailExists when the email changes
        if (name === "email") {
            setEmailExists(false);
        }
    };

    const checkEmailExists = async (email) => {
        try {
            const response = await axios.get(`http://localhost:8036/api/agents/email/${email}`);
            return response.data.exists; // Assume the API returns { exists: true/false }
        } catch (error) {
            console.error("Error checking email:", error);
            return false; // Assume email doesn't exist if there's an error
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!serviceId) {
            alert("Service ID is required!");
            return;
        }
    
        // Check if email already exists
        const emailInUse = await checkEmailExists(agentData.email);
        if (emailInUse) {
            setEmailExists(true);
            alert("Cet e-mail est déjà utilisé. Veuillez en choisir un autre.");
            return;
        }
    
        try {
            const response = await axios.post(`http://localhost:8036/api/agents/service/${serviceId}`, agentData);
            console.log("Agent ajouté avec succès :", response.data);
            // Navigate to the NewAgents page after successful addition
            navigate('/NewAgents');
        } catch (error) {
            if (error.response) {
                alert(`Erreur : ${error.response.data.message || "Erreur lors de l'ajout de l'agent."}`);
            } else {
                alert("Erreur réseau. Veuillez réessayer.");
            }
            console.error("Erreur lors de l'ajout de l'agent :", error);
        }
    };
    

    return (
        <div className="container mt-4">
            <h2 className="text-center">Ajouter un agent</h2>
            <form onSubmit={handleSubmit} className="w-50 mx-auto">
                <div className="form-group">
                    <input 
                        type="text" 
                        name="nom" 
                        value={agentData.nom} 
                        onChange={handleChange} 
                        required 
                        className="form-control" 
                        placeholder="Nom" 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="cin" 
                        value={agentData.cin} 
                        onChange={handleChange} 
                        required 
                        className="form-control" 
                        placeholder="CIN" 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="telephone" 
                        value={agentData.telephone} 
                        onChange={handleChange} 
                        required 
                        className="form-control" 
                        placeholder="Téléphone" 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="email" 
                        name="email" 
                        value={agentData.email} 
                        onChange={handleChange} 
                        required 
                        className="form-control" 
                        placeholder="E-mail" 
                    />
                    {emailExists && <div className="text-danger">Cet e-mail est déjà utilisé.</div>}
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="adresse" 
                        value={agentData.adresse} 
                        onChange={handleChange} 
                        required 
                        className="form-control" 
                        placeholder="Adresse" 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="password" 
                        name="mdp" 
                        value={agentData.mdp} 
                        onChange={handleChange} 
                        required 
                        className="form-control" 
                        placeholder="Mot de passe" 
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Ajouter </button>
            </form>
        </div>
    );
};

export default AddAgent;