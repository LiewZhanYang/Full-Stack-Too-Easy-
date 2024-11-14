const Child = require("../models/child");

const getChildByAccountID = async (req, res) => {
  const AccountID = req.params.id;
  try {
    const children = await Child.getChildByAccountID(AccountID);
    if (children.length === 0) {
      return res.status(404).send("Children not found");
    }
    res.json(children);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving children");
  }
};

const postChild = async (req, res) => {
  const childDetails = req.body;
  try {
    // The database will auto-generate the id, so we don’t need to include it here.
    const newChild = await Child.postChild(childDetails);

    // Assuming `postChild` in your model returns the full record, including the new id.
    res.status(201).json({
      message: "Child created successfully",
      child: newChild, // This should include the auto-generated `id`.
    });
    console.log("Successfully posted Child");
  } catch (error) {
    console.error("Error posting Child:", error);
    res.status(500).json({ error: "Error posting Child" });
  }
};


const deleteChild = async (req, res) => {
  const childID = req.params.id;
  try {
    const deletedChild = await Child.deleteChild(childID);
    res.status(201).json(deletedChild);
    console.log("Successfully deleted Child");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting Child");
  }
};

const updateChild = async (req, res) => {
  const id = req.params.id;
  const childDetails = req.body;
  try {
    const updatedChild = await Child.updateChild(id, childDetails);
    res.status(201).json(updatedChild);
    console.log("Successfully updated Child");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating Child");
  }
};

const getChildBySessionID = async (req, res) => {
  const SessionID = req.params.id;
  try {
    const children = await Child.getChildBySessionID(SessionID);
    if (children.length === 0) {
      return res.status(404).send("Children not found");
    }
    res.json(children);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving children");
  }
};

module.exports = { getChildByAccountID, postChild, deleteChild, updateChild, getChildBySessionID };
