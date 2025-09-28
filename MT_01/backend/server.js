const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT ||5000;

const routes = require('./routes/routes.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI)
    .then(() => { 
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch(error => console.error('MongoDB connection error:', error));

