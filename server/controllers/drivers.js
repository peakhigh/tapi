let model = require('../models/drivers');

let BaseCtrlFactory = require('./base');

let currentModel = new BaseCtrlFactory({ model: model });

module.exports = { currentModel };
