const Webinar = require("../models/webinar");
const uploadController = require("../controllers/uploadController");

const postWebinar = async (req, res) => {
  const webinarDetails = req.body;
  console.log(webinarDetails);
  try {
    // Insert webinar data into the database
    const newWebinar = await Webinar.postWebinar(webinarDetails);

    // Check if webinar creation was successful and a WebinarID was returned
    if (newWebinar && newWebinar.WebinarID && req.file) {
      // Handle file upload using the newly created WebinarID
      await uploadController.uploadWebinar(req.file, newWebinar.WebinarID);
    }

    res.status(201).json(newWebinar);
    console.log("Successfully posted Webinar");
  } catch (error) {
    console.error("Error posting Webinar:", error);
    res.status(500).send("Error posting Webinar");
  }
};

const updateWebinar = async (req, res) => {
  const id = parseInt(req.params.id); // Existing WebinarID from URL parameters
  const updateData = req.body;

  try {
    // Handle file upload if a new file is provided during update
    if (req.file) {
      console.log("File is present. Uploading to S3...");
      await uploadController.uploadWebinar(req.file, id);
    }

    // Update the webinar data
    const result = await Webinar.updateWebinar(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Webinar not found" });
    }

    res.json({ message: "Webinar updated successfully" });
  } catch (error) {
    console.error("Error updating Webinar:", error);
    res.status(500).json({ message: "Error updating Webinar" });
  }
};

const getAllWebinar = async (req, res) => {
  try {
    // Fetch all webinars from the database
    const webinars = await Webinar.getAllWebinar();

    // Loop through webinars to fetch image URLs
    const webinarsWithImages = await Promise.all(
      webinars.map(async (webinar) => {
        try {
          // Fetch the image URL using the uploadController function
          const { url } = await uploadController.getFileByWebinarID(
            webinar.WebinarID
          );
          return { ...webinar, imageUrl: url };
        } catch (error) {
          // If there's an error fetching the image, log it and return the webinar without imageUrl
          console.error(
            `Error fetching image for WebinarID ${webinar.WebinarID}:`,
            error
          );
          return { ...webinar, imageUrl: null };
        }
      })
    );

    // Return webinars with their image URLs
    res.status(200).json(webinarsWithImages);
    console.log("Successfully retrieved all webinars with images");
  } catch (error) {
    console.error("Error getting Webinar:", error);
    res.status(500).send("Error getting Webinar");
  }
};

const getAllWebinarByID = async (req, res) => {
  const WebinarID = req.params.id;
  try {
    const webinar = await Webinar.getAllWebinarByID(WebinarID);
    if (webinar.length === 0) {
      return res.status(404).send("Webinar not found");
    }
    res.json(webinar);
  } catch (error) {
    console.error("Error retrieving webinar:", error);
    res.status(500).send("Error retrieving webinar");
  }
};

const deleteWebinar = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedWebinar = await Webinar.deleteWebinar(id);
    res.status(201).json(deletedWebinar);
    console.log("Successfully deleted Webinar");
  } catch (error) {
    console.error("Error deleting Webinar:", error);
    res.status(500).send("Error deleting Webinar");
  }
};

module.exports = {
  deleteWebinar,
  postWebinar,
  updateWebinar,
  getAllWebinar,
  getAllWebinarByID,
};
