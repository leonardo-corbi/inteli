const reservationLogService = require("../services/reservationLogService");

const getAllReservationLogs = async (req, res) => {
  try {
    const logs = await reservationLogService.getAllReservationLogs();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReservationLogById = async (req, res) => {
  try {
    const log = await reservationLogService.getReservationLogById(
      req.params.id
    );
    if (log) {
      res.status(200).json(log);
    } else {
      res.status(404).json({ error: "Log de reserva não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLogsByReservationId = async (req, res) => {
  try {
    const logs = await reservationLogService.getLogsByReservationId(
      req.params.reserva_id
    );
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createReservationLog = async (req, res) => {
  try {
    const { reserva_id, alterado_por_id, descricao } = req.body;
    const newLog = await reservationLogService.createReservationLog(
      reserva_id,
      alterado_por_id,
      descricao
    );
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReservationLog = async (req, res) => {
  try {
    const deletedLog = await reservationLogService.deleteReservationLog(
      req.params.id
    );
    if (deletedLog) {
      res.status(200).json(deletedLog);
    } else {
      res.status(404).json({ error: "Log de reserva não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllReservationLogs,
  getReservationLogById,
  getLogsByReservationId,
  createReservationLog,
  deleteReservationLog,
};
