import express from 'express';
import { 
    getToDo, 
    saveToDo, 
    updateToDo, 
    deleteToDo,
    toggleCompleteToDo 
} from '../controllers/todo.controllers.js';

const router = express.Router();

router.get('/todos', getToDo);
router.post('/save', saveToDo);
router.post('/update', updateToDo);
router.post('/delete', deleteToDo);
router.post('/toggle', toggleCompleteToDo);

export default router;