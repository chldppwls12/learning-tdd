import { Router } from 'express';
import { productController } from '../controllers/index';

const router: Router = Router();

router.post('/', productController.createProduct);

export default router;
