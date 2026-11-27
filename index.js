import express from 'express';
import dotenv from 'dotenv';
import { conectarDB } from './config/db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Conexión a la base de datos
conectarDB();

// Middlewares para leer datos de formularios y JSON
app.use(express.urlencoded());
app.use(express.json());

// Ruta temporal para probar que el servidor responde
app.get('/', (req, res) => {
    res.send('<h1>API LibroViajero funcionando</h1>');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
