const mongoose = require('mongoose');

const ReservaModel = mongoose.Schema({
    id_usuario: {
        type: String,
        required: true
    },
    id_anuncio: {
        type: String,
        required: true
    },
    data_reserva: {
        type: String,
        required: true
    },
    hora_inicio: {
        type: String,
        required: true
    },
    hora_final: {
        type: String,
        required: true
    },
    data_inclusao: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('reservas', ReservaModel);