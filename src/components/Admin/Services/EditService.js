import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditService.css'; // Import the custom CSS

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State variables for the service attributes
  const [nom, setNom] = useState('');
  const [sa, setSa] = useState('');
  const [site, setSite] = useState('');
  const [sigle, setSigle] = useState('');

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const response = await axios.get(`http://localhost:8036/api/services/${id}`);
      const { nom, sa, site, sigle } = response.data;
      setNom(nom);
      setSa(sa);
      setSite(site);
      setSigle(sigle);
    } catch (error) {
      console.error("There was an error fetching the service!", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8036/api/services/${id}`, { nom, sa, site, sigle });
      alert('Service updated successfully!');
      navigate('/serviceslist');
    } catch (error) {
      console.error("There was an error updating the service!", error);
    }
  };

  return (
    <div className="container">
      <h2>Edit Service</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nom">Service Name</label>
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
          <label htmlFor="sa">SA</label>
          <input
            type="text"
            className="form-control"
            id="sa"
            value={sa}
            onChange={(e) => setSa(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="site">Site</label>
          <input
            type="text"
            className="form-control"
            id="site"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sigle">Sigle</label>
          <input
            type="text"
            className="form-control"
            id="sigle"
            value={sigle}
            onChange={(e) => setSigle(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Update </button>
      </form>
    </div>
  );
};

export default EditService;
