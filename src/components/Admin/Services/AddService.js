import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddService.css'; // Import the custom CSS

const AddService = () => {
  const [nom, setNom] = useState('');
  const [sa, setSa] = useState('');
  const [site, setSite] = useState('');
  const [sigle, setSigle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8036/api/services', { nom, sa, site, sigle });
      alert('Service added successfully!');
      setNom('');
      setSa('');
      setSite('');
      setSigle('');
      navigate('/serviceslist');
    } catch (error) {
      console.error("There was an error adding the service!", error);
    }
  };

  return (
    <div className="container">
      <h2>Add a New Service</h2>
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
        <button type="submit" className="btn btn-primary">Add Service</button>
      </form>
    </div>
  );
};

export default AddService;
