import mongoose from 'mongoose';
import Usuario from '../models/Usuario.js';
import Ejemplar from '../models/Ejemplar.js';

class UsuarioController {
    async getAll(req, res) {
        try {
            const usuarios = await Usuario.find();

            res.status(200).json({
                message: 'success',
                data: usuarios
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener los usuarios'
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'El ID de usuario no es válido'
                });
            }

            const usuario = await Usuario.findById(id);

            if (!usuario) {
                return res.status(404).json({
                    message: 'Usuario no encontrado'
                });
            }

            res.status(200).json({
                message: 'success',
                data: usuario
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener el usuario'
            });
        }
    }

    async create(req, res) {
        try {
            const { nombre, email, ciudad } = req.body;

            if (!nombre || !email || !ciudad) {
                return res.status(400).json({
                    message: 'Faltan campos obligatorios (nombre, email y ciudad)'
                });
            }

            const usuario = await Usuario.create({
                nombre,
                email,
                ciudad
            });

            res.status(201).json({
                message: 'success',
                data: usuario
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
                    message: 'Ya existe un usuario registrado con ese email'
                });
            }
            res.status(500).json({
                message: 'Error al crear el usuario'
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'El ID de usuario no es válido'
                });
            }

            const { nombre, email, ciudad } = req.body;

            if (!nombre || !email || !ciudad) {
                return res.status(400).json({
                    message: 'Faltan campos obligatorios (nombre, email y ciudad)'
                });
            }

            const usuario = await Usuario.findByIdAndUpdate(
                id,
                { nombre, email, ciudad },
                { returnDocument: 'after', runValidators: true }
            );

            if (!usuario) {
                return res.status(404).json({
                    message: 'Usuario no encontrado'
                });
            }

            res.status(200).json({
                message: 'success',
                data: usuario
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
                    message: 'Ya existe un usuario registrado con ese email'
                });
            }
            res.status(500).json({
                message: 'Error al actualizar el usuario'
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'El ID de usuario no es válido'
                });
            }

            // No se puede borrar un usuario si todavía tiene ejemplares registrados
            const ejemplares = await Ejemplar.find({ propietario: id });
            if (ejemplares.length > 0) {
                return res.status(400).json({
                    message: 'No se puede eliminar un usuario que tiene ejemplares asociados'
                });
            }

            const usuario = await Usuario.findByIdAndDelete(id);

            if (!usuario) {
                return res.status(404).json({
                    message: 'Usuario no encontrado'
                });
            }

            res.status(200).json({
                message: 'Usuario eliminado correctamente'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar el usuario'
            });
        }
    }
}

export default UsuarioController;
