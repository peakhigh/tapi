import model from '../models/trucks';

import BaseCtrlFactory from './base';

let currentModel = new BaseCtrlFactory({ model: model });

export default { currentModel };
