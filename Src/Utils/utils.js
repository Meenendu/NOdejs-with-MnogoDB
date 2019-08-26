var JWT = require("jsonwebtoken");

require("dotenv").config();

const db_config = {
  url: process.env.URL,
  database: process.env.DATABASE
};

const privateKey = process.env.PRIVATEKEY;

const checkAuthorization = (req, res, next) => {
  if (req.headers.authorization == undefined) {
    res.status(500).json({ error: "Not Authorized" });
    throw new Error("Not Authorized");
  } else {
    var token = req.headers.authorization.split(" ")[1];
    JWT.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
      if (err) {
        res.status(500).json({ error: "Not Authorized" });
        throw new Error("Not Authorized");
      }

      req.user = user.user;
      return next();
    });
  }
};

const getToken = userName => {
  let token = JWT.sign(
    { user: userName },
    privateKey,
    {
      algorithm: "HS256"
    },
    { expiresIn: "1h" }
  );
  return token;
};

module.exports = { checkAuthorization, getToken, db_config };
