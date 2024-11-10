const Admin = require("../models/admin");

const getAdminByUsername = async (req, res) => {
  const username = req.params.username;
  try {
    const admin = await Admin.getAdminByUsername(username);
    if (admin.length === 0) {
      return res.status(404).send("Admin not found");
    }
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving admin");
  }
};

module.exports = { getAdminByUsername };
