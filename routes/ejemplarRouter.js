import { Router } from 'express';
import EjemplarController from '../controllers/ejemplarController.js';

const router = Router();
const controller = new EjemplarController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
