const crypto = require("crypto");
require("dotenv").config();

const random = () => crypto.randomBytes(128).toString("base64");
const authentication = (salt, password) =>
  crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.SECRET)
    .digest("hex");

module.exports = { random, authentication };
