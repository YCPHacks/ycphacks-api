const express = require('express');
const router = express.Router();
const {User} = require('../repository/config/Models');

const {
    createUser,
    loginUser,
    loginAdminUser,
    authWithToken,
    getAllUsers
} = require('../controllers/UserController')

router.post('/register', createUser)

router.post('/login', loginUser)

router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    // Generate JWT or session
    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err); // <-- this will show the real cause
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/auth', authWithToken)

router.get('/all', getAllUsers)

module.exports = router;