const express = require("express");
const router = express.Router();
const foodItemsControllers = require("../controllers/foodItemControllers");
const verifyToken = require("./middleware");
const multer = require("multer");
const path = require("path");

// Configure saving image files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "resources/img_foods");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// router add new food item
router.post(
  "/addNewFoodItem",
  upload.single("image"), //tạo tên ảnh và thêm anh vào thư mục resources
  foodItemsControllers.addFoodItem
);

// router get all food items
router.get("/getAllFoodItems", foodItemsControllers.getAllFoodItems);

// router delete food item
router.delete("/deleteFoodItem/:id", foodItemsControllers.deleteFoodItemById);

// router get detail food item
router.get(
  "/getDetailFoodItemById/:id",
  foodItemsControllers.getDetailFoodItemById
);

// router update food item
router.put(
  "/updateFoodItemById/:id",
  upload.single("image"),
  foodItemsControllers.updateFoodItemById
);

// router get list of food items on this week
router.get(
  "/getFoodItemsOnThisWeek",
  verifyToken,
  foodItemsControllers.getFoodItemsOnThisWeek
);

module.exports = router;
