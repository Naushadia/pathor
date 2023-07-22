const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req._id = decoded._id;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).send({
      message: "Invalid Access Key",
    });
  }
};
