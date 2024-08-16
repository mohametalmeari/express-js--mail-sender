const { Router } = require("express");

const authentication = require("./authentication");

const router = Router();

module.exports = () => {
  authentication(router);
  return router;
};
