const { getUserBySessionToken } = require("../db/users");

const isAuthenticated = async (req, res, next) => {
  try {
    const internalReq = !req?.xhr && !req?.headers?.accept?.includes("json");

    const sessionToken = req.cookies["AUTH"];

    if (!sessionToken) {
      if (internalReq) return res.redirect("/sign-in");

      return res
        .status(403)
        .json({ message: "Unauthenticated, need to log in first" });
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      if (internalReq) return res.redirect("/sign-in");

      return res
        .status(403)
        .json({ message: "Unauthenticated, session has expired" });
    }

    req.identity = existingUser;
    return next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const internalReq = !req?.xhr && !req?.headers?.accept?.includes("json");
    const { role } = req.identity;

    if (role !== "admin") {
      if (internalReq) return res.redirect("/sign-in");

      return res
        .status(403)
        .json({ message: "Unauthorized, admin access only" });
    }

    return next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

module.exports = { isAuthenticated, isAdmin };
