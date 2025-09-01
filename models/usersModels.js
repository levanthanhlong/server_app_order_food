const db = require("../config/database");
const bcrypt = require("bcryptjs");

// add user account
const addUser = async (username, password, fullname, role, employeeCode) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    "INSERT INTO users (username, password, fullname, role, employee_code) VALUES (?, ?, ?, ?, ?)",
    [username, hashedPassword, fullname, role, employeeCode]
  );
  return result.insertId;
};

// find user by id
const findUserById = async (id) => {
  const [result] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return result[0];
};

// find user by userName
const findUserByUserName = async (username) => {
  const [result] = await db.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  console.log("user:");
  console.log(result);
  return result.length > 0 ? result[0] : null;
};

// delete user by id
const deleteUserById = async (id) => {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows;
};

// update user by id
const updateUserById = async (id) => {};

// get all users
const getAllUsers = async () => {
  const [result] = await db.query("SELECT * FROM users");
  console.log("all users: ");
  console.log(result);
  return result;
};

module.exports = {
  addUser,
  findUserById,
  deleteUserById,
  getAllUsers,
  updateUserById,
  findUserByUserName,
  findUserById
};
