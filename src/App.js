import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';


function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('other');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // Use environment variable for API base URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
    const navigate = useNavigate();

    const makeApiRequest = useCallback(async (url, method = 'GET', data = null) => {
      setLoading(true);
        setError('');
        try {
            const response = await axios({
              url,
              method,
              data,
               headers: {
                   'Content-Type': 'application/json',
                }
            });
            setLoading(false)
            return response.data;
        } catch(error){
            setLoading(false);
            setError(error.message || 'An error occured');
            console.log(error.message);
            throw error;
        }
    },[])



  // Fetch todos
    const fetchTodos = useCallback(async () => {
         const queryParams = new URLSearchParams({
            ...(filter !== 'all' && { completed: filter === 'completed' }),
            ...(priority !== 'all' && { priority: priority !== "all" ? priority : "" }),
            ...(category !== 'all' && { category: category !== "all" ? category : "" }),
            sortBy: 'createdAt',
            sortOrder: 'desc'
        }).toString()
      try{
        const todos = await makeApiRequest(`${API_BASE_URL}/todos?${queryParams}`);
        setTodos(todos);
      } catch(error){
           console.log(error.message);
      }
    },[filter, priority, category, API_BASE_URL, makeApiRequest])


    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);


 const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
    
      try {
        const newTodo = await makeApiRequest(`${API_BASE_URL}/save`, 'POST',{
            text: inputText,
            priority,
            category,
            dueDate: dueDate ? new Date(dueDate) : null
        });
        setTodos([newTodo, ...todos]);
    
          // Reset form
          setInputText('');
          setPriority('medium');
          setCategory('other');
          setDueDate('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
      };

    const handleEditTodo = async (e) => {
         e.preventDefault();
         if (!inputText.trim()) return;

        try {
        const updatedTodo = await makeApiRequest(`${API_BASE_URL}/update`, 'POST', {
          _id: editingTodo._id,
          text: inputText,
          priority,
          category,
           dueDate: dueDate ? new Date(dueDate) : null
        });


          setTodos(todos.map(todo =>
            todo._id === updatedTodo._id ? updatedTodo : todo
          ));

          // Reset editing state
          setEditingTodo(null);
          setInputText('');
          setPriority('medium');
          setCategory('other');
          setDueDate('');
        } catch (error) {
          console.error('Error updating todo:', error);
        }
    };
  
  const startEditing = (todo) => {
    setEditingTodo(todo);
    setInputText(todo.text);
    setPriority(todo.priority);
    setCategory(todo.category);
      setDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');

  };

    const handleDeleteTodo = async (id) => {
      try {
        await makeApiRequest(`${API_BASE_URL}/delete`, 'POST', { _id: id });
        setTodos(todos.filter(todo => todo._id !== id));
      } catch (error) {
          console.error('Error deleting todo:', error);
      }
    };
  
    const toggleCompleteTodo = async (id) => {
    try {
        const updatedTodo = await makeApiRequest(`${API_BASE_URL}/toggle`, 'POST',{_id: id });
          setTodos(todos.map(todo =>
            todo._id === updatedTodo._id ? updatedTodo : todo
          ));
        } catch (error) {
          console.error('Error toggling todo:', error);
        }
    };
    const handleSubmit = editingTodo ? handleEditTodo : handleAddTodo;
  return (
        <div className="App">
          
                <h1>Teddy's Todo List 🧸</h1>

                {/* Filters */}
                <div className="filters">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                      <option value="all">All Todos</option>
                      <option value="completed">Completed</option>
                      <option value="active">Active</option>
                    </select>

                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                      <option value="all">All Priorities</option>
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>

                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="all">All Categories</option>
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="shopping">Shopping</option>
                      <option value="other">Other</option>
                    </select>
                </div>

                <form onSubmit={handleSubmit}>
                   <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="What's your next adventure? 🐻"
                      required
                    />
                
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                         <option value="low">Low Priority 🟢</option>
                        <option value="medium">Medium Priority 🟠</option>
                        <option value="high">High Priority 🔴</option>
                  </select>

                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="work">Work 💼</option>
                        <option value="personal">Personal 🏠</option>
                        <option value="shopping">Shopping 🛍️</option>
                        <option value="other">Other 📝</option>
                    </select>

                  <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      placeholder="Due Date"
                  />

                  <button type="submit">
                      {editingTodo ? 'Update Todo 📝' : 'Add Todo ➕'}
                  </button>

                    {editingTodo && (
                      <button
                        type="button"
                        onClick={() => {
                            setEditingTodo(null);
                            setInputText('');
                            setPriority('medium');
                            setCategory('other');
                            setDueDate('');
                        }}
                      >
                        Cancel ❌
                        </button>
                      )}
                </form>

                <ul>
                {todos.map((todo) => (
                  <li
                    key={todo._id}
                    className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.priority}`}
                  >
                    <div className="todo-content">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleCompleteTodo(todo._id)}
                      />
                        <span>{todo.text}</span>
                        {todo.dueDate && (
                        <small className="due-date">
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </small>
                      )}
                      <span className="category-tag">{todo.category}</span>
                    </div>
                      <div className="todo-actions">
                       <button onClick={() => startEditing(todo)}>Edit 📝</button>
                       <button onClick={() => handleDeleteTodo(todo._id)}>Delete 🗑️</button>
                    </div>
                  </li>
                  ))}
                  </ul>
        </div>
  );
}

export default App;