const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModels = require("../models/usersModels");

const register = async (req, res) => {
  const { username, fullname, password, employeeCode } = req.body;
  try {
    const isExistUser = await userModels.findUserByUserName(username);
    if (isExistUser) {
      return res.status(400).json({
        status: 0,
        message: "Tên đăng nhập đã tồn tại",
      });
    }
    const role = 'user'
    //get userId after register successfully
    const userId = await userModels.addUser(
      username,
      password,
      fullname,
      role,
      employeeCode
    );

    const token = jwt.sign({ userId }, "thanh");
    console.log(token);

    // return token
    return res.status(200).json({
      status: 1,
      token: token,
      message: `Tạo tài khoản ${username} thành công`,
    });
    // error Error: Duplicate entry '21D190194' for key 'users.employee_code'
  } catch (e) {
    console.log(`error ${e}`);
    const errorMessage = e?.message || e?.toString();

    if (errorMessage.includes("Duplicate entry")) {
      return res.status(400).json({
        status: 0,
        message: "Mã nhân viên đã tồn tại, vui lòng kiểm tra lại!",
      });
    }
    return res.status(500).json({
      status: 0,
      message: "An error occurred, please try again later!",
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // get user with username to check user exist
    const user = await userModels.findUserByUserName(username);

    //check user is not exist
    if (!user) {
      return res.status(400).json({
        status: 0,
        message: "Sai tên đăng nhập",
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        status: 0,
        message: "Sai mật khẩu",
      });
    }

    // get user id from database
    const userId = user.id;
    // Tạo JWT token với userID
    const token = jwt.sign({ userId }, "thanh");
    console.log(token);

    // Lưu thông tin đăng nhập vào session
    req.session.loggedin = true;
    req.session.username = username;

    var role = "user";
    if (username == "admin") {
      role = "admin";
    }
    return res.status(200).json({
      status: 1,
      message: "Đăng nhập thành công",
      role: role,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Lỗi từ server",
    });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/login");
  });
};

const getAllUsers = async (req, res) => {
  try {
    const result = await userModels.getAllUsers();
    return res.status(200).json({
      status: 1,
      message: "Lấy danh sách người dùng thành công",
      data: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 0,
      message: "Lỗi khi lấy danh sách người dùng",
      error: err,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userModels.deleteUserById(id);
    if (!result) {
      return res
        .status(400)
        .json({ status: 0, message: "Lỗi khi xoá người dùng" });
    }
    return res.status(200).json({ status: 1, message: "Xoá thành công" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: 0, message: "Lỗi khi xoá người dùng", error: err });
  }
};

const getUserInfoById = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy userId từ token
    const user = await userModels.findUserById(userId);

    if (!user) {
      return res.status(404).json({ status: 0, message: "User not found!" });
    }

    res.status(200).json({
      status: 1,
      message: "Lấy thông tin người dùng thành công",
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, message: "Lỗi từ server" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getAllUsers,
  deleteUser,
  getUserInfoById,
};
