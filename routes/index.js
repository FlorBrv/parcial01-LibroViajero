import usuarioRouter from './usuarioRouter.js';
import libroRouter from './libroRouter.js';
import ejemplarRouter from './ejemplarRouter.js';

const routerAPI = (app) => {
    app.use('/api/usuarios', usuarioRouter);
    app.use('/api/libros', libroRouter);
    app.use('/api/ejemplares', ejemplarRouter);

    // Error 404 si se solicita una ruta de la API que no existe
    app.use('/api', (req, res) => {
        res.status(404).json({
            message: 'Ruta de la API no encontrada'
        });
    });
};

export default routerAPI;
