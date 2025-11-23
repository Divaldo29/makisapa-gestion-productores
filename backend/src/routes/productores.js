const express = require('express');
const router = express.Router();
const {
  crearProductor,
  listarProductores,
  obtenerProductor,
  actualizarProductor,
  eliminarProductor
} = require('../controllers/productoresController');

router.post('/', crearProductor);
router.get('/', listarProductores);
router.get('/:id', obtenerProductor);
router.put('/:id', actualizarProductor);
router.delete('/:id', eliminarProductor);

module.exports = router;