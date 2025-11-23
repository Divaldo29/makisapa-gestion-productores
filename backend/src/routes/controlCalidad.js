const express = require('express');
const router = express.Router();
const {
  crearControlCalidad,
  listarControlesCalidad,
  obtenerControlCalidad
} = require('../controllers/controlCalidadController');

router.post('/', crearControlCalidad);
router.get('/', listarControlesCalidad);
router.get('/:id', obtenerControlCalidad);

module.exports = router;