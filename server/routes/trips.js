import controller from '../controllers/trips';
import BaseRoute from './base';

const baseRoute = new BaseRoute({ controller: controller});

export default baseRoute.router;