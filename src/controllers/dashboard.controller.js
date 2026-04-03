const DashboardModel = require('../models/dashboard.model');

const getSummary = async (req, res) => {
  try {
    const summary = await DashboardModel.getSummary(req.user.id, req.user.role);
    return res.status(200).json({ data: summary });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getByCategory = async (req, res) => {
  try {
    const data = await DashboardModel.getByCategory(req.user.id, req.user.role);
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Dashboard category error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const data = await DashboardModel.getMonthlyTrends(req.user.id, req.user.role);
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Dashboard trends error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getRecent = async (req, res) => {
  try {
    const data = await DashboardModel.getRecent(req.user.id, req.user.role);
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Dashboard recent error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getSummary, getByCategory, getMonthlyTrends, getRecent };