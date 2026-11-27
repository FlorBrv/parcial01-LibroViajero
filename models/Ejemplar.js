import mongoose from 'mongoose';

const ejemplarSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: [true, 'El código identificador es obligatorio'],
        unique: true,
        trim: true,
        uppercase: true,
        minlength: [3, 'El código debe tener al menos 3 caracteres'],
        maxlength: [30, 'El código no puede superar los 30 caracteres']
    },
    libro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Libro',
        required: [true, 'El libro es obligatorio']
    },
    propietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El propietario es obligatorio']
    },
    estado: {
        type: String,
        enum: {
            values: ['disponible', 'prestado', 'reservado'],
            message: 'El estado debe ser disponible, prestado o reservado'
        },
        default: 'disponible'
    },
    ubicacion: {
        type: String,
        required: [true, 'La ubicación actual es obligatoria'],
        trim: true,
        minlength: [2, 'La ubicación debe tener al menos 2 caracteres'],
        maxlength: [120, 'La ubicación no puede superar los 120 caracteres']
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

const Ejemplar = mongoose.model('Ejemplar', ejemplarSchema, 'ejemplares');

export default Ejemplar;
