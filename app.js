document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const itemsLeft = document.getElementById('items-left');
    const clearCompleted = document.getElementById('clear-completed');
    const themeToggle = document.getElementById('theme-toggle');
    
    // State
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';
    let darkMode = localStorage.getItem('darkMode') === 'true';

    // Apply initial theme
    if (darkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Toggle theme function
    const toggleTheme = () => {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        themeToggle.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', darkMode);
    };

    // Theme toggle event listener
    themeToggle.addEventListener('click', toggleTheme);

    // Render todos based on current filter
    const renderTodos = () => {
        todoList.innerHTML = '';
        
        // Filter todos based on current filter
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });
        
        // Create elements for each todo
        filteredTodos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => toggleTodo(todo.id));
            
            const todoText = document.createElement('span');
            todoText.className = 'todo-text';
            todoText.textContent = todo.text;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
            
            li.appendChild(checkbox);
            li.appendChild(todoText);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
        
        // Update items left
        const activeTodos = todos.filter(todo => !todo.completed);
        itemsLeft.textContent = `${activeTodos.length} item${activeTodos.length !== 1 ? 's' : ''} left`;
    };
    
    // Add new todo
    const addTodo = () => {
        const text = todoInput.value.trim();
        if (!text) return;
        
        const newTodo = {
            id: Date.now(),
            text,
            completed: false
        };
        
        todos.push(newTodo);
        todoInput.value = '';
        saveTodos();
        renderTodos();
    };
    
    // Toggle todo completion status
    const toggleTodo = (id) => {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        
        saveTodos();
        renderTodos();
    };
    
    // Delete a todo
    const deleteTodo = (id) => {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    };
    
    // Clear completed todos
    const clearCompletedTodos = () => {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    };
    
    // Set active filter
    const setFilter = (filter) => {
        currentFilter = filter;
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        renderTodos();
    };
    
    // Save todos to local storage
    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };
    
    // Event listeners
    addButton.addEventListener('click', addTodo);
    
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            setFilter(button.dataset.filter);
        });
    });
    
    clearCompleted.addEventListener('click', clearCompletedTodos);
    
    // Initial render
    renderTodos();
});
