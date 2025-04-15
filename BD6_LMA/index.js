const express = require("express");
const {
  getAllTravelPackages,
  getPackageByDestination,
  addBooking,
  updatePackage,
  getAllBookingsByPackageId,
} = require("./controllers/index.js");

const app = express();
app.use(express.json());

// Exercise 1: Retrieve All Travel Packages
app.get("/packages", (req, res) => {
  try {
    const travelPackages = getAllTravelPackages();
    if (travelPackages.length === 0) {
      return res.status(404).json({ message: "No travel package found." });
    }

    return res.status(200).json({ packages: travelPackages });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exercise 2: Retrieve Travel Package by Destination
app.get("/packages/:destination", (req, res) => {
  const destination = req.params.destination;
  try {
    const travelPackage = getPackageByDestination(destination);
    if (!travelPackage) {
      return res.status(404).json({
        message: "Travel package not found for destination: ",
        destination,
      });
    }

    return res.status(200).json({ package: travelPackage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exercise 3: Add a New Booking
function validateBooking(booking) {
  if (!booking.packageId && typeof booking.packageId !== "number")
    return "Package Id is required and should be a number.";
  if (!booking.customerName && typeof booking.customerName !== "string")
    return "Customer name is required and should be a string.";
  if (!booking.bookingDate && typeof booking.bookingDate !== "string")
    return "Booking date is required and should be a string.";
  if (!booking.seats && typeof booking.seats !== "number")
    return "Seats is required and should be a number.";

  return null;
}

app.post("/bookings", (req, res) => {
  try {
    const error = validateBooking(req.body);
    if (error) {
      return res.status(400).send(error);
    }

    const booking = addBooking(req.body);
    return res.status(201).json({ booking });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exercise 4: Update Available Slots for a Package
function validateInputForSeatUpdate(input) {
  if (!input.packageId && typeof input.packageId !== "number")
    return "Package Id is required and should be a number.";
  if (!input.seatsBooked && typeof input.seatsBooked !== "number")
    return "Number of booked seats is required and should be a number.";

  return null;
}

app.post("/packages/update-seats", (req, res) => {
  try {
    const error = validateInputForSeatUpdate(req.body);
    if (error) return res.status(400).send(error);

    const updatedPackage = updatePackage(req.body);
    return res.status(200).json({ package: updatedPackage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exercise 5: Retrieve All Bookings for a Package
app.get("/bookings/:packageId", (req, res) => {
  try {
    const packageId = parseInt(req.params.packageId);
    const bookings = getAllBookingsByPackageId(packageId);
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No booking found for package id: ", packageId });
    }

    return res.status(200).json({ bookings });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = { app };
