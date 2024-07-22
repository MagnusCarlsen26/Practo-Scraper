const express = require('express');
const fs = require('fs');

const app = express();


app.get('/data', (req, res) => {
    console.log(req)
    try {

        const { path } = req.query
        const filePath = `${path}`; 
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error reading JSON file');
            } else {
                res.json(JSON.parse(data));
            }
        });
    } catch (err) {
        console.log(err.message)
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
