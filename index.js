const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

require("dotenv").config();

const app = express();

// Cấu hình Express để phục vụ tệp tĩnh từ thư mục 'assets'
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(bodyParser.json());
app.use(cors());
app.use(
  session({
    secret: "secret_key_for_session", // Mã hóa session
    resave: false, // Không lưu lại session nếu không có sự thay đổi
    saveUninitialized: false, // Không lưu trữ session khi chưa có sự thay đổi
    cookie: { secure: false }, // Cấu hình cookie (true nếu bạn sử dụng HTTPS)
  })
);

app.use(express.json()); // Để xử lý JSON body
app.use(express.urlencoded({ extended: true }));

// Cho phép truy cập thư mục resources từ browser
app.use("/resources", express.static("resources"));

// Declare routes for the app
const userRoutes = require("./routes/userRoutes");
const pageRoutes = require("./routes/pageRoutes");
const foodItemsRoutes = require("./routes/foodItemRoutes");
const orderRoutes = require("./routes/orderRoutes");

// use routes
app.use("/api/user", userRoutes);
app.use("/api/foodItems", foodItemsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/", pageRoutes);

// Định nghĩa route chính và điều hướng đến trang HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html")); // Đảm bảo đường dẫn đúng tới file HTML
});

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

// Load file swagger.yaml
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

// Tạo route Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// Khởi độhg server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}/home`);
});
