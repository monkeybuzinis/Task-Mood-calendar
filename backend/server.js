const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const moodRoutes = require('./routes/moods');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/task-calendar', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/moods', moodRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
