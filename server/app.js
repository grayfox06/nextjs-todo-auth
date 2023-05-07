const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes');
const todoRouter = require('./routes/todoRoutes');

const app = express();

// MIDDLEWARE

// Develepoment logging
if (process.env.NODE_ENV === 'development') app.use(morgan('tiny'));

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
// Required for submiting forms via url
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Cookie Parser
app.use(cookieParser());

// ROUTES
// API routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/todos', todoRouter);

module.exports = app;
