import React, { useState } from "react";
import './Register.css';
import axios from 'axios';
import { Link} from 'react-router-dom';
import Logo from './logo.png';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
   

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5001/register", {
                name,
                email,
                password
            });
            alert(response.data.message);

            setName("");
            setEmail("");
            setPassword("");

            // Optional: Redirect to login page after success
            // navigate("/login");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("An error occurred");
                console.error(error);
            }
        }
    };

    return (
        <div className="register-main">
            <header className="dashboard-header">
                <div className="left">
                    <img src={Logo} className="logo" alt="Logo" />
                    <h3><i>Plan Sync</i></h3>
                </div>
                <div className="right">
                    <Link to="/login">
                        <button className="logout-btn">Login</button>
                    </Link>
                </div>
            </header>

            <form className="register-Form" onSubmit={handleSubmit}>
                <fieldset>
                    <div className="field">
                        <label htmlFor="username">User Name:</label>
                        <input
                            id="username"
                            type="text"
                            name="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn" type="submit">Submit</button>
                </fieldset>
            </form>
            <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Plan Sync. All rights reserved.</p>
    </footer>
        </div>
    );
};

export default Register;
