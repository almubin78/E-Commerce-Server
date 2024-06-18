const express = require('express');
const demoUsers = require('../demoUser');
const seedController = require('../controller/seedController');
const seedRouter = express.Router()

seedRouter.get('/add',seedController)

module.exports = seedRouter