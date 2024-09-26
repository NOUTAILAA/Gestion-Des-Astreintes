import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddSecretaire.css'; // Import the custom CSS

const AddSecretaire = () => {
  const [cin, setCin] = useState('');
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [mdp, setMdp] = useState('');
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8036/api/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error('Il y a eu une erreur lors de la récupération des services!', error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const newSecretaire = {
      cin,
      nom,
      adresse,
      telephone,
      mdp,
      service: { id: selectedServiceId }
    };
    
    axios.post('http://localhost:8036/api/secretaires', newSecretaire)
      .then(response => {
        navigate('/SecretairesList');
      })
      .catch(error => {
        console.error('Il y a eu une erreur!', error);
      });
  };

  return (
    <div className="container">
      <h2>Ajouter un Secrétaire</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cin">CIN</label>
          <input
            type="text"
            className="form-control"
            id="cin"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            className="form-control"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="adresse">Adresse</label>
          <input
            type="text"
            className="form-control"
            id="adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="telephone">Téléphone</label>
          <input
            type="text"
            className="form-control"
            id="telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mdp">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="mdp"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="service">Service</label>
          <select
            className="form-control"
            id="service"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            required
          >
            <option value="">Sélectionner un service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.nom}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success mt-3">Ajouter</button>
      </form>
    </div>
  );
};

export default AddSecretaire;
