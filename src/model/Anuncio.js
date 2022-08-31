const mongoose = require('mongoose');

const AnuncioModel = mongoose.Schema({
    id_anunciante: {
        type: String,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    imagem: {
        type: String,
        required: true
    },
    cep: {
        type: Number,
        required: true
    },
    logradouro: {
        type: String,
        required: true
    },
    numero: {
        type: Number,
        required: false
    },
    complemento: {
        type: String,
        required: false
    },
    bairro: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    visualizacoes: {
        type: Number,
        required: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('anuncios', AnuncioModel);