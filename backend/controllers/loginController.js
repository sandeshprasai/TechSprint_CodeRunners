const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/userModel');

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Invalid email or password',
        data: null,
      });
    }

    // 2. Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Invalid email or password',
        data: null,
      });
    }

    // 3. Create JWT payload
    const payload = {
      userId: user._id,
      role: user.role,
    };

    // 4. Generate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // 5. Store token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 6. Send response
    return res.status(200).json({
      statusCode: 200,
      message: 'Login successful',
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

module.exports = {
  loginController,
};
