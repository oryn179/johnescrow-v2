const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Models
const User = require('./models/User');
const Transaction = require('./models/Transaction');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

// Admin Middleware
const adminAuth = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  
  // Hardcoded Admin Check logic as requested
  if (req.user.email === 'JohnAdmin@John.escrow') {
     next();
  } else {
     const user = await User.findById(req.user.id);
     if (user && user.role === 'ADMIN') {
       next();
     } else {
       res.status(403).json({ message: 'Access denied: Admins only' });
     }
  }
};

// --- Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'USER'
    });

    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name, email, role: 'USER' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Hardcoded Admin Login Check
  if (email === "JohnAdmin@John.escrow" && password === "JOHN-Imade-this=with=25stars-only!@") {
     const token = jwt.sign({ id: 'admin_id', role: 'ADMIN', email }, process.env.JWT_SECRET, { expiresIn: '1d' });
     return res.json({ token, user: { id: 'admin_id', name: 'John Admin', email, role: 'ADMIN' } });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (user.isBanned) return res.status(403).json({ message: 'Account is banned' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Profile
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Transaction
app.post('/api/transactions', auth, async (req, res) => {
  try {
    const newTx = new Transaction({
      ...req.body,
      createdBy: req.user.id
    });
    const tx = await newTx.save();
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get My Transactions
app.get('/api/transactions', auth, async (req, res) => {
  try {
    const txs = await Transaction.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Admin Routes ---

// Get All Users
app.get('/api/admin/users', [auth, adminAuth], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle Ban
app.put('/api/admin/users/:id/ban', [auth, adminAuth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isBanned = !user.isBanned;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Transactions
app.get('/api/admin/transactions', [auth, adminAuth], async (req, res) => {
  try {
    const txs = await Transaction.find().sort({ createdAt: -1 });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Transaction Status
app.put('/api/admin/transactions/:id/status', [auth, adminAuth], async (req, res) => {
  try {
    const { status } = req.body;
    const tx = await Transaction.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));