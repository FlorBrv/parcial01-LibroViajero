import { Router } from 'express';
import LibroController from '../controllers/libroController.js';

const router = Router();
const controller = new LibroController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/ejemplares', controller.getEjemplaresByLibro);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
