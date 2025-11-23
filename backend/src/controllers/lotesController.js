const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crearLote = async (req, res) => {
  try {
    const { id_productor, peso_kg, tipo_cafe, observaciones } = req.body;

    if (!id_productor || !peso_kg || !tipo_cafe) {
      return res.status(400).json({ error: 'Campos obligatorios: id_productor, peso_kg, tipo_cafe' });
    }

    const lote = await prisma.lote.create({
      data: {
        id_productor: parseInt(id_productor),
        peso_kg: parseFloat(peso_kg),
        tipo_cafe,
        observaciones,
        estado_lote: 'PENDIENTE'
      },
      include: { productor: true }
    });

    res.status(201).json(lote);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear lote', details: error.message });
  }
};

const listarLotes = async (req, res) => {
  try {
    const { estado } = req.query;
    const where = estado ? { estado_lote: estado.toUpperCase() } : {};

    const lotes = await prisma.lote.findMany({
      where,
      include: {
        productor: true,
        control_calidad: true,
        compra: true
      },
      orderBy: { fecha_recepcion: 'desc' }
    });

    res.json(lotes);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar lotes', details: error.message });
  }
};

const obtenerLote = async (req, res) => {
  try {
    const { id } = req.params;
    const lote = await prisma.lote.findUnique({
      where: { id_lote: parseInt(id) },
      include: {
        productor: true,
        control_calidad: true,
        compra: true
      }
    });

    if (!lote) {
      return res.status(404).json({ error: 'Lote no encontrado' });
    }

    res.json(lote);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener lote', details: error.message });
  }
};

const actualizarLote = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_lote, observaciones } = req.body;

    const lote = await prisma.lote.update({
      where: { id_lote: parseInt(id) },
      data: { estado_lote, observaciones }
    });

    res.json(lote);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar lote', details: error.message });
  }
};

module.exports = {
  crearLote,
  listarLotes,
  obtenerLote,
  actualizarLote
};