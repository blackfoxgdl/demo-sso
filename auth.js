const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    // get the token from the authorization header
    const token = await req.headers.authorization.split(' ')[1];
    console.log('token: ', token);
    // check if the token matches the supposed origin
    const decodedToken = await jwt.verify(token, 'TextRandom123$');
    // retrieve the user details of the logged in user
    const user = await decodedToken;
    // pass the the user down to the endpoints here
    req.user = user;
    // pass down functionality to the endpoints
    next();
  } catch (err) {
    console.log(err);
    res.status(402).json({
      error: new Error('Invalid request!'),
    });
  }
};
