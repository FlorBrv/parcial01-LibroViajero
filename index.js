import express from 'express';
import dotenv from 'dotenv';
import { conectarDB } from './config/db.js';
import routerAPI from './routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Conexión a la base de datos
conectarDB();

// Middlewares para leer datos de formularios, JSON y servir archivos estáticos
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static('public'));

// Rutas de la API
routerAPI(app);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
