const { createUser, getUserByEmail } = require("../db/users");
const { authentication, random } = require("../helpers");

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      const missingFields = [];
      if (!email) missingFields.push("email");
      if (!password) missingFields.push("password");
      if (!username) missingFields.push("username");

      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingUsername = await getUserByEmail(username);
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = random();
    await createUser({
      email,
      username,
      authentication: { salt, password: authentication(salt, password) },
    });

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    const sessionSalt = random();
    user.authentication.sessionToken = authentication(
      sessionSalt,
      user._id.toString()
    );

    await user.save();

    res.cookie("AUTH", user.authentication.sessionToken, {
      domain: process.env.DOMAIN || "localhost",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const redirectUrl = req.query.redirect;
    if (redirectUrl) return res.redirect(redirectUrl);

    return res.status(200).json(user);
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const missingFields = [];
      if (!email) missingFields.push("email");
      if (!password) missingFields.push("password");

      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.status(403).json({ error: "Incorrect password" });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("AUTH", user.authentication.sessionToken, {
      domain: process.env.DOMAIN || "localhost",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const redirectUrl = req.query.redirect;
    if (redirectUrl) return res.redirect(redirectUrl);

    return res.status(200).json(user);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const logout = async (req, res) => {
  try {
    const user = req.identity;

    user.authentication.sessionToken = null;
    await user.save();

    res.clearCookie("AUTH", {
      domain: process.env.DOMAIN || "localhost",
    });

    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

module.exports = { register, login, logout };
