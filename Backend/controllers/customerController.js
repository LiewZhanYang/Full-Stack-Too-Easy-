const Customer = require("../models/customer");
const {
  uploadProfilePic,
  getProfilePicByAccountID,
} = require("../controllers/uploadController");

const getCustomerByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    const customer = await Customer.getCustomerByEmail(email);
    if (customer.length === 0) {
      return res.status(404).send("Customer not found");
    }
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Customer");
  }
};

const getCustomerByID = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const customer = await Customer.getCustomerByID(id);
    if (customer.length === 0) {
      return res.status(404).send("Customer not found");
    }

    // Fetch the profile picture URL using uploadController
    const profilePic = await getProfilePicByAccountID(id);
    customer[0].ProfilePictureURL =
      profilePic?.url || "/img/default-profile.jpg";

    res.json(customer);
  } catch (error) {
    console.error("Error retrieving customer:", error);
    res.status(500).send("Error retrieving Customer");
  }
};

const postCustomer = async (req, res) => {
  const customerDetails = req.body;
  try {
    const newCustomer = await Customer.postCustomer(customerDetails);
    res.status(201).json(newCustomer);
    console.log("Successfully posted Customer");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting Customer");
  }
};

const updateCustomer = async (req, res) => {
  const id = parseInt(req.params.id); // Customer ID from URL parameters
  const updateData = req.body; // Customer data to be updated

  try {
    // Handle profile picture upload if a file is provided
    if (req.file) {
      try {
        const uploadResult = await uploadProfilePic(req.file, id); // Use uploadController for file upload
        updateData.PfpPath = uploadResult.data.Location || null; // Ensure PfpPath is set to null if no URL is returned
      } catch (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        return res
          .status(500)
          .json({ message: "Error uploading profile picture" });
      }
    }

    // Convert undefined values to null in updateData
    for (const key in updateData) {
      if (updateData[key] === undefined) {
        updateData[key] = null;
      }
    }

    // Update customer details in the database
    const result = await Customer.updateCustomer(id, updateData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Error updating customer" });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error retrieving customers:", error);
    res.status(500).json({ message: "Error retrieving customers" });
  }
};

const updateCustomerMembership = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await Customer.updateCustomerMembership(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer Membership updated successfully" });
  } catch (error) {
    console.error("Error updating customer membership:", error);
    res.status(500).json({ message: "Error updating customer Membership" });
  }
};

module.exports = {
  getCustomerByEmail,
  getCustomerByID,
  postCustomer,
  updateCustomer,
  getAllCustomers,
  updateCustomerMembership,
};
