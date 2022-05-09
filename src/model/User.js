const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class User extends Model{}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
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