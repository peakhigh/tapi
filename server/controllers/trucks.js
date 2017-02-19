let model = require('../models/trucks');

let BaseCtrlFactory = require('./base');

let currentModel = new BaseCtrlFactory({ model: model });

module.exports = { currentModel };
