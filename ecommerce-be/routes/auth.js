const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const express = require('express');
const router = express.Router();
const User = mongoose.model("User");
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/authMiddleware');


// User Sign-up
router.post('/signup', (req, res) => {
  const { username, mobile, email, password } = req.body;

  if (!username || !mobile || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  User.findOne({ email: email })
      .then((existingUser) => {
          if (existingUser) {
              return res.status(400).json({ error: 'User already exists with this email' });
          }

          bcrypt.hash(password, 10)
              .then((hashedPassword) => {
                  const newUser = new User({
                      username,
                      mobile,
                      email,
                      password: hashedPassword,
                  });

                  newUser.save()
                      .then((savedUser) => {
                          res.status(201).json({ result: 'User created successfully', user: savedUser });
                      })
                      .catch((saveError) => {
                          console.error('Error saving user to database:', saveError);
                          res.status(500).json({ error: 'An error occurred during sign-up' });
                      });
              })
              .catch((hashError) => {
                  console.error('Error hashing password:', hashError);
                  res.status(500).json({ error: 'An error occurred during sign-up' });
              });
      })
      .catch((findError) => {
          console.error('Error finding user in database:', findError);
          res.status(500).json({ error: 'An error occurred during sign-up' });
      });
});



// User Sign-in
router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
      .then(async (user) => {
          if (!user) {
              return res.status(401).json({ error: 'Invalid email or password' });
          }

          try {
              // Compare the entered password with the hashed password from the database
              const isPasswordValid = await bcrypt.compare(password, user.password);

              if (!isPasswordValid) {
                  return res.status(401).json({ error: 'Invalid email or password' });
              }

              // If the password is valid, generate a token with user details and role
              const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });

              res.status(200).json({ result: 'Login successful', user, token });
          } catch (error) {
              console.error('Error during login:', error);
              res.status(500).json({ error: 'Internal server error' });
          }
      })
      .catch((findError) => {
          console.error('Error finding user in database:', findError);
          res.status(500).json({ error: 'Internal server error' });
      });
});




// Profile Route
router.get('/profile', authMiddleware, (req, res) => {
  const userId = req.user.userId;

  User.findById(userId)
      .then((user) => {
          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }

          res.status(200).json({ result: 'Profile accessed successfully', user });
      })
      .catch((error) => {
          console.error('Error in profile route:', error);
          res.status(500).json({ error: 'Internal server error' });
      });
});


// PUT route to update user information
router.put('/user/:userId', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const updatedUserData = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
      res.status(200).json({ user: updatedUserData, message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router;