import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServicesList.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbaar/Navbar';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:8036/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('There was an error fetching the services!', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8036/api/services/${id}`);
      // Update the state to remove the deleted service from the list
      setServices(services.filter((service) => service.id !== id));
    } catch (error) {
      console.error('There was an error deleting the service!', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-service/${id}`); // Replace history.push with navigate
  };

  return (
    <div>
      <Navbar />
      <h1 className="white-text">List of Services</h1>
      
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>SA</th>
            <th>SITE</th>
            <th>SIGLE</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.nom}</td>
              <td>{service.sa}</td>
              <td>{service.site}</td>
              <td>{service.sigle}</td>
              <td>
                <button
                  onClick={() => handleEdit(service.id)}
                  className="btn-icon"
                  aria-label="Edit"
                >
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
                <button
                  onClick={() => handleDelete(service.id)}
                  className="btn-icon"
                  aria-label="Delete"
                >
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
      <Link to="/add-service" className="btttn">
        Add Service
      </Link>
    </div>
  );
};

export default ServicesList;
