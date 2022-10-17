import { Router } from 'express';
import { productController } from '../controllers/index';

const router: Router = Router();

router.get('/', productController.getAllProduct);

export default router;
