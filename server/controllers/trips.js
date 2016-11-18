import Trips from '../models/trips';

import BaseCtrlFactory from './base';

let currentModel = new BaseCtrlFactory({ model: Trips });

export default { currentModel };
