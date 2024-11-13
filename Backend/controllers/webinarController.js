const Webinar = require("../models/webinar");

const postWebinar = async (req, res) => {
    const webinarDetails = req.body;
    try {
        const newWebinar = await Webinar.postWebinar(webinarDetails);
        res.status(201).json(newWebinar);
        console.log("Successfully posted Webinar");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error posting Webinar");
    }
};

const getAllWebinar = async (req, res) => {
    try {
        const newWebinar = await Webinar.getAllWebinar();
        res.status(200).json(newWebinar);
        console.log("Successfully get Webinar");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting Webinar");
    }
}

const updateWebinar = async (req, res) => {
    const id = parseInt(req.params.id); // Customer ID from URL parameters
    const updateData = req.body; // Customer data to be updated

    try {
        const result = await Webinar.updateWebinar(id, updateData);
    
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Webinar not found" });
        }
        res.json({ message: "Webinar updated successfully" });
    } catch (error) {
        console.error("Error updating Webinar:", error);
        res.status(500).json({ message: "Error updating Webinar" });
    }
}

const getAllWebinarByID = async (req, res) => {
    const WebinarID = req.params.id;
    try {
        const webinar = await Webinar.getAllWebinarByID(WebinarID);
        if (webinar.length === 0) {
            return res.status(404).send("Bookings not webinar");
        }
        res.json(webinar);
    } catch (error) {
        console.error(error);
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
        console.error(error);
        res.status(500).send("Error deleting Webinar");
    }
};

module.exports = {deleteWebinar, postWebinar, updateWebinar, getAllWebinar, getAllWebinarByID}