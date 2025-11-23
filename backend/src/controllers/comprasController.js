const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crearCompra = async (req, res) => {
  try {
    const { id_lote, precio_x_kg, metodo_pago } = req.body;

    if (!id_lote || !precio_x_kg || !metodo_pago) {
      return res.status(400).json({ 
        error: 'Campos obligatorios: id_lote, precio_x_kg, metodo_pago' 
      });
    }

    const lote = await prisma.lote.findUnique({
      where: { id_lote: parseInt(id_lote) },
      include: { control_calidad: true }
    });

    if (!lote) {
      return res.status(404).json({ error: 'Lote no encontrado' });
    }

    if (lote.estado_lote !== 'APROBADO') {
      return res.status(400).json({ 
        error: 'El lote debe estar aprobado para procesar el pago' 
      });
    }

    const monto_total = parseFloat(precio_x_kg) * parseFloat(lote.peso_kg);

    const compra = await prisma.compra.create({
      data: {
        id_lote: parseInt(id_lote),
        precio_x_kg: parseFloat(precio_x_kg),
        monto_total,
        metodo_pago,
        estado_pago: 'PAGADO'
      },
      include: {
        lote: { include: { productor: true } }
      }
    });

    res.status(201).json(compra);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya existe una compra registrada para este lote' });
    }
    res.status(500).json({ error: 'Error al crear compra', details: error.message });
  }
};

const listarCompras = async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        lote: {
          include: {
            productor: true,
            control_calidad: true
          }
        }
      },
      orderBy: { fecha_pago: 'desc' }
    });
    res.json(compras);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar compras', details: error.message });
  }
};

const obtenerCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await prisma.compra.findUnique({
      where: { id_compra: parseInt(id) },
      include: {
        lote: {
          include: {
            productor: true,
            control_calidad: true
          }
        }
      }
    });

    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }

    res.json(compra);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener compra', details: error.message });
  }
};

const actualizarEstadoPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_pago } = req.body;

    const compra = await prisma.compra.update({
      where: { id_compra: parseInt(id) },
      data: { estado_pago }
    });

    res.json(compra);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado de pago', details: error.message });
  }
};

module.exports = {
  crearCompra,
  listarCompras,
  obtenerCompra,
  actualizarEstadoPago
};