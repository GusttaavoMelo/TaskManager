const { useState, useEffect } = React;

        const TaskManager = () => {
            const [tasks, setTasks] = useState(() => {
                const savedTasks = localStorage.getItem('tasks');
                return savedTasks ? JSON.parse(savedTasks) : [];
            });
            const [newTask, setNewTask] = useState('');
            const [filter, setFilter] = useState('all');
            const [editingTaskId, setEditingTaskId] = useState(null);
            const [editText, setEditText] = useState('');
            const [searchTerm, setSearchTerm] = useState('');
            
            useEffect(() => {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }, [tasks]);
            
            const addTask = () => {
                if (newTask.trim() === '') return;
                
                const task = {
                    id: Date.now(),
                    text: newTask,
                    completed: false,
                    createdAt: new Date().toISOString(),
                    priority: 'medium'
                };
                
                setTasks([task, ...tasks]);
                setNewTask('');
            };
            
            const toggleTask = (id) => {
                setTasks(tasks.map(task => 
                    task.id === id ? { ...task, completed: !task.completed } : task
                ));
            };
            
            const deleteTask = (id) => {
                setTasks(tasks.filter(task => task.id !== id));
            };
            
            const startEditing = (task) => {
                setEditingTaskId(task.id);
                setEditText(task.text);
            };
            
            const saveEdit = (id) => {
                setTasks(tasks.map(task => 
                    task.id === id ? { ...task, text: editText } : task
                ));
                setEditingTaskId(null);
                setEditText('');
            };
            
            const updatePriority = (id, priority) => {
                setTasks(tasks.map(task => 
                    task.id === id ? { ...task, priority } : task
                ));
            };
            
            const filteredTasks = tasks.filter(task => {
                if (filter === 'active') return !task.completed;
                if (filter === 'completed') return task.completed;
                return true;
            }).filter(task => 
                task.text.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            const getPriorityColor = (priority) => {
                switch (priority) {
                    case 'high': return 'bg-red-100 text-red-800';
                    case 'medium': return 'bg-yellow-100 text-yellow-800';
                    case 'low': return 'bg-green-100 text-green-800';
                    default: return 'bg-gray-100 text-gray-800';
                }
            };
            
            const handleKeyDown = (e) => {
                if (e.key === 'Enter') {
                    addTask();
                }
            };
            
            const clearCompleted = () => {
                setTasks(tasks.filter(task => !task.completed));
            };
            
            return (
                <div className="min-h-screen bg-gray-50">
                    <div className="gradient-bg text-white py-12 px-4 shadow-lg">
                        <div className="max-w-3xl mx-auto">
                            <h1 className="text-4xl font-bold mb-2">Task Manager</h1>
                            <p className="opacity-90">Organize your work and life with style</p>
                            
                            <div className="mt-8 relative">
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="What needs to be done?"
                                    className="w-full py-4 px-6 rounded-lg shadow-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                                />
                                <button
                                    onClick={addTask}
                                    className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="max-w-3xl mx-auto px-4 -mt-8">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-4 border-b">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="relative w-64">
                                        <input
                                            type="text"
                                            placeholder="Search tasks..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                                        />
                                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setFilter('all')}
                                            className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => setFilter('active')}
                                            className={`px-3 py-1 rounded-md ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                        >
                                            Active
                                        </button>
                                        <button
                                            onClick={() => setFilter('completed')}
                                            className={`px-3 py-1 rounded-md ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                        >
                                            Completed
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="max-h-96 overflow-y-auto scrollbar-hide">
                                {filteredTasks.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <i className="fas fa-tasks text-4xl mb-4 text-gray-300"></i>
                                        <p>No tasks found. Add a new task to get started!</p>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {filteredTasks.map(task => (
                                            <li key={task.id} className="task-item p-4 hover:bg-gray-50 transition-colors group">
                                                <div className="flex items-start">
                                                    <div className="flex items-center h-5 mr-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={task.completed}
                                                            onChange={() => toggleTask(task.id)}
                                                            className="checkbox h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                                        />
                                                    </div>
                                                    
                                                    {editingTaskId === task.id ? (
                                                        <div className="flex-1 flex items-center">
                                                            <input
                                                                type="text"
                                                                value={editText}
                                                                onChange={(e) => setEditText(e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                                                                className="flex-1 border-b border-purple-300 py-1 px-2 focus:outline-none focus:ring-0"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => saveEdit(task.id)}
                                                                className="ml-2 text-green-600 hover:text-green-800"
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingTaskId(null)}
                                                                className="ml-2 text-red-600 hover:text-red-800"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex-1">
                                                            <div className={`flex items-center ${task.completed ? 'opacity-60' : ''}`}>
                                                                <p className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                                    {task.text}
                                                                </p>
                                                                <span className={`ml-3 text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                                                    {task.priority}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {new Date(task.createdAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="task-actions opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                                                        {editingTaskId !== task.id && (
                                                            <>
                                                                <button
                                                                    onClick={() => startEditing(task)}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    title="Edit"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <div className="relative">
                                                                    <button
                                                                        className="text-purple-600 hover:text-purple-800"
                                                                        title="Priority"
                                                                    >
                                                                        <i className="fas fa-flag"></i>
                                                                    </button>
                                                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 hidden group-hover:block hover:block">
                                                                        <div className="py-1">
                                                                            <button
                                                                                onClick={() => updatePriority(task.id, 'high')}
                                                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                            >
                                                                                High
                                                                            </button>
                                                                            <button
                                                                                onClick={() => updatePriority(task.id, 'medium')}
                                                                                className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                                                                            >
                                                                                Medium
                                                                            </button>
                                                                            <button
                                                                                onClick={() => updatePriority(task.id, 'low')}
                                                                                className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                                                            >
                                                                                Low
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => deleteTask(task.id)}
                                                                    className="text-red-600 hover:text-red-800"
                                                                    title="Delete"
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            
                            <div className="p-4 border-t bg-gray-50 flex justify-between items-center text-sm text-gray-600">
                                <div>
                                    {tasks.filter(t => !t.completed).length} items left
                                </div>
                                <button
                                    onClick={clearCompleted}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Clear completed
                                </button>
                            </div>
                        </div>
                        
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="font-semibold text-lg mb-2 text-blue-700">Quick Stats</h3>
                                <div className="space-y-2">
                                    <p>Total tasks: {tasks.length}</p>
                                    <p>Completed: {tasks.filter(t => t.completed).length}</p>
                                    <p>Pending: {tasks.filter(t => !t.completed).length}</p>
                                </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="font-semibold text-lg mb-2 text-blue-700">Priority Distribution</h3>
                                <div className="space-y-2">
                                    <p className="flex items-center">
                                        <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                        High: {tasks.filter(t => t.priority === 'high').length}
                                    </p>
                                    <p className="flex items-center">
                                        <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                                        Medium: {tasks.filter(t => t.priority === 'medium').length}
                                    </p>
                                    <p className="flex items-center">
                                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                        Low: {tasks.filter(t => t.priority === 'low').length}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="font-semibold text-lg mb-2 text-blue-700">Productivity Tips</h3>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li>Prioritize your tasks</li>
                                    <li>Break large tasks into smaller ones</li>
                                    <li>Review your list daily</li>
                                    <li>Celebrate completed tasks</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <footer className="mt-12 py-6 text-gray-700 text-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div className="text-center md:text-left mb-4 md:mb-0">
                                    <p className="text-gray-700">© {new Date().getFullYear()} GusttaavoMelo </p>
                                </div>
                                <div className="flex space-x-6">
                                    <a href="https://github.com/GusttaavoMelo" className="text-gray-400 hover:text-blue-600">
                                        <i className="fab fa-github text-xl"></i>
                                    </a>
                                    <a href="https://www.linkedin.com/in/desenvolvedor-front-end-gustavo-melo" className="text-gray-400 hover:text-blue-600">
                                        <i className="fab fa-linkedin text-xl"></i>
                                    </a>
                                    <a href="https://gusttaavomeloo.netlify.app/" className="text-gray-400 hover:text-blue-600">
                                    <i className="fas fa-code text-xl"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            );
        };

        const App = () => {
            return <TaskManager />;
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);