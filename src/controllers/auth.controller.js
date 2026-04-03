const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../utils/jwt');
const UserModel = require('../models/user.model');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    if (await UserModel.emailExists(email))        
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const newUser = await UserModel.create({ username, email, password: hashedPassword });

    return res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const user = await UserModel.findByEmail(email);
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isValid = await bcrypt.compare(String(password), user.password);
    if (!isValid)
      return res.status(400).json({ message: 'Invalid email or password' });

    if (user.status !== 'ACTIVE')
      return res.status(403).json({ message: 'User account is inactive' });

    const accessToken = generateAccessToken(user.id, user.role);
    
    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerUser, loginUser };