let model = require('../models/trips');

let BaseCtrlFactory = require('./base');

let currentModel = new BaseCtrlFactory({ model: model });

module.exports = { currentModel };
