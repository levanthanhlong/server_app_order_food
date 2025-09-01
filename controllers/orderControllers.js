const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ordersModels = require("../models/ordersModels");
const foodItemsModels = require("../models/foodItemsModels");
const db = require("../config/database");

// add order with userId and foodId
const addOrder = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy từ middleware verifyToken
    const foodId = req.params.id;
    const { quantity, statusOrder } = req.body;

    const now = new Date();
    const food = await foodItemsModels.getDetailFoodItemById(foodId);

    if (!food) {
      return res.status(404).json({
        status: 0,
        message: "Món ăn không tồn tại!",
      });
    }

    // Lấy ngày có thể đặt món (available_date từ food)
    const availableDate = new Date(food.available_date);

    // Deadline: 10h sáng ngày availableDate
    const deadline = new Date(availableDate);
    deadline.setHours(10, 0, 0, 0);

    if (now > deadline) {
      return res.status(400).json({
        status: 0,
        message: "Đã quá hạn đặt món (sau 10h sáng ngày phục vụ)!",
      });
    }

    // ✅ Check xem đã tồn tại đơn với userId + foodId chưa
    const existingOrder = await ordersModels.getOrderByUserAndFood(
      userId,
      foodId
    );
    if (existingOrder) {
      return res.status(400).json({
        status: 0,
        message: "Bạn đã đặt món này rồi!",
      });
    }

    // Nếu chưa tồn tại => thêm mới
    const newOrderId = await ordersModels.addOrder(
      userId,
      foodId,
      quantity,
      statusOrder
    );

    return res.status(201).json({
      status: 1,
      message: "Tạo đơn hàng thành công!",
      orderId: newOrderId,
    });
  } catch (err) {
    console.error("Lỗi tạo đơn hàng:", err);
    return res.status(500).json({
      status: 0,
      message: "Đã xảy ra lỗi khi tạo đơn hàng!",
    });
  }
};

// cancel order by user
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const foodId = req.params.id;
    console.log(userId);
    console.log(foodId);
    // Lấy tất cả orders của user với foodId này
    const [orders] = await db.query(
      `SELECT o.id, fi.available_date
       FROM orders o
       JOIN food_items fi ON o.food_id = fi.id
       WHERE o.food_id = ? AND o.user_id = ?`,
      [foodId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        status: 0,
        message:
          "Không tìm thấy đơn hàng với món này hoặc bạn không có quyền huỷ!",
      });
    }

    const now = new Date();

    // Check deadline với available_date (chỉ cần check 1 cái vì foodId giống nhau thì available_date cũng giống nhau)
    const availableDate = new Date(orders[0].available_date);
    const deadline = new Date(availableDate);
    deadline.setHours(10, 0, 0, 0);

    if (now > deadline) {
      return res.status(400).json({
        status: 0,
        message: "Đã quá hạn huỷ đơn (sau 10h sáng ngày phục vụ)!",
      });
    }

    // Huỷ tất cả orders của user với foodId này
    const result = await ordersModels.cancelOrder(orders[0].id, userId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 0,
        message: "Không tìm thấy đơn hàng để huỷ!",
      });
    }

    return res.status(200).json({
      status: 1,
      message: `Huỷ đơn hàng thành công!`,
    });
  } catch (err) {
    console.error("Lỗi huỷ đơn hàng:", err);
    return res.status(500).json({
      status: 0,
      message: "Đã xảy ra lỗi khi huỷ đơn hàng!",
    });
  }
};

// delete order by
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ordersModels.removeOrder(id);
    if (!result) {
      res.status(500).json({ status: 0, message: "Lỗi khi xoá" });
    }
    res.status(500).json({ status: 1, message: "Xoá thành công" });
  } catch (err) {
    console.error("Lỗi khi xoá đơn hàng theo userId:", err);
    res.status(500).json({ status: 0, message: err });
  }
};

// get All order of user
const getAllOrdersByUserId = async (req, res) => {
  try {
    const userId = req.user.userId; // lấy userId từ middleware verifyToken
    const orders = await ordersModels.getAllOrdersByUserId(userId);
    console.log(orders);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Lỗi khi lấy đơn đặt theo userId:", error);
    res.status(500).json({ success: false, message: "Error server" });
  }
};


// Get all order in month
const getAllOrderByUserIdForMonthYear = async (req, res) => {
  const userId = req.user.userId;
  const { month, year } = req.body;
  console.log(userId);
  try {
    const result = await ordersModels.getAllOrderByUserIdForMonthYear(
      userId,
      month,
      year
    );
    console.log("--------list order------");
    console.log(result);
    res.status(200).json({ status: 1, data: result });
  } catch (err) {
    console.error("Lỗi khi lấy đơn hàng theo userId:", error);
    res.status(500).json({ status: 0, message: "Lỗi từ server" });
  }
};

module.exports = {
  addOrder,
  deleteOrder,
  cancelOrder,
  getAllOrdersByUserId,
  getAllOrderByUserIdForMonthYear,
};
