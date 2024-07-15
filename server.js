const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection (example with Mongoose)
mongoose.connect('mongodb://localhost:27017/diamondsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User = mongoose.model('User', { userId: String, diamonds: Number });

// Route to give diamonds
app.post('/give-diamonds', async (req, res) => {
  const { userId, diamonds } = req.body;

  try {
    let user = await User.findOne({ userId });

    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({ userId, diamonds });
    } else {
      // Update user's diamond count
      user.diamonds += diamonds;
    }

    // Save user to database
    await user.save();

    // Respond with success message
    res.json({ success: true, message: `Gave ${diamonds} diamonds to user ${userId}` });
  } catch (error) {
    console.error('Error giving diamonds:', error);
    res.status(500).json({ success: false, message: 'Failed to give diamonds' });
  }
});

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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
