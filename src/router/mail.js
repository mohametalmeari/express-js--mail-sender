const { send, show, list, listBySender } = require("../controllers/mail");
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
  router.get("/mail/:id", isAuthenticated, isAdmin, show);
  router.get("/list-mails", isAuthenticated, isAdmin, list);
  router.get("/list-mails/:sender", isAuthenticated, isAdmin, listBySender);
};
