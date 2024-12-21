import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true,
    trim: true
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'shopping', 'other'],
    default: 'other'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const ToDo = mongoose.model('ToDo', todoSchema);

export default ToDo;