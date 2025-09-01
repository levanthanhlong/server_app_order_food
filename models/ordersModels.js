const db = require("../config/database");

const convertToMySQLDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 19).replace('T', ' ');
};
// add order
const addOrder = async (userId, foodId, quantity, statusOrder) => {
  const [result] = await db.query(
    "INSERT INTO orders (user_id, food_id, quantity, status) VALUES (?, ?, ?, ?)",
    [userId, foodId, quantity, statusOrder]
  );
  return result.insertId;
};

// delete order
const cancelOrder = async (orderId, userId) => {
  const [result] = await db.query(
    "DELETE FROM orders WHERE id = ? AND user_id = ?",
    [orderId, userId]
  );
  return result.affectedRows; 
};


// Cập nhật SL đơn
const editOrder = async (id, quantity, statusOrder) => {
  const [result] = await db.query(
    "UPDATE orders SET quantity = ?, status = ? WHERE id = ?",
    [quantity, statusOrder, id]
  );
  return result.affectedRows;
};

// remove order
const removeOrder = async (id) => {
  const [result] = await db.query("DELETE FROM orders WHERE id = ?", [id]);
  return result.affectedRows;
};

// get all order
const getAllOrder = async () => {
  const [result] = await db.query("SELECT * FROM orders");
  return result;
};

// get all order by userId
// get all orders by userId with information of food
const getAllOrdersByUserId = async (userId) => {
  const [result] = await db.query(`
    SELECT 
      orders.id,
      orders.food_id,
      food_items.name_food,
      orders.quantity,
      orders.order_date,
      orders.status,
      orders.created_at
    FROM orders
    JOIN food_items ON orders.food_id = food_items.id
    WHERE orders.user_id = ?
    ORDER BY orders.id DESC
  `, [userId]);
  return result;
};

// get All order by userId for the month
// const getAllOrderByUserIdForMonthYear = async (userId, month, year) => {
//   const [result] = await db.query(
//     `SELECT 
//        orders.id AS id,
//        orders.order_date,
//        orders.quantity,
//        food_items.name_food,
//        food_items.price,
//        food_items.image_url
//      FROM orders 
//      JOIN food_items ON orders.food_id = food_items.id
//      WHERE orders.user_id = ? 
//      AND MONTH(orders.order_date) = ? 
//      AND YEAR(orders.order_date) = ?`,
//     [userId, month, year]
//   );
//   return result;
// };
// get All order by userId for the month
// const getAllOrderByUserIdForMonthYear = async (userId, month, year) => {
//   const [result] = await db.query(
//     `SELECT 
//        orders.id AS id,
//        orders.order_date,
//        orders.quantity,
//        food_items.name_food,
//        food_items.price,
//        food_items.image_url,
//        (orders.quantity * food_items.price) AS total_price
//      FROM orders 
//      JOIN food_items ON orders.food_id = food_items.id
//      WHERE orders.user_id = ? 
//        AND MONTH(orders.order_date) = ? 
//        AND YEAR(orders.order_date) = ?`,
//     [userId, month, year]
//   );
//   return result;
// };
// get All order by userId for the month
const getAllOrderByUserIdForMonthYear = async (userId, month, year) => {
  const [result] = await db.query(
    `SELECT 
       orders.id AS id,
       orders.food_id,
       orders.order_date,
       orders.quantity,
       orders.status,
       orders.created_at,
       food_items.name_food,
       food_items.price AS price,
       food_items.image_url,
       (orders.quantity * food_items.price) AS total_price
     FROM orders 
     JOIN food_items ON orders.food_id = food_items.id
     WHERE orders.user_id = ? 
       AND MONTH(orders.order_date) = ? 
       AND YEAR(orders.order_date) = ?`,
    [userId, month, year]
  );
  
  console.log(JSON.stringify(result, null, 2)); // log full dữ liệu
  return result;
};




// Kiểm tra xem user đã đặt food này chưa
const getOrderByUserAndFood = async (userId, foodId) => {
  const [rows] = await db.query(
    "SELECT * FROM orders WHERE user_id = ? AND food_id = ?",
    [userId, foodId]
  );
  return rows.length > 0 ? rows[0] : null;
};



module.exports = {
  addOrder,
  editOrder,
  getOrderByUserAndFood,
  removeOrder,
  getAllOrder,
  getAllOrdersByUserId,
  getAllOrderByUserIdForMonthYear,
  cancelOrder
};
