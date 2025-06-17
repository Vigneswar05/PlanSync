// server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User.js');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.error("MongoDB connection error:", err));

// Register
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(200).json({ message: "Registered Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ email }, 'access', { expiresIn: '1h' });
        res.status(200).json({ message: "Success", token });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err });
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err });
    }
});

// Create task
app.post('/main', async (req, res) => {
    const { userEmail, title, task, status } = req.body;
    if (!userEmail || !title || !task || !status) {
        return res.status(400).json({ message: "Missing fields" });
    }
    try {
        const newTask = new Task({ userEmail, title, task, status });
        await newTask.save();
        res.status(200).json({ message: "Task saved successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error saving task", error: err });
    }
});

// Get all tasks
app.get('/main', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Error fetching tasks", error: err });
    }
});

// Update task by title
app.put('/main/:title', async (req, res) => {
    const { title } = req.params;
    const { newTitle, task, status } = req.body;
    try {
        const updated = await Task.updateOne(
            { title },
            { title: newTitle || title, task, status }
        );
        if (updated.modifiedCount === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating task", error: err });
    }
});

// Delete task by title
app.delete('/main/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const deleted = await Task.deleteOne({ title });
        if (deleted.deletedCount === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting task", error: err });
    }
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
