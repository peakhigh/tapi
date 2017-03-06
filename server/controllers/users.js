let model = require('../models/users');

let BaseCtrlFactory = require('./base');

let currentModel = new BaseCtrlFactory({ model: model });

module.exports = { currentModel };
