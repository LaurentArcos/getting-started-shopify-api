import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import ordersRoutes from './routes/ordersRoutes.mjs';
import locationsRoutes from './routes/locationsRoutes.mjs';
import productsRoutes from './routes/productsRoutes.mjs';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

// Utilisation des routeurs
app.use('/api/orders', ordersRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/products', productsRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});