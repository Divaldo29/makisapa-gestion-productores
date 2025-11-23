const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crearProductor = async (req, res) => {
  try {
    const { nombres, apellidos, direccion, dni } = req.body;

    if (!nombres || !apellidos || !dni) {
      return res.status(400).json({ error: 'Campos obligatorios: nombres, apellidos, dni' });
    }

    const productor = await prisma.productor.create({
      data: { nombres, apellidos, direccion, dni }
    });

    res.status(201).json(productor);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'El DNI ya está registrado' });
    }
    res.status(500).json({ error: 'Error al crear productor', details: error.message });
  }
};

const listarProductores = async (req, res) => {
  try {
    const productores = await prisma.productor.findMany({
      include: { lotes: true },
      orderBy: { fecha_registro: 'desc' }
    });
    res.json(productores);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar productores', details: error.message });
  }
};

const obtenerProductor = async (req, res) => {
  try {
    const { id } = req.params;
    const productor = await prisma.productor.findUnique({
      where: { id_productor: parseInt(id) },
      include: {
        lotes: {
          include: {
            control_calidad: true,
            compra: true
          }
        }
      }
    });

    if (!productor) {
      return res.status(404).json({ error: 'Productor no encontrado' });
    }

    res.json(productor);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productor', details: error.message });
  }
};

const actualizarProductor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombres, apellidos, direccion, dni } = req.body;

    const productor = await prisma.productor.update({
      where: { id_productor: parseInt(id) },
      data: { nombres, apellidos, direccion, dni }
    });

    res.json(productor);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Productor no encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar productor', details: error.message });
  }
};

const eliminarProductor = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.productor.delete({
      where: { id_productor: parseInt(id) }
    });
    res.json({ message: 'Productor eliminado correctamente' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Productor no encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar productor', details: error.message });
  }
};

module.exports = {
  crearProductor,
  listarProductores,
  obtenerProductor,
  actualizarProductor,
  eliminarProductor
};