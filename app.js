const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require('./db/dbConnect');
const bcrypt = require('bcrypt').bcrypt;
const jwt = require('jsonwebtoken');
const UserModel = require('./db/userModel');
const auth = require('./auth');

// body parser configuration
dbConnect();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, content-type'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  res.json({ message: 'Hey! This is your server response' });
  next();
});

app.post('/register', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log('data: ', req);
  console.log('body: ', req.body);

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      const user = new UserModel({
        email: email,
        password: hashedPassword,
      });

      user
        .save()
        .then((result) => {
          res.status(201).send({
            message: 'User created successfully.',
            result,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: 'Error creating user',
            err,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Password was not hashed successfully',
        err,
      });
    });
});

app.post('/login', (req, res, next) => {
  console.log(req.body.email);
  UserModel.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return res.status(400).send({
              message: 'Password does not match',
              err,
            });
          }

          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            'TextRandom123$',
            { expiresIn: '24h' }
          );

          res.status(200).send({
            message: 'Login Successful',
            email: user.email,
            token,
          });
        })
        .catch((err) => {
          res.status(400).send({
            message: 'Passwords does not match',
            err,
          });
        });
    })
    .catch((err) => {
      res.status(400).send({
        message: 'Email not found',
        err: err,
      });
    });
});

app.get('/free-endpoint', (req, res, next) => {
  res.json({ message: 'You are free to access me anytime' });
});

app.get('/auth-endpoint', auth, (req, res, next) => {
  res.json({ message: 'You are authorized to access me' });
});

module.exports = app;
