const express = require('express');

function createApp() {
    const app = express();
    return app;
}

function runApp(app) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

module.exports = { createApp, runApp };
