const { Router } = require("express");

const authentication = require("./authentication");
const admin = require("./admin");
const mail = require("./mail");
const pages = require("./pages");

const router = Router();

module.exports = () => {
  authentication(router);
  admin(router);
  mail(router);

  pages(router);

  return router;
};
