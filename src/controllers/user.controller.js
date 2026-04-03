const UserModel = require('../models/user.model');

const VALID_ROLES   = ['VIEWER', 'ANALYST', 'ADMIN'];
const VALID_STATUSES = ['ACTIVE', 'INACTIVE'];

const getAll = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    return res.status(200).json({ data: users });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !VALID_ROLES.includes(role)){
      return res.status(400).json({ message: `Role must be one of: ${VALID_ROLES.join(', ')}` });
    }

    const user = await UserModel.updateRole(req.params.id, role);
    if (!user){
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Role updated', data: user });
  } catch (error) {
    console.error('Update role error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)){
      return res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const user = await UserModel.updateStatus(req.params.id, status);
    if (!user){
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Status updated', data: user });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAll, updateRole, updateStatus };