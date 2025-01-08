import 'dotenv/config'; // Replaces `require('dotenv').config();`
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // For handling __dirname
import { nanoid } from 'nanoid';
import { createApp, runApp } from './www/www.js'; // Ensure file extension is included for ESM
import connectToDatabase from './db/mongo.js';
import Url from './model/Url.js';

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectToDatabase();

// Create an Express app
const app = createApp();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.get('/', (req, res) => {
    res.render('index', { title: 'URL Shortener', shortUrl: null, error: null });
});

app.post('/url_short', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.render('index', {
                title: 'URL Shortener',
                shortUrl: null,
                error: 'Please provide a valid URL',
            });
        }

        const shortCode = nanoid(6);
        const newUrl = new Url({ url, shortUrl: shortCode });
        await newUrl.save();

        res.render('index', {
            title: 'URL Shortener',
            shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
            error: null,
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).render('index', {
            title: 'URL Shortener',
            shortUrl: null,
            error: 'Internal Server Error',
        });
    }
});

app.get('/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const urlData = await Url.findOne({ shortUrl });

        if (!urlData) {
            return res.status(404).send('Invalid URL');
        }

        res.redirect(urlData.url);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Run the server
runApp(app);
