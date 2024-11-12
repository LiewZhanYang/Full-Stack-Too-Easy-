const axios = require("axios");
const WHEREBY_API_KEY = process.env.WHEREBY_API_KEY;
const createMeeting = async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.whereby.dev/v1/meetings",
      {
        endDate: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
        fields: ["hostRoomUrl", "roomUrl"],
      },
      {
        headers: {
          Authorization: `Bearer ${WHEREBY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({ error: "Failed to create meeting" });
  }
};

module.exports = {
  createMeeting,
};
