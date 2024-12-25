require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://Jramoffi:Jram20030517@cluster0.yfxgi0a.mongodb.net/images", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('MongoDB connected'));

// Routes
app.use('/api', imageRoutes);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
