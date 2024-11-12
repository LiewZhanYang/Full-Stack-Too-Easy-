const Booking = require("../models/booking");

const postBooking = async (req, res) => {
  const bookingDetails = req.body;
  try {
    const newBooking = await Booking.postBooking(bookingDetails);
    res.status(201).json(newBooking);
    console.log("Successfully posted Booking");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting Booking");
  }
};

const getAllBooking = async (req, res) => {
  try {
    const newBooking = await Booking.getAllBooking();
    res.status(200).json(newBooking);
    console.log("Successfully get Booking");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting Booking");
  }
}

const getBookingByAccountID = async (req, res) => {
  const AccountID = req.params.id;
  try {
    const bookings = await Booking.getBookingByAccountID(AccountID);
    if (bookings.length === 0) {
      return res.status(404).send("Bookings not found");
    }
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving bookings");
  }
};

const deleteBookingByBookingID = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedBooking = await Booking.deleteBookingByBookingID(id);
    res.status(201).json(deletedBooking);
    console.log("Successfully deleted Booking");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting Booking");
  }
};

module.exports = {
  postBooking,
  getBookingByAccountID,
  deleteBookingByBookingID,
  getAllBooking
};
