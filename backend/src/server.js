const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Makisapa - Sistema de Proveedores',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: 'OK', database: 'Connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'Disconnected', error: error.message });
  }
});

// Routes
const productoresRoutes = require('./routes/productores');
const lotesRoutes = require('./routes/lotes');
const controlCalidadRoutes = require('./routes/controlCalidad');
const comprasRoutes = require('./routes/compras');

app.use('/api/productores', productoresRoutes);
app.use('/api/lotes', lotesRoutes);
app.use('/api/control-calidad', controlCalidadRoutes);
app.use('/api/compras', comprasRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = { app, prisma };