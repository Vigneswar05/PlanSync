import React, { useEffect, useState } from "react";
import Logo from './logo.png';
import './Main.css';
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const Main = () => {
    const [showForm, setShowForm] = useState(false);
    const [status, setStatus] = useState("not_completed");
    const [title, setTitle] = useState("");
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [originalTitle, setOriginalTitle] = useState("");

    const userEmail = localStorage.getItem('userEmail');

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:5001/main");
            const userTasks = response.data.filter(task => task.userEmail === userEmail);
            setTasks(userTasks);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        if (!userEmail) {
            window.location.href = "/login";
        }
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editMode) {
                const response = await axios.put(`http://localhost:5001/main/${originalTitle}`, {
                    newTitle: title,
                    task,
                    status,
                    userEmail
                });
                alert(response.data.message);
            } else {
                const response = await axios.post("http://localhost:5001/main", {
                    userEmail,
                    title,
                    task,
                    status
                });
                alert(response.data.message);
            }

            setTask("");
            setTitle("");
            setStatus("not_completed");
            setEditMode(false);
            setShowForm(false);
            setSelectedTask(null);
            fetchData();
        } catch (error) {
            console.error("Submit error:", error);
            alert(error?.response?.data?.message || "An error occurred");
        }
    };

    const handleTaskClick = (t) => {
        setSelectedTask(t);
        setTitle(t.title);
        setTask(t.task);
        setStatus(t.status);
        setOriginalTitle(t.title);
    };

    const handleEditClick = (t) => {
        setSelectedTask(t);
        setTitle(t.title);
        setTask(t.task);
        setStatus(t.status);
        setOriginalTitle(t.title);
        setEditMode(true);
        setShowForm(true);
    };

    const handleDeleteClick = async (t) => {
        if (window.confirm(`Do you want to delete ${t.title}?`)) {
            const response = await axios.delete(`http://localhost:5001/main/${t.title}`);
            alert(response.data.message);
            setSelectedTask(null);
            fetchData();
        }
    };

    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const notCompletedCount = tasks.filter(t => t.status === 'not_completed').length;

    const data = [
        { name: 'Completed', Tasks: completedCount },
        { name: 'Not Completed', Tasks: notCompletedCount },
    ];

    return (
        <div className="dashboard-main">
            <header className="dashboard-header">
                <div className="left">
                    <img src={Logo} className="logo" alt="Logo" />
                    <h3><i>Plan Sync</i></h3>
                </div>
                <div className="right">
                    <button
                        className="logout-btn"
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditMode(false);
                            setTitle("");
                            setTask("");
                            setStatus("not_completed");
                        }}
                    >
                        +
                    </button>
                    <button
                        className="logout-btn"
                        onClick={() => {
                            localStorage.removeItem('userEmail');
                            window.location.href = '/login';
                        }}
                    >
                        LogOut
                    </button>
                </div>
            </header>

            <div className="dashboard-body">
                <div className="side-bar">
                    <h4>Your Tasks</h4>
                    {tasks.map((t, index) => (
                        <button key={index} onClick={() => handleTaskClick(t)} className="dashboard-btn">
                            {t.title}
                        </button>
                    ))}
                </div>

                <div className="content">
                    
                    {showForm && (
                        <form onSubmit={handleSubmit} className="Form">
                            <fieldset>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        required
                                    />
                                    <textarea
                                        placeholder="Enter your tasks"
                                        value={task}
                                        onChange={e => setTask(e.target.value)}
                                        required
                                    />
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name="status"
                                                value="completed"
                                                checked={status === "completed"}
                                                onChange={e => setStatus(e.target.value)}
                                            />
                                            Completed
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="status"
                                                value="not_completed"
                                                checked={status === "not_completed"}
                                                onChange={e => setStatus(e.target.value)}
                                            />
                                            Not Completed
                                        </label>
                                    </div>
                                    <button className="dashboard-btn" type="submit">
                                        {editMode ? "Update Task" : "Save Task"}
                                    </button>
                                </div>
                            </fieldset>
                        </form>
                    )}

                    {selectedTask && !showForm && (
                        <div className="task-details">
                            <h3>{selectedTask.title}</h3>
                            <p>{selectedTask.task}</p>
                            <p>Status: {selectedTask.status}</p>
                            <div className="btns">
                                <button onClick={() => handleEditClick(selectedTask)} className="dashboard-btn">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteClick(selectedTask)} className="dashboard-btn">
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="analysis-panel">
                        <h4>Task Analysis</h4>
                        <BarChart width={400} height={250} data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Tasks" fill="#8884d8" />
                        </BarChart>
                    </div>

                </div>
            </div>
            <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Plan Sync. All rights reserved.</p>
    </footer>
        </div>
    );
};

export default Main;
