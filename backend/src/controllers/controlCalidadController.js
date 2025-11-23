const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crearControlCalidad = async (req, res) => {
  try {
    const { id_lote, humedad, defectos, taza, resultado, aprobado } = req.body;

    if (!id_lote || humedad === undefined || defectos === undefined || !taza || !resultado) {
      return res.status(400).json({ 
        error: 'Campos obligatorios: id_lote, humedad, defectos, taza, resultado, aprobado' 
      });
    }

    const control = await prisma.controlCalidad.create({
      data: {
        id_lote: parseInt(id_lote),
        humedad: parseFloat(humedad),
        defectos: parseInt(defectos),
        taza,
        resultado,
        aprobado: aprobado === true || aprobado === 'true'
      }
    });

    let nuevoEstado = 'EN_CONTROL';
    if (resultado === 'APROBADO' && aprobado) {
      nuevoEstado = 'APROBADO';
    } else if (resultado === 'RECHAZADO' || !aprobado) {
      nuevoEstado = 'RECHAZADO';
    }

    await prisma.lote.update({
      where: { id_lote: parseInt(id_lote) },
      data: { estado_lote: nuevoEstado }
    });

    res.status(201).json(control);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear control de calidad', details: error.message });
  }
};

const listarControlesCalidad = async (req, res) => {
  try {
    const controles = await prisma.controlCalidad.findMany({
      include: {
        lote: { include: { productor: true } }
      },
      orderBy: { fecha_control: 'desc' }
    });
    res.json(controles);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar controles', details: error.message });
  }
};

const obtenerControlCalidad = async (req, res) => {
  try {
    const { id } = req.params;
    const control = await prisma.controlCalidad.findUnique({
      where: { id_control: parseInt(id) },
      include: {
        lote: { include: { productor: true } }
      }
    });

    if (!control) {
      return res.status(404).json({ error: 'Control de calidad no encontrado' });
    }

    res.json(control);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener control', details: error.message });
  }
};

module.exports = {
  crearControlCalidad,
  listarControlesCalidad,
  obtenerControlCalidad
};