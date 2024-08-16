const { send } = require("../controllers/mail");
const { isAuthenticated, isAdmin } = require("../middlewares");

module.exports = (router) => {
  router.post("/mail", isAuthenticated, isAdmin, send);
};
