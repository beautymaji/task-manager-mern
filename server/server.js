const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();


connectDB();


app.use(helmet()); 


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true 
}));


app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));