const registerPage = (_req, res) => {
  return res.render("register");
};

const loginPage = (_req, res) => {
  return res.render("login");
};

const mailPage = (_req, res) => {
  return res.render("mail");
};

module.exports = { registerPage, loginPage, mailPage };
