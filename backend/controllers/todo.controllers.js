import ToDoModel from '../models/todo.model.js';

export const getToDo = async (req, res) => {
    try {
        const { 
            category, 
            priority, 
            completed, 
            sortBy = 'createdAt', 
            sortOrder = 'desc' 
        } = req.query;

        const filter = {};
        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        if (completed !== undefined) filter.completed = completed === 'true';

        const todos = await ToDoModel.find(filter)
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });
        
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const saveToDo = async (req, res) => {
    try {
        const { 
            text, 
            priority = 'medium', 
            category = 'other', 
            dueDate, 
            tags 
        } = req.body;

        const newTodo = new ToDoModel({
            text,
            priority,
            category,
            dueDate: dueDate ? new Date(dueDate) : null,
            tags
        });

        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updateToDo = async (req, res) => {
    try {
        const { _id, ...updateData } = req.body;
        
        const updatedTodo = await ToDoModel.findByIdAndUpdate(
            _id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleteToDo = async (req, res) => {
    try {
        const { _id } = req.body;
        const deletedTodo = await ToDoModel.findByIdAndDelete(_id);

        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const toggleCompleteToDo = async (req, res) => {
    try {
        const { _id } = req.body;
        const todo = await ToDoModel.findById(_id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todo.completed = !todo.completed;
        await todo.save();

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}