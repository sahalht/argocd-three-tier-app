import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      handleLogout();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container dashboard">
      <h1 className="welcome">Welcome to Company Dashboard</h1>

      <div className="user-info">
        <h3>User Information</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
      </div>

      <div className="dashboard-content">
        <h3>Quick Stats</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '150px', background: '#e3f2fd', padding: '1rem', borderRadius: '8px' }}>
            <h4>Projects</h4>
            <p style={{ fontSize: '2rem', margin: 0 }}>12</p>
          </div>
          <div style={{ flex: 1, minWidth: '150px', background: '#f3e5f5', padding: '1rem', borderRadius: '8px' }}>
            <h4>Tasks</h4>
            <p style={{ fontSize: '2rem', margin: 0 }}>8</p>
          </div>
          <div style={{ flex: 1, minWidth: '150px', background: '#e8f5e8', padding: '1rem', borderRadius: '8px' }}>
            <h4>Team</h4>
            <p style={{ fontSize: '2rem', margin: 0 }}>24</p>
          </div>
        </div>
      </div>

      <button className="btn logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

