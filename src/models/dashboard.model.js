const { query } = require('../config/db');

const getSummary = async (userId, role) => {
  const params = role === 'ADMIN' ? [] : [userId];
  const userFilter = role === 'ADMIN' ? '' : 'AND user_id = $1';

  const { rows } = await query(`
    SELECT
      COALESCE(SUM(amount) FILTER (WHERE type = 'INCOME'),  0) AS total_income,
      COALESCE(SUM(amount) FILTER (WHERE type = 'EXPENSE'), 0) AS total_expenses,
      COALESCE(SUM(amount) FILTER (WHERE type = 'INCOME'),  0)
        - COALESCE(SUM(amount) FILTER (WHERE type = 'EXPENSE'), 0) AS net_balance
    FROM transactions
    WHERE deleted_at IS NULL ${userFilter}
  `, params);
  return rows[0];
};

const getByCategory = async (userId, role) => {
  const params = role === 'ADMIN' ? [] : [userId];
  const userFilter = role === 'ADMIN' ? '' : 'AND user_id = $1';

  const { rows } = await query(`
    SELECT category, type, SUM(amount) AS total
    FROM transactions
    WHERE deleted_at IS NULL ${userFilter}
    GROUP BY category, type
    ORDER BY total DESC
  `, params);
  return rows;
};

const getMonthlyTrends = async (userId, role) => {
  const params = role === 'ADMIN' ? [] : [userId];
  const userFilter = role === 'ADMIN' ? '' : 'AND user_id = $1';

  const { rows } = await query(`
    SELECT
      TO_CHAR(date, 'YYYY-MM') AS month,
      type,
      SUM(amount) AS total
    FROM transactions
    WHERE deleted_at IS NULL ${userFilter}
    GROUP BY month, type
    ORDER BY month DESC
    LIMIT 12
  `, params);
  return rows;
};

const getRecent = async (userId, role) => {
  const params = role === 'ADMIN' ? [] : [userId];
  const userFilter = role === 'ADMIN' ? '' : 'AND user_id = $1';

  const { rows } = await query(`
    SELECT * FROM transactions
    WHERE deleted_at IS NULL ${userFilter}
    ORDER BY created_at DESC
    LIMIT 5
  `, params);
  return rows;
};

module.exports = { getSummary, getByCategory, getMonthlyTrends, getRecent };