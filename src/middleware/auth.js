const { verifyAccessToken } = require('../utils/jwt');
const UserModel = require('../models/user.model');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
        const user = await UserModel.findById(decoded.id);
    if (!user)
      return res.status(401).json({ message: 'User not found' });
    
    if (user.status !== 'ACTIVE')
      return res.status(403).json({ message: 'User account is inactive' });
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;