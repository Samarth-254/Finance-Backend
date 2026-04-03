const TransactionModel = require('../models/transaction.model');

const create = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category || !date){
      return res.status(400).json({ message: 'amount, type, category, date are required' });
    }
    if (!['INCOME', 'EXPENSE'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either INCOME or EXPENSE' });
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ message: 'Date must be in YYYY-MM-DD format' });
    }
    if (typeof category !== 'string' || category.trim().length === 0 || category.length > 100) {
      return res.status(400).json({ message: 'Category must be a non-empty string (max 100 characters)' });
    }

    const tx = await TransactionModel.create({
      user_id: req.user.id,
      amount: parsedAmount, 
      type, 
      category: category.trim(), 
      date, 
      notes
    });

    return res.status(201).json({ message: 'Transaction created', data: tx });
  } catch (error) {
    console.error('Create transaction error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const txs = await TransactionModel.findAll(req.query);
    return res.status(200).json({ data: txs });
  } catch (error) {
    console.error('Get transactions error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const update = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const existing = await TransactionModel.findById(req.params.id);
    if (!existing){
      return res.status(404).json({ message: 'Transaction not found' });
    }

     if (existing.user_id !== req.user.id && req.user.role !== 'ADMIN'){
      return res.status(403).json({ message: 'Forbidden: not your transaction' });
     }
    if (type && !['INCOME', 'EXPENSE'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either INCOME or EXPENSE' });
    }
    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
      }
    }
    if (date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ message: 'Date must be in YYYY-MM-DD format' });
      }
    }
    if (category !== undefined) {
      if (typeof category !== 'string' || category.trim().length === 0 || category.length > 100) {
        return res.status(400).json({ message: 'Category must be a non-empty string (max 100 characters)' });
      }
    }

    const updated = await TransactionModel.update(req.params.id, {
      amount: amount !== undefined ? parseFloat(amount) : undefined, 
      type, 
      category: category ? category.trim() : undefined, 
      date, 
      notes
    });

    return res.status(200).json({ message: 'Transaction updated', data: updated });
  } catch (error) {
    console.error('Update transaction error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const remove = async (req, res) => {
  try {
    const existing = await TransactionModel.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ message: 'Transaction not found' });

     if (existing.user_id !== req.user.id && req.user.role !== 'ADMIN'){
      return res.status(403).json({ message: 'Forbidden: not your transaction' });
     }

    await TransactionModel.remove(req.params.id);
    return res.status(200).json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { create, getAll, update, remove };