const Announcement = require("../models/announcement");
const axios = require("axios");


const postAnnouncement = async (req, res) => {
  const announcementDetails = req.body;
  const telegramToken = "7900727345:AAFC8gCTEfNwH_0vdUDu4jQbu_wkw0W-Ot";
  const telegramChatId = "@MindsphereTooEasy"; // Replace with your Telegram channel username or chat ID

  try {
    // Save the announcement to the database
    const newAnnouncement = await Announcement.postAnnouncement(
      announcementDetails
    );

    // Prepare the Telegram message
    const telegramMessage = `📢 *New Announcement*\n\n*Title:* ${announcementDetails.Title}\n\n${announcementDetails.Body}`;

    // Send the announcement to Telegram
    await axios.post(
      `https://api.telegram.org/bot${telegramToken}/sendMessage`,
      {
        chat_id: telegramChatId,
        text: telegramMessage,
        parse_mode: "Markdown", // Use Markdown for better formatting
      }
    );

    console.log("Successfully posted announcement to Telegram");
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error("Error posting announcement:", error);
    res.status(500).send("Error posting announcement");
  }
};

const getAllAnnouncement = async (req, res) => {
  try {
    const announcements = await Announcement.getAllAnnouncement();
    res.status(200).json(announcements);
    console.log("Successfully get announcements");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting announcements");
  }
};

const updateAnnouncement = async (req, res) => {
  const id = parseInt(req.params.id); // Customer ID from URL parameters
  const updateData = req.body; // Customer data to be updated

  try {
    const result = await Announcement.updateAnnouncement(id, updateData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.json({ message: "Announcement updated successfully" });
  } catch (error) {
    console.error("Error updating Announcement:", error);
    res.status(500).json({ message: "Error updating Announcement" });
  }
};

const getAnnouncementByID = async (req, res) => {
  const id = req.params.id;
  try {
    const announcement = await Announcement.getAllAnnouncementByID(id);
    if (announcement.length === 0) {
      return res.status(404).send("Bookings not announcement");
    }
    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving announcement");
  }
};

const deleteAnnouncement = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedAnnouncement = await Announcement.deleteAnnouncement(id);
    res.status(201).json(deletedAnnouncement);
    console.log("Successfully deleted Announcement");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting Announcement");
  }
};

module.exports = {
  postAnnouncement,
  getAllAnnouncement,
  getAnnouncementByID,
  deleteAnnouncement,
  updateAnnouncement,
};
