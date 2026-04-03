const express = require('express');
const authRoutes = require('./src/routes/auth.routes');
const transactionRoutes = require('./src/routes/transaction.routes');
const userRoutes=require('./src/routes/user.routes');
const dashboardRoutes=require('./src/routes/dashboard.routes')
const rateLimit = require('express-rate-limit');
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  
  max: 100,                  
  message: { message: 'Too many requests, please try again later' }
});
app.use(express.json());
app.use(limiter);

app.use('/api/auth',authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users',userRoutes);       
app.use('/api/dashboard',dashboardRoutes); 
module.exports = app;