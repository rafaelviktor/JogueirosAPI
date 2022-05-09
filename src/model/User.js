const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class User extends Model{}

User.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID
    },  
    user_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    celular: {
        type: DataTypes.STRING(11),
        allowNull: false
    }
},{
    sequelize,
    modelName: 'User',
    tableName: 'users'
});

module.exports = User;