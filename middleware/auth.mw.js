const jwt = require('jsonwebtoken');
const { chalkLogDanger } = require('../utils/chalk');

function authRoles(checkIsAdmin, checkIsBusiness) {
  function authorizeInner(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
      res.status(401).send('Access denied, No token provided');
      return;
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    } catch (err) {
      chalkLogDanger('token error:', err);
      res.status(400).send('Invalid token');
      return;
    }

    if (checkIsAdmin && !req.user.isAdmin) {
      res.status(400).send(`you don't have authorization`);
      return;
    }

    if (checkIsBusiness && !req.user.isBusiness) {
      res.status(400).send(`you don't have authorization`);
      return;
    }

    next();
  }

  return authorizeInner;
}

module.exports = {
  authRoles,
  authorize: authRoles(),
};
