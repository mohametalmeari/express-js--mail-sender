const { getAllUsers } = require("../controllers/admin");
const { isAuthenticated, isAdmin } = require("../middlewares");

module.exports = (router) => {
  router.get("/users", isAuthenticated, isAdmin, getAllUsers);
};
