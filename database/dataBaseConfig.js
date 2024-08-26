const Sequelize = require('sequelize')
const config = require('../config/database')
const Endereco = require('../models/Endereco')
const connection = require = new Sequelize(config)
Endereco.init(connection)
Endereco.associate(connection.models)
module.exports = connection