const { Router } = require("express");

const authentication = require("./authentication");
const admin = require("./admin");

const router = Router();

module.exports = () => {
  authentication(router);
  admin(router);
  return router;
};
