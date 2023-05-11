"use strict";
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");
const { flights, reservations } = require("./data");

// returns an array of all flight numbers
const getFlights = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("SlingAir");

    let allFlights = await db.collection("flights").find().toArray();
    // const allFlights = Object.keys(flights);
    res.status(200).json({ status: 200, data: allFlights });
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    await client.close();
    console.log("disconnected!");
  }
};

// returns all the seats on a specified flight
const getFlight = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    const { flight } = req.params;
    await client.connect();
    const db = client.db("SlingAir");
    let targetFlight = await db.collection("flights").findOne({ _id: flight });
    res.status(200).json({ status: 200, data: targetFlight.seats });
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    await client.close();
    console.log("disconnected!");
  }
};

// returns all reservations
const getReservations = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("SlingAir");

    const allReservations = await db
      .collection("reservations")
      .find()
      .toArray();
    res.status(200).json({ status: 200, data: allReservations });
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    await client.close();
    console.log("disconnected!");
  }
};

// returns a single reservation
const getSingleReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    const { reservation } = req.params;
    await client.connect();
    const db = client.db("SlingAir");

    const reservationFlag = await db
      .collection("reservations")
      .findOne({ _id: reservation });
    if (!reservationFlag) {
      res.status(400).json({ status: 400, data: "Invalid reservation number" });
    } else {
      let targetReservation = [];
      const allReservations = await db
        .collection("reservations")
        .find()
        .toArray();
      allReservations.map((item) => {
        if (item._id === reservation) {
          targetReservation.push(item);
        }
      });
      res.status(200).json({ status: 200, data: targetReservation });
    }
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    await client.close();
    console.log("disconnected!");
  }
};

// creates a new reservation
const addReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    const { flight, seat, firstName, lastName, email } = req.body;
    await client.connect();
    const db = client.db("SlingAir");
    const reservationId = uuidv4();
    if (!flight || !seat || !firstName || !lastName || !email) {
      res.status(400).json({
        status: 400,
        data: req.body,
        message: "Some information is missing.",
      });
    } else {
      const seatCheckingFlag = await db
        .collection("flights")
        .findOne({ _id: flight });

      let newSeatChecker;
      console.log(seatCheckingFlag);
      seatCheckingFlag["seats"].forEach((element) => {
        if (element.id === seat) {
          newSeatChecker = element;
        }
      });
      console.log("newseatchecker: ", newSeatChecker);
      if (!newSeatChecker) {
        res.status(400).json({
          status: 400,
          data: "Invalid seat number",
        });
      } else if (!newSeatChecker.isAvailable) {
        res.status(400).json({
          status: 400,
          data: "That seat is already booked",
        });
      } else {
        const flightResult = await db
          .collection("flights")
          .updateOne(
            { _id: flight, "seats.id": seat },
            { $set: { "seats.$.isAvailable": false } }
          );

        const result = await db.collection("reservations").insertOne({
          _id: reservationId,
          flight: flight,
          seat: seat,
          givenName: firstName,
          surname: lastName,
          email: email,
        });
        if (result.acknowledged && flightResult.acknowledged) {
          res.status(200).json({
            status: 200,
            data: result,
          });
        }
      }
    }
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    await client.close();
    console.log("disconnected!");
  }
};

// updates a specified reservation
const updateReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { id, flight, seat, firstName, lastName, email } = req.body;
  try {
    await client.connect();
    const db = client.db("SlingAir");
    let updateFlag = await db.collection("reservations").findOne({ _id: id });

    if (!updateFlag) {
      res.status(400).json({
        status: 400,
        data: req.body,
        message: "Invalid reservation id",
      });
    } else {
      const seatCheckingFlag = await db
        .collection("flights")
        .findOne({ _id: flight });

      let newSeatChecker;
      console.log(seatCheckingFlag);
      seatCheckingFlag["seats"].forEach((element) => {
        if (element.id === seat) {
          newSeatChecker = element;
        }
      });
      if (!newSeatChecker) {
        res.status(400).json({
          status: 400,
          data: "Invalid seat number",
        });
      } else if (
        !newSeatChecker.isAvailable &&
        (updateFlag.seat !== seat || updateFlag.flight !== flight)
      ) {
        res.status(400).json({
          status: 400,
          data: "That seat is already booked",
        });
      } else {
        if (seat && updateFlag.seat !== seat) {
          await db
            .collection("flights")
            .updateOne(
              { _id: updateFlag.flight, "seats.id": updateFlag.seat },
              { $set: { "seats.$.isAvailable": true } }
            );

          await db
            .collection("flights")
            .updateOne(
              { _id: flight, "seats.id": seat },
              { $set: { "seats.$.isAvailable": false } }
            );
        } else if (updateFlag.flight !== flight) {
          await db
            .collection("flights")
            .updateOne(
              { _id: updateFlag.flight, "seats.id": updateFlag.seat },
              { $set: { "seats.$.isAvailable": true } }
            );

          await db
            .collection("flights")
            .updateOne(
              { _id: flight, "seats.id": seat },
              { $set: { "seats.$.isAvailable": false } }
            );
        }

        const result = await db.collection("reservations").updateOne(
          { _id: id },
          {
            $set: {
              flight: flight ? flight : updateFlag.flight,
              seat: seat ? seat : updateFlag.seat,
              givenName: firstName ? firstName : updateFlag.givenName,
              surname: lastName ? lastName : updateFlag.surname,
              email: email ? email : updateFlag.email,
            },
          }
        );
        if (result.acknowledged) {
          res.status(200).json({
            status: 200,
            data: "Reservation updated successfully",
          });
        }
      }
    }
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    await client.close();
    console.log("disconnected!");
  }
};

// deletes a specified reservation
const deleteReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { reservation } = req.params;
  try {
    await client.connect();
    const db = client.db("SlingAir");
    let deleteFlag = await db
      .collection("reservations")
      .findOne({ _id: reservation });

    if (!deleteFlag) {
      res.status(400).json({
        status: 400,
        message: "Invalid reservation id",
      });
    } else {
      await db
        .collection("flights")
        .updateOne(
          { _id: deleteFlag.flight, "seats.id": deleteFlag.seat },
          { $set: { "seats.$.isAvailable": true } }
        );

      const result = await db
        .collection("reservations")
        .deleteOne({ _id: reservation });
      if (result.acknowledged) {
        res.status(200).json({
          status: 200,
          data: "Reservation deleted",
        });
      }
    }
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    await client.close();
    console.log("disconnected!");
  }
};

const getAdminReservations = async (req, res) => {
  const { pagenum } = req.params;
  const pagenumLimit = 5;

  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("SlingAir");

    let reservationsChecker = await db
      .collection("reservations")
      .find()
      .skip(pagenum > 1 ? pagenumLimit * (pagenum - 1) : 0)
      .limit(pagenumLimit + 1)
      .toArray();

    const targetReservations = await db
      .collection("reservations")
      .find()
      .skip(pagenum > 1 ? pagenumLimit * (pagenum - 1) : 0)
      .limit(pagenumLimit)
      .toArray();
    reservationsChecker = reservationsChecker[pagenumLimit];

    res.status(200).json({
      status: 200,
      data: {
        targetReservations,
        reservationsChecker: reservationsChecker ? true : false,
      },
    });
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    await client.close();
    console.log("disconnected!");
  }
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservation,
  getSingleReservation,
  deleteReservation,
  updateReservation,
  getAdminReservations,
};
