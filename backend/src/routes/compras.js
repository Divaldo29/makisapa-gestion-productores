const express = require('express');
const router = express.Router();
const {
  crearCompra,
  listarCompras,
  obtenerCompra,
  actualizarEstadoPago
} = require('../controllers/comprasController');

router.post('/', crearCompra);
router.get('/', listarCompras);
router.get('/:id', obtenerCompra);
router.put('/:id', actualizarEstadoPago);

module.exports = router;