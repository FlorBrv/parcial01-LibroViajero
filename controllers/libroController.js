import mongoose from 'mongoose';
import Libro from '../models/Libro.js';
import Ejemplar from '../models/Ejemplar.js';

const ESTADOS_VALIDOS = ['disponible', 'prestado', 'reservado'];

class LibroController {
    async getAll(req, res) {
        try {
            const { titulo, autor, genero } = req.query;
            const filtro = {};

            // Armamos el filtro según los parámetros que lleguen por query
            if (titulo) {
                filtro.titulo = { $regex: titulo, $options: 'i' };
            }
            if (autor) {
                filtro.autor = { $regex: autor, $options: 'i' };
            }
            if (genero) {
                filtro.genero = { $regex: genero, $options: 'i' };
            }

            const libros = await Libro.find(filtro).sort({ titulo: 1 });

            res.status(200).json({
                message: 'success',
                data: libros
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener los libros'
            });
        }
    }

    async getEjemplaresByLibro(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'El ID de libro no es válido'
                });
            }

            const libroExiste = await Libro.findById(id);
            if (!libroExiste) {
                return res.status(404).json({
                    message: 'Libro no encontrado'
                });
            }

            const filtro = { libro: id };
            if (estado) {
                const estadoNormalizado = estado.toLowerCase();
                if (!ESTADOS_VALIDOS.includes(estadoNormalizado)) {
                    return res.status(400).json({
                        message: 'El estado debe ser disponible, prestado o reservado'
                    });
                }
                filtro.estado = estadoNormalizado;
            }

            const ejemplares = await Ejemplar.find(filtro)
                .populate('libro')
                .populate('propietario');

            res.status(200).json({
                message: 'success',
                data: ejemplares
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener los ejemplares del libro'
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'El ID de libro no es válido'
                });
            }

            const libro = await Libro.findById(id);

            if (!libro) {
                return res.status(404).json({
                    message: 'Libro no encontrado'
                });
            }

            res.status(200).json({
                message: 'success',
                data: libro
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener el libro'
            });
        }
    }

    async create(req, res) {
        try {
            const { titulo, autor, genero, descripcion } = req.body;

            if (!titulo || !autor || !genero || !descripcion) {
                return res.status(400).json({
                    message: 'Faltan campos obligatorios (titulo, autor, genero y descripcion)'
                });
            }

            const libro = await Libro.create({
                titulo,
                autor,
                genero,
                descripcion
            });

            res.status(201).json({
                message: 'success',
                data: libro
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const errores = Object.values(error.errors).map((err) => err.message);
                return res.status(400).json({
                    message: 'Error de validación',
                    errors: errores
                });
            }
            res.status(500).json({
                message: 'Error al crear el libro'
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'El ID de libro no es válido'
                });
            }

            const { titulo, autor, genero, descripcion } = req.body;

            if (!titulo || !autor || !genero || !descripcion) {
                return res.status(400).json({
                    message: 'Faltan campos obligatorios (titulo, autor, genero y descripcion)'
                });
            }

            const libro = await Libro.findByIdAndUpdate(
                id,
                { titulo, autor, genero, descripcion },
                { returnDocument: 'after', runValidators: true }
            );

            if (!libro) {
                return res.status(404).json({
                    message: 'Libro no encontrado'
                });
            }

            res.status(200).json({
                message: 'success',
                data: libro
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const errores = Object.values(error.errors).map((err) => err.message);
                return res.status(400).json({
                    message: 'Error de validación',
                    errors: errores
                });
            }
            res.status(500).json({
                message: 'Error al actualizar el libro'
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'El ID de libro no es válido'
                });
            }

            // No dejamos borrar un libro si todavía tiene ejemplares cargados
            const ejemplares = await Ejemplar.find({ libro: id });
            if (ejemplares.length > 0) {
                return res.status(400).json({
                    message: 'No se puede eliminar un libro que tiene ejemplares asociados'
                });
            }

            const libro = await Libro.findByIdAndDelete(id);

            if (!libro) {
                return res.status(404).json({
                    message: 'Libro no encontrado'
                });
            }

            res.status(200).json({
                message: 'Libro eliminado correctamente'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar el libro'
            });
        }
    }
}

export default LibroController;
