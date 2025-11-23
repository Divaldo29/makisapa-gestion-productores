const express = require('express');
const router = express.Router();
const {
  crearLote,
  listarLotes,
  obtenerLote,
  actualizarLote
} = require('../controllers/lotesController');

router.post('/', crearLote);
router.get('/', listarLotes);
router.get('/:id', obtenerLote);
router.put('/:id', actualizarLote);

module.exports = router;