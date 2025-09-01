const path = require('path');

// get home page
const renderHomePage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/user/home.html"));
};

// get home for admin
const renderHomeAdminPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin/admin_home.html"));
};

// get login page
const renderLoginPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
};

// get create food item page
const renderCreateFoodItemPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin/food_item_create.html"));
}

// get edit food item page
const renderFoodItemEditPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin/food_item_edit.html"));
}

// get user manager page
const renderUserManagerPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin/user_manager.html"));
}

// get order user manager page
const renderOrderUserManagerPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin/order_user_manager.html"));
}
// get create user page
const renderCreateUserPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin/create_user.html"));
}



module.exports = {
  renderHomePage,
  renderHomeAdminPage,
  renderLoginPage,
  renderCreateFoodItemPage,
  renderFoodItemEditPage,
  renderCreateUserPage,
  renderUserManagerPage,
  renderOrderUserManagerPage
};
