const { send } = require("../controllers/mail");
const { isAuthenticated, isAdmin } = require("../middlewares");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = (router) => {
  router.post(
    "/mail",
    isAuthenticated,
    isAdmin,
    upload.array("attachment"),
    send
  );
};
