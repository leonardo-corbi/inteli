const reservationService = require("../services/reservationService");

const getAllReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReservationById = async (req, res) => {
  try {
    const reservation = await reservationService.getReservationById(
      req.params.id
    );
    if (reservation) {
      res.status(200).json(reservation);
    } else {
      res.status(404).json({ error: "Reserva não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createReservation = async (req, res) => {
  try {
    const { sala_id, usuario_id, data_inicio, data_fim, status } = req.body;
    const newReservation = await reservationService.createReservation(
      sala_id,
      usuario_id,
      data_inicio,
      data_fim,
      status
    );
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReservation = async (req, res) => {
  try {
    const { sala_id, usuario_id, data_inicio, data_fim, status } = req.body;
    const updatedReservation = await reservationService.updateReservation(
      req.params.id,
      sala_id,
      usuario_id,
      data_inicio,
      data_fim,
      status
    );
    if (updatedReservation) {
      res.status(200).json(updatedReservation);
    } else {
      res.status(404).json({ error: "Reserva não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const deletedReservation = await reservationService.deleteReservation(
      req.params.id
    );
    if (deletedReservation) {
      res.status(200).json(deletedReservation);
    } else {
      res.status(404).json({ error: "Reserva não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
};
