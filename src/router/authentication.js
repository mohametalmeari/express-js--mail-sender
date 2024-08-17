const { register, login, logout } = require("../controllers/authentication");
const { isAuthenticated } = require("../middlewares");

module.exports = (router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.get("/auth/logout", isAuthenticated, logout);
};
