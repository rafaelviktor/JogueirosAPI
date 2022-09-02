const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header("token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ "result": null, "message": "Por favor faça seu login.", "success": false });
  }

  // Verify token
  try {
    const verify = jwt.verify(token, process.env.jwtSecret);

    req.id = verify.user;
    next();
  } catch (err) {
    return res.status(401).json({ "result": null, "message": "Sua sessão expirou. Por favor faça login novamente.", "success": false });
  }
};