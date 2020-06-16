module.exports = (req, res, next) => {
  if (req.session) {
    next();
  } else {
    res.status(401).json('You must be Logged in to do that');
  }
}