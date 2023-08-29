const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt_secret = 'mySecretKey@1';

router.post('/createuser', [
  body('name', "Name must be 3 characters long").isLength({ min: 3 }),
  body('email', "Enter a valid email").isEmail(),
  body('password', "Password must be 6 characters long").isLength({ min: 6 }),
], async function(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    }); 
    
    const data = {
      user: {
        id: newUser.id
      }
    };

    const authToken = jwt.sign(data, jwt_secret);
    res.json({ authToken });
  } catch (err) {
    console.log(err);
    res.send("Sorry a user with this email already exists");
  }
});

module.exports = router;
