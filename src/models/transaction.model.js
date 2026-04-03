const { query } = require('../config/db');

const create = async ({ user_id, amount, type, category, date, notes }) => {
  const { rows } = await query(
    `INSERT INTO transactions (user_id, amount, type, category, date, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [user_id, amount, type, category, date, notes]
  );
  return rows[0];
};

const findAll = async ({ type, category, from, to, page = 1, limit = 20 }) => {
  const conditions = [];
  const params = [];
  let i = 1;

  conditions.push(`deleted_at IS NULL`);

  if (type) {
    conditions.push(`type = $${i++}`);
    params.push(type);
  }
  if (category) {
    conditions.push(`category = $${i++}`);
    params.push(category);
  }
  if (from) {
    conditions.push(`date >= $${i++}`);
    params.push(from);
  }
  if (to) {
    conditions.push(`date <= $${i++}`);
    params.push(to);
  }

  const where  = `WHERE ${conditions.join(' AND ')}`;
  const offset = (page - 1) * limit;

  const { rows } = await query(
    `SELECT * FROM transactions ${where} ORDER BY date DESC LIMIT $${i++} OFFSET $${i++}`,
    [...params, limit, offset]
  );
  return rows;
};

const findById = async (id) => {
  const { rows } = await query(
    `SELECT * FROM transactions WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  );
  return rows[0] || null;
};

const update = async (id, { amount, type, category, date, notes }) => {
  const { rows } = await query(
    `UPDATE transactions
     SET amount=$1, type=$2, category=$3, date=$4, notes=$5, updated_at=NOW()
     WHERE id=$6 AND deleted_at IS NULL
     RETURNING *`,
    [amount, type, category, date, notes, id]
  );
  return rows[0];
};

const remove = async (id) => {
  await query(
    `UPDATE transactions SET deleted_at = NOW() WHERE id = $1`,
    [id]
  );
};

module.exports = { create, findAll, findById, update, remove };