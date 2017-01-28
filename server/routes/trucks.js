import controller from '../controllers/trucks';
import BaseRoute from './base';

const baseRoute = new BaseRoute({ controller: controller, collection: 'Trucks'});

export default baseRoute.router;