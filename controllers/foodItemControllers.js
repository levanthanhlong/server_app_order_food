const { data } = require("autoprefixer");
const foodItemsModels = require("../models/foodItemsModels");

// add food item
const addFoodItem = async (req, res) => {
  try {
    const { name_food, description, price, available_date } = req.body;

    const image = req.file;
    if (price <= 0) {
      return res
        .status(400)
        .json({ status: 0, message: "Giá món ăn không hợp lệ" });
    }
    const imageUrl = `/resources/img_foods/${image.filename}`; //lấy đường dẫn ảnh
    const foodItemId = await foodItemsModels.addFoodItem(
      name_food,
      description,
      price,
      imageUrl,
      available_date
    );
    console.log(foodItemId);
    return res
      .status(201)
      .json({ status: 1, message: "Tạo món ăn thành công" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0, message: err });
  }
};

// get all food items
const getAllFoodItems = async (req, res) => {
  try {
    // Lấy tất cả món ăn từ database
    const foodItems = await foodItemsModels.getAllFoodItems();
    // Kiểm tra xem có món ăn nào không
    if (foodItems.length == 0) {
      return res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy món ăn nào" });
    }
    return res
      .status(200)
      .json({ status: 1, message: "Success", data: foodItems });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: 0, message: "Lỗi từ server: ", error: err });
  }
};

// delete food item by id
const deleteFoodItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = foodItemsModels.deleteFoodItemById(id);
    if (!result) {
      return res.status(400).json({ status: 0, message: "Lỗi khi xoá món ăn" });
    }
    return res
      .status(200)
      .json({ status: 1, message: "Xoá món ăn thành công" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: 0, message: "Lỗi từ server: ", error: err });
  }
};

// get detail food item
const getDetailFoodItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await foodItemsModels.getDetailFoodItemById(id);
    if (!result) {
      return res
        .status(400)
        .json({ status: 0, message: "Error load food items" });
    }
    console.log(result);
    return res
      .status(200)
      .json({ status: 1, message: "Load food items successful", data: result });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: 0, message: `Error load food items: ${err}` });
  }
};

// update food item by id
const updateFoodItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const { nameFood, description, price, availableDate } = req.body;

    const image = req.file;

    //const foodOld = foodItemsModels.getDetailFoodItemById(id);

    if (price <= 0) {
      return res
        .status(400)
        .json({ status: 0, message: "Giá bạn nhập phải lớn hơn 0" });
    }

    const foodInfo = await foodItemsModels.getDetailFoodItemById(id);

    const imageUrl = image
      ? `/resources/img_foods/${image.filename}`
      : foodInfo.image_url;

    const result = await foodItemsModels.updateFoodItemById(
      id,
      nameFood,
      description,
      price,
      imageUrl,
      availableDate
    );

    if (result === 0) {
      return res
        .status(400)
        .json({ status: 0, message: "Lỗi khi cập nhật món ăn" });
    }

    return res.status(200).json({ status: 1, message: "Cập nhật thành công" });
  } catch (err) {
    console.error("Error: ", err);
    return res.status(500).json({
      status: 0,
      message: "Lỗi khi cập nhật món ăn",
      error: err.message,
    });
  }
};

// get food item on this week
const getFoodItemsOnThisWeek = async (req, res) => {
  try {
    const userId = req.user.userId
    const result = await foodItemsModels.getFoodItemOnThisWeek(userId);

    return res.status(200).json({
      status: 1,
      message: "Lấy danh sách món ăn trong tuần thành công!",
      data: result,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: 0, message: `Lỗi khi lấy danh sách món ăn: ${err}` });
  }
};

module.exports = {
  addFoodItem,
  getAllFoodItems,
  deleteFoodItemById,
  updateFoodItemById,
  getDetailFoodItemById,
  getFoodItemsOnThisWeek,
};
