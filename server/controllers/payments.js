let model = require('../models/payments');

let BaseCtrlFactory = require('./base');

let currentModel = new BaseCtrlFactory({ model: model });

module.exports = { currentModel };
