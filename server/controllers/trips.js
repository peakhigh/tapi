import model from '../models/trips';

import BaseCtrlFactory from './base';

let currentModel = new BaseCtrlFactory({ model: model });

export default { currentModel };
