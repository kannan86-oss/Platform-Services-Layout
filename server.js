
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'platform-services-secret-key';

app.use(cors());
app.use(bodyParser.json());

// Mock Database of Users (Simulating LDAP/AD)
const USERS = [
  { id: 'u1', username: 'admin', password: 'password123', name: 'Sarah Admin', email: 'sarah.admin@platform.com', role: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Sarah+Admin&background=0D8ABC&color=fff' },
  { id: 'u2', username: 'editor', password: 'password123', name: 'John Dev', email: 'john.dev@platform.com', role: 'Editor', avatar: 'https://ui-avatars.com/api/?name=John+Dev&background=random' },
  { id: 'u3', username: 'viewer', password: 'password123', name: 'Guest Viewer', email: 'guest@platform.com', role: 'Viewer', avatar: 'https://ui-avatars.com/api/?name=Guest+Viewer&background=random' }
];

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password, domain } = req.body;

  // Simulate AD Latency
  setTimeout(() => {
    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) {
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ 
        success: true, 
        token, 
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } 
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials or domain authentication failed.' });
    }
  }, 800);
});

// Logger Endpoint
app.post('/api/logs', (req, res) => {
  const { type, message, timestamp, userId } = req.body;
  console.log(`[${type.toUpperCase()}] ${timestamp} - User:${userId || 'Anon'} - ${message}`);
  res.status(200).send('Logged');
});

// Admin: Get All Users (RBAC)
app.get('/api/admin/users', (req, res) => {
  // Verify token middleware would go here
  res.json(USERS.map(({ password, ...user }) => user));
});

app.listen(PORT, () => {
  console.log(`Platform Services Auth Server running on http://localhost:${PORT}`);
});
