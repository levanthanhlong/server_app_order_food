const express = require("express");
const pageController = require("../controllers/pageControllers");
const authController = require("../controllers/authControllers");

const router = express.Router();

router.get("/home", authController.requireLogin, pageController.renderHomePage);
router.get(
  "/homeAdmin",
  authController.requireLogin,
  authController.checkAdmin,
  pageController.renderHomeAdminPage
);
router.get("/login", pageController.renderLoginPage);

router.get(
  "/homeAdmin/createFoodItem",
  authController.requireLogin,
  authController.checkAdmin,
  pageController.renderCreateFoodItemPage
);
router.get(
  "/homeAdmin/updateFoodItem/:id",
  authController.requireLogin,
  authController.checkAdmin,
  pageController.renderFoodItemEditPage
);

router.get(
  "/homeAdmin/userManagerPage",
  authController.requireLogin,
  authController.checkAdmin,
  pageController.renderUserManagerPage
);

router.get(
  "/homeAdmin/userManagerPage/ordersUserManagerPage/:id",
  authController.requireLogin,
  authController.checkAdmin,
  pageController.renderOrderUserManagerPage
);

router.get(
  "/homeAdmin/createUserPage",
  authController.requireLogin,
  pageController.renderCreateUserPage
);

module.exports = router;
