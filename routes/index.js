import usuarioRouter from './usuarioRouter.js';
import libroRouter from './libroRouter.js';
import ejemplarRouter from './ejemplarRouter.js';

const routerAPI = (app) => {
    app.use('/api/usuarios', usuarioRouter);
    app.use('/api/libros', libroRouter);
    app.use('/api/ejemplares', ejemplarRouter);

    // Si piden una ruta de /api que no existe, respondemos 404 en JSON
    app.use('/api', (req, res) => {
        res.status(404).json({
            message: 'Ruta de la API no encontrada'
        });
    });
};

export default routerAPI;
