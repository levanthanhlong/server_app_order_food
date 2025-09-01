const express = require("express");

const userController = require("../controllers/userControllers");
const verifyToken = require("./middleware");
const router = express.Router();

router.post("/createNewUser", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/getAllUsers", userController.getAllUsers);
router.delete("/deleteUser/:id", userController.deleteUser);
router.get("/getUserInfo", verifyToken, userController.getUserInfoById);

module.exports = router;

