const express = require('express');
const cors = require('cors');

// 1. Importa la configuración de Prisma que creaste
const prismaConfig = require('./prisma.config.js'); 

// 2. Importa la clase PrismaClient
const { PrismaClient } = require('@prisma/client');

const app = express();

// 3. Inicializa el cliente de Prisma pasándole la configuración
const prisma = new PrismaClient(prismaConfig); 

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Makisapa - Sistema de Proveedores' });
});

const productoresRoutes = require('./routes/productores');
const lotesRoutes = require('./routes/lotes');
const controlCalidadRoutes = require('./routes/controlCalidad');
const comprasRoutes = require('./routes/compras');

app.use('/api/productores', productoresRoutes);
app.use('/api/lotes', lotesRoutes);
app.use('/api/control-calidad', controlCalidadRoutes);
app.use('/api/compras', comprasRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = { app, prisma };
