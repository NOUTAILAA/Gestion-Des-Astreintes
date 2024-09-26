import React from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ManualPlanningForm from './components/Admin/traitement/ManualPlanningForm';
import AutoPlanningForm from './components/Admin/traitement/AutoPlanningForm';
import Login from './components/Login';
import Home from './components/Home';
import './style.css'; // Importez le fichier style.css ici
import EditAgentPourAdmin from './components/Admin/Agents/EditAgent';
import AdminAgentsList from './components/Admin/Agents/AgentsList';
import AddAgentAdmin from './components/Admin/Agents/AddAgent';
import SecretairesList from './components/Admin/secretaire/SecretairesList';
import EditSecretaire from './components/Admin/secretaire/EditSecretaire';
import NewAgents from './components/Secretaire2/Agents';
import EditAgents2 from './components/Secretaire2/EditAgents';
import LatestPlanningsAgents from './components/HomeAgents/LatestPlannings';
import CreatePlanningPage from './components/Secretaire2/Createplanning';
import AddSecretaire from './components/Admin/secretaire/AddSecretaire';
import AddAgentTT from './components/Secretaire2/AddAgent';
import ServicesList from './components/Admin/Services/ServicesList';
import AddService from './components/Admin/Services/AddService';
import EditService from './components/Admin/Services/EditService';

import AutoPlanning from './components/Secretaire2/AutoPlanning';
import ManualPlanning from './components/Secretaire2/Createplanning';
const App = () => {
    return (
        <Router>
            <Main />
        </Router>
    );
};

const Main = () => {

    return (
        <div>
           
            <Routes>
                <Route path="/manual-planningg" element={<ManualPlanningForm />} />
                <Route path="/auto-planningg" element={<AutoPlanningForm />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/edit-agent-admin/:id" element={<EditAgentPourAdmin />} />
                <Route path="/agents-admin" element={<AdminAgentsList />} />
                <Route path="/add-agent-admin" element={<AddAgentAdmin />} />
                <Route path="/SecretairesList" element={<SecretairesList />} />
                <Route path="/edit-secretaire/:id" element={<EditSecretaire />} />
                <Route path="/add-secretaire" element={<AddSecretaire/>} />
                <Route path="/Newagents" element={<NewAgents />} />
                <Route path="/neweditagent/:id" element={<EditAgents2 />} />
                <Route path="/latest" element={<LatestPlanningsAgents />} />
                <Route path="/createplanning" element={<CreatePlanningPage />} />
<Route path='/add-agenttt'  element={<AddAgentTT />} />
            <Route path='/servicesList' element={<ServicesList  />} />
            <Route path='/add-service' element={<AddService />} />  
            <Route  path='/edit-service/:id' element={<EditService />} />
           
            <Route  path='/manualPlanning' element={<ManualPlanning />} />
            <Route path="/autoPlanning" element={<AutoPlanning />} />





           
            </Routes>
        </div>
    );
};


export default App;
