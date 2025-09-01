const mysql = require("mysql2/promise");
require("dotenv").config(); //lấy ra các giá trị trong file .env

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function checkConnection() {
    try {
        const connection = await db.getConnection();
        console.log(" Kết nối MySQL thành công!");
        connection.release(); // Giải phóng kết nối
    } catch (error) {
        console.error("Lỗi kết nối MySQL:", error.message);
    }
}

checkConnection();

module.exports = db;