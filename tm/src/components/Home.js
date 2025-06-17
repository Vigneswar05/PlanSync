import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <div className="hero">
          <h1>Welcome to <span>PlanSync</span></h1>
          <p>Organize your day, stay focused, and track your progress — all in one place.</p>
          <div className="buttons">
            <Link to="/login">
              <button className="primary-btn">Login</button>
            </Link>
          </div>
        </div>

        <div className="features">
          <h2>Why Choose PlanSync?</h2>
          <ul>
            <li><strong>✅ Clear & Simple Dashboard:</strong> Manage all your tasks effortlessly.</li>
            <li><strong>🔐 Secure & Private:</strong> Your tasks, your control — always protected.</li>
            <li><strong>🧠 Smart Filters:</strong> View tasks by status, due date, or keywords.</li>
            <li><strong>📊 Track Progress:</strong> Visualize your productivity and completed goals.</li>
          </ul>
        </div>

        <div className="cta">
          <h3>Start syncing your goals today</h3>
          <Link to="/register">
            <button className="primary-btn">Create Free Account</button>
          </Link>
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Plan Sync. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
