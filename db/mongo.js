require('dotenv').config();
const mongoose = require('mongoose');

function connectToDatabase() {
    const connectionString = process.env.MONGODB_URL;

    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const database = mongoose.connection;

    database.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    database.once('connected', () => {
        console.log('Connected to MongoDB');
    });
}

module.exports = connectToDatabase;
