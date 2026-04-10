const express = require('express');
const connectDB = require('./DB/ConnectDB.js');
const upload = require('./Middleware/upload.js');

// Controllers 
const loginSignUp = require('./Controllers/SingupLogin.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Connect DB
connectDB();

const PORT = 3030;

app.get('/', (req, res) => {
    res.send('Hello ConnectiFy !');
});

// All Routes
app.post('/user/signup', upload.single('profileImage'), loginSignUp.signUp)

app.listen(PORT, () => {
    console.log(`Server Running On the http://localhost:${PORT}`);
});