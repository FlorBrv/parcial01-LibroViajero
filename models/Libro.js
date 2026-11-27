import mongoose from 'mongoose';

const libroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        minlength: [2, 'El título debe tener al menos 2 caracteres'],
        maxlength: [150, 'El título no puede superar los 150 caracteres']
    },
    autor: {
        type: String,
        required: [true, 'El autor es obligatorio'],
        trim: true,
        minlength: [2, 'El autor debe tener al menos 2 caracteres'],
        maxlength: [100, 'El autor no puede superar los 100 caracteres']
    },
    genero: {
        type: String,
        required: [true, 'El género es obligatorio'],
        trim: true,
        minlength: [2, 'El género debe tener al menos 2 caracteres'],
        maxlength: [60, 'El género no puede superar los 60 caracteres']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true,
        minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
        maxlength: [1000, 'La descripción no puede superar los 1000 caracteres']
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

const Libro = mongoose.model('Libro', libroSchema, 'libros');

export default Libro;
