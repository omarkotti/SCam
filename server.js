const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let users = [];

// Root URL route
app.get('/', (req, res) => {
    res.send('Welcome to the Free Fire Diamond Giveaway!');
});

app.post('/register', (req, res) => {
    const { username, email } = req.body;
    if (username && email) {
        users.push({ username, email });
        res.status(200).send('Registration successful');
    } else {
        res.status(400).send('Please fill in all fields');
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (user) {
        res.status(200).send('Login successful');
    } else {
        res.status(400).send('Invalid credentials');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
