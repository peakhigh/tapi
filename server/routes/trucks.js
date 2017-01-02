import controller from '../controllers/trucks';
import BaseRoute from './base';

const baseRoute = new BaseRoute({ controller: controller});

export default baseRoute.router;