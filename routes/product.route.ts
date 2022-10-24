import { Router } from 'express';
import { productController } from '../controllers/index';

const router: Router = Router();

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:productId', productController.getProductById);

export default router;
