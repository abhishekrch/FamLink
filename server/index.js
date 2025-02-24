require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false 
    }
});

    pool.connect()
    .then(client => {
        console.log('Connected to PostgreSQL database!');
        client.release(); 
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
        process.exit(1); 
    });

app.use(cors()); 
app.use(express.json()); 

app.use('/api/users', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});