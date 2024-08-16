const { getUsers } = require("../db/users");

const getAllUsers = async (_req, res) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

module.exports = { getAllUsers };
