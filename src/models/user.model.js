const {query}=require('../config/db');

const emailExists=async(email)=>{
    const{rows}=await query('SELECT 1 from users WHERE email=$1',[email]);
    return rows.length>0 || false;
}

const findByEmail=async(email)=>{
    const{rows}=await query('SELECT id,username,email,password,role,status FROM users WHERE email=$1',[email]);
    return rows[0] || null;
}

const create=async({username,email,password})=>{
    const{rows}=await query('INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id,username,email',[username,email,password]);
    return rows[0];
}

const findById = async (id) => {
  const { rows } = await query(
    'SELECT id, username, email, role, status, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

const findAll = async () => {
  const { rows } = await query(
    'SELECT id, username, email, role, status, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
};

const updateRole = async (id, role) => {
  const { rows } = await query(
    'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role',
    [role, id]
  );
  return rows[0];
};

const updateStatus = async (id, status) => {
  const { rows } = await query(
    'UPDATE users SET status = $1 WHERE id = $2 RETURNING id, username, email, status',
    [status, id]
  );
  return rows[0];
};

module.exports = { emailExists, findByEmail, create, findById, findAll, updateRole, updateStatus };