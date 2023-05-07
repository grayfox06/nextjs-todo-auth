const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (req.secure || process.env.NODE_ENV === 'production')
    cookieOptions.secure = true;

  // Remove password from the output
  user.password = undefined;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    return next(new Error('Please provide email and password', 400));
  }
  // 2. Check if the user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new Error('Incorrect email or password'), 401);
  }

  // 3. If everything is ok, send the token to client
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', null, {
    expires: new Date(Date.now() - 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Getting token and checking if it exists
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    //Check if jwt is present in the cookies on the client-side
    token = req.cookies.jwt;
  }

  if (!token) return next(new Error('Please log in to get access.', 401));
  console.log(token);
  // 2. Verifying token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new Error('The user whom used this token no longer exists', 401)
    );

  // Grant access to protected route
  req.user = currentUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return next();
  if (token) {
    // 1. Verify the token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // 2. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next();

    // 3. Check if user changed password after the token was issued
    if (currentUser.changePasswordAfter(decoded.iat)) {
      return next();
    }

    // There is a logged in user; Each template has access to res.locals
    res.locals.user = currentUser;
    return next();
  }
});
