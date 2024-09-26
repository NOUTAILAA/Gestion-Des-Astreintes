import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditSecretaire.css'; // Import the custom CSS

const EditSecretaire = () => {
  const { id } = useParams(); // Get the ID of the secretary from the URL
  const [secretaire, setSecretaire] = useState({
    cin: '',
    nom: '',
    telephone: '',
    service: '',
    mdp: '',
    confirmPassword: ''
  });
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8036/api/secretaires/${id}`)
      .then(response => {
        const secretaireData = response.data;
        setSecretaire({
          cin: secretaireData.cin,
          nom: secretaireData.nom,
          telephone: secretaireData.telephone,
          service: secretaireData.service ? secretaireData.service.id : '',
          mdp: '',
          confirmPassword: ''
        });
      })
      .catch(error => {
        console.error('Il y a eu une erreur!', error);
      });
  }, [id]);

  useEffect(() => {
    axios.get('http://localhost:8036/api/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error('Il y a eu une erreur!', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSecretaire({ ...secretaire, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (secretaire.mdp !== secretaire.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    axios.put(`http://localhost:8036/api/secretaires/${id}`, secretaire)
      .then(() => {
        navigate('/SecretairesList');
      })
      .catch(error => {
        console.error('Il y a eu une erreur!', error);
      });
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce secrétaire?')) {
      axios.delete(`http://localhost:8036/api/secretaires/${id}`)
        .then(() => {
          navigate('/SecretairesList');
        })
        .catch(error => {
          console.error('Il y a eu une erreur!', error);
        });
    }
  };

  return (
    <div className="container">
      <h2>Edit Secretary</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>CIN</label>
          <input
            type="text"
            className="form-control"
            name="cin"
            value={secretaire.cin || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="nom"
            value={secretaire.nom || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            className="form-control"
            name="telephone"
            value={secretaire.telephone || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Service</label>
          <select
            className="form-control"
            name="service"
            value={secretaire.service || ''}
            onChange={handleChange}
            required
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="mdp"
            value={secretaire.mdp || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={secretaire.confirmPassword || ''}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
        <button type="button" className="btn btn-danger ml-2" onClick={handleDelete}>Delete</button>
      </form>
    </div>
  );
};

export default EditSecretaire;
