const db = require("./config/database");

async function initDB() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(100) UNIQUE NOT NULL,
        fullname VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL, 
        employee_code VARCHAR(50) UNIQUE NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS food_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name_food VARCHAR(100) NOT NULL,
        description TEXT,
        price INT NOT NULL,
        image_url VARCHAR(255),
        available_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        food_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('ordered', 'not_ordered') DEFAULT 'not_ordered',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (food_id) REFERENCES food_items(id) ON DELETE CASCADE
      )
    `);

    console.log("✅ Database đã sẵn sàng!");
  } catch (err) {
    console.error("❌ Lỗi khi tạo bảng:", err.message);
  }
}

module.exports = initDB;
