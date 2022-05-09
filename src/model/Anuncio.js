const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Anuncio extends Model{}

User.init({
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    preco: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    imagem: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cep: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    logradouro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero: {
        type: DataTypes.STRING(5),
        allowNull: true
    },
    complemento: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    bairro: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    cidade: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
},{
    sequelize,
    modelName: 'Anuncio',
    tableName: 'anuncios'
});

module.exports = Anuncio;