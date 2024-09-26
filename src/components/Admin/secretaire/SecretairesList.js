import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SecretairesList.css'; // Ensure the path is correct
import Navbar from '../Navbaar/Navbar';

const SecretairesList = () => {
  const [secretaires, setSecretaires] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8036/api/secretaires')
      .then(response => {
        setSecretaires(response.data);
      })
      .catch(error => {
        console.error('Il y a eu une erreur!', error);
      });
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-secretaire/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce secrétaire ?')) {
      axios.delete(`http://localhost:8036/api/secretaires/${id}`)
        .then(response => {
          setSecretaires(secretaires.filter(secretaire => secretaire.id !== id));
        })
        .catch(error => {
          console.error('Il y a eu une erreur lors de la suppression!', error);
        });
    }
  };

  const handleAdd = () => {
    navigate('/add-secretaire');
  };

  return (
    <div className="page">
      <Navbar/>
      <h1 className="white-text">Liste des Secrétaires</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>CIN</th>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Service</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {secretaires.map((secretaire) => (
            <tr key={secretaire.id}>
              <td>{secretaire.cin}</td>
              <td>{secretaire.nom}</td>
              <td>{secretaire.telephone}</td>
              <td>{secretaire.service ? secretaire.service.nom : 'Aucun'}</td>
              <td>
                <button className="btn-icon" onClick={() => handleEdit(secretaire.id)} aria-label="Edit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="bi bi-pencil"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.146.854a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708L9.707 8.854a.5.5 0 0 1-.183.1l-3.5.7a.5.5 0 0 1-.606-.606l.7-3.5a.5.5 0 0 1 .1-.183L12.146.854zM11.207 2l-1 1L6.854 5.207l-1 .2L5.207 6.854 9.5 4.146 11.207 2zM1 14s0-1 1-1h11s1 0 1 1v1H1v-1z" />
                  </svg>
                </button>
                <button className="btn-icon" onClick={() => handleDelete(secretaire.id)} aria-label="Delete">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 1a.5.5 0 0 1 .5.5V2h5v-.5a.5.5 0 0 1 1 0V2h1a.5.5 0 0 1 .5.5V3a.5.5 0 0 1-.5.5H1A.5.5 0 0 1 .5 3V2A.5.5 0 0 1 1 1h1v-.5a.5.5 0 0 1 .5-.5zm1.5 1a.5.5 0 0 1 .5.5v.5H5v-.5a.5.5 0 0 1 .5-.5zM1 4h14a.5.5 0 0 1 .5.5V13a.5.5 0 0 1-.5.5H1a.5.5 0 0 1-.5-.5V4.5A.5.5 0 0 1 1 4zm1 1v8h12V5H2z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btnnnnn" onClick={handleAdd}>
        Ajouter Secrétaire
      </button>
    </div>
  );
};

export default SecretairesList;
