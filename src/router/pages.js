const {
  registerPage,
  loginPage,
  mailPage,
  homePage,
} = require("../controllers/pages");
const { isAuthenticated, isAdmin, isLoggedOut } = require("../middlewares");

module.exports = (router) => {
  router.get("/sign-up", isLoggedOut, registerPage);
  router.get("/sign-in", isLoggedOut, loginPage);
  router.get("/mail", isAuthenticated, isAdmin, mailPage);
  router.get("/", homePage);
};
