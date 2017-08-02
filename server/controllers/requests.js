//bids, Reviews, Messages, Rating
let model = require('../models/requests');

let BaseCtrlFactory = require('./base');

let currentModel = new BaseCtrlFactory({ model: model });

module.exports = { currentModel };
