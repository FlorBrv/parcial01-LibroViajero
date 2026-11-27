import mongoose from 'mongoose';
import Ejemplar from '../models/Ejemplar.js';
import Libro from '../models/Libro.js';
import Usuario from '../models/Usuario.js';

const ESTADOS_VALIDOS = ['disponible', 'prestado', 'reservado'];

class EjemplarController {
    async getAll(req, res) {
        try {
            const { estado, ubicacion, codigo } = req.query;
            const filtro = {};

            if (estado) {
                const estadoNormalizado = estado.toLowerCase();
                if (!ESTADOS_VALIDOS.includes(estadoNormalizado)) {
                    return res.status(400).json({
                        message: 'El estado debe ser disponible, prestado o reservado'
                    });
                }
                filtro.estado = estadoNormalizado;
            }
            if (ubicacion) {
                filtro.ubicacion = { $regex: ubicacion, $options: 'i' };
            }
            if (codigo) {
                filtro.codigo = codigo.toUpperCase();
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
                message: 'Error al obtener los ejemplares'
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'El ID de ejemplar no es válido'
                });
            }

            const ejemplar = await Ejemplar.findById(id)
                .populate('libro')
                .populate('propietario');

            if (!ejemplar) {
                return res.status(404).json({
                    message: 'Ejemplar no encontrado'
                });
            }

            res.status(200).json({
                message: 'success',
                data: ejemplar
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener el ejemplar'
            });
        }
    }

    async create(req, res) {
        try {
            const { codigo, libro, propietario, estado, ubicacion } = req.body;

            if (!codigo || !libro || !propietario || !ubicacion) {
                return res.status(400).json({
                    message: 'Faltan campos obligatorios (codigo, libro, propietario y ubicacion)'
                });
            }

            if (!mongoose.Types.ObjectId.isValid(libro)) {
                return res.status(400).json({
                    message: 'El ID de libro no es válido'
                });
            }

            if (!mongoose.Types.ObjectId.isValid(propietario)) {
                return res.status(400).json({
                    message: 'El ID de propietario no es válido'
                });
            }

            // Validacion de libro y usuario
            const libroExiste = await Libro.findById(libro);
            if (!libroExiste) {
                return res.status(404).json({
                    message: 'El libro indicado no existe'
                });
            }

            const propietarioExiste = await Usuario.findById(propietario);
            if (!propietarioExiste) {
                return res.status(404).json({
                    message: 'El usuario propietario indicado no existe'
                });
            }

            const ejemplar = await Ejemplar.create({
                codigo,
                libro,
                propietario,
                estado,
                ubicacion
            });

            res.status(201).json({
                message: 'success',
                data: ejemplar
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const errores = Object.values(error.errors).map((err) => err.message);
                return res.status(400).json({
                    message: 'Error de validación',
                    errors: errores
                });
            }
            if (error.code === 11000) {
                return res.status(400).json({
                    message: 'Ya existe un ejemplar registrado con ese código'
                });
            }
            res.status(500).json({
                message: 'Error al crear el ejemplar'
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'El ID de ejemplar no es válido'
                });
            }

            const { codigo, libro, propietario, estado, ubicacion } = req.body;

            if (!codigo || !libro || !propietario || !estado || !ubicacion) {
                return res.status(400).json({
                    message: 'Faltan campos obligatorios (codigo, libro, propietario, estado y ubicacion)'
                });
            }

            if (!mongoose.Types.ObjectId.isValid(libro)) {
                return res.status(400).json({
                    message: 'El ID de libro no es válido'
                });
            }

            if (!mongoose.Types.ObjectId.isValid(propietario)) {
                return res.status(400).json({
                    message: 'El ID de propietario no es válido'
                });
            }

            const libroExiste = await Libro.findById(libro);
            if (!libroExiste) {
                return res.status(404).json({
                    message: 'El libro indicado no existe'
                });
            }

            const propietarioExiste = await Usuario.findById(propietario);
            if (!propietarioExiste) {
                return res.status(404).json({
                    message: 'El usuario propietario indicado no existe'
                });
            }

            const ejemplar = await Ejemplar.findByIdAndUpdate(
                id,
                { codigo, libro, propietario, estado, ubicacion },
                { returnDocument: 'after', runValidators: true }
            )
                .populate('libro')
                .populate('propietario');

            if (!ejemplar) {
                return res.status(404).json({
                    message: 'Ejemplar no encontrado'
                });
            }

            res.status(200).json({
                message: 'success',
                data: ejemplar
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const errores = Object.values(error.errors).map((err) => err.message);
                return res.status(400).json({
                    message: 'Error de validación',
                    errors: errores
                });
            }
            if (error.code === 11000) {
                return res.status(400).json({
                    message: 'Ya existe un ejemplar registrado con ese código'
                });
            }
            res.status(500).json({
                message: 'Error al actualizar el ejemplar'
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'El ID de ejemplar no es válido'
                });
            }

            const ejemplar = await Ejemplar.findByIdAndDelete(id);

            if (!ejemplar) {
                return res.status(404).json({
                    message: 'Ejemplar no encontrado'
                });
            }

            res.status(200).json({
                message: 'Ejemplar eliminado correctamente'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar el ejemplar'
            });
        }
    }
}

export default EjemplarController;
