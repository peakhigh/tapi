import controller from '../controllers/trips';
import BaseRoute from './base';

const baseRoute = new BaseRoute({ controller: controller, collection: 'Trips'});

export default baseRoute.router;