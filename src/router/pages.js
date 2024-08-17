const { registerPage, loginPage, mailPage } = require("../controllers/pages");

module.exports = (router) => {
  router.get("/sign-up", registerPage);
  router.get("/sign-in", loginPage);
  router.get("/mail", mailPage);
};
