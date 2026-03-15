import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchTasks, createTask, deleteTask, updateTask } from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });
  
  const { logout } = useAuth();

  // FIX: Use useCallback to prevent re-render loops and cascading updates
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ page, limit: 5, search, status: statusFilter }).toString();
      const { data } = await fetchTasks(query);
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTask(newTask);
      setNewTask({ title: '', description: '', status: 'pending' });
      loadTasks();
      toast.success("Task added successfully!");
    } catch (err) {
      toast.error("Error creating task");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(id);
        if (tasks.length === 1 && page > 1) setPage(page - 1);
        else loadTasks();
        toast.success("Task deleted");
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleStatusChange = async (task) => {
    const statusCycle = ['pending', 'in-progress', 'completed'];
    const currentIndex = statusCycle.indexOf(task.status);
    const newStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    try {
      await updateTask(task._id, { status: newStatus });
      loadTasks();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Color Logic for Status Badges
  const getStatusStyles = (status) => {
    switch(status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  }

  // Color Logic for Card Borders
  const getCardBorder = (status) => {
    switch(status) {
      case 'completed': return 'border-l-4 border-emerald-500';
      case 'in-progress': return 'border-l-4 border-blue-500';
      default: return 'border-l-4 border-amber-500';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Task Dashboard
          </h1>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 bg-white text-red-500 border border-red-200 px-4 py-2 rounded-full font-semibold hover:bg-red-50 transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-4.293 4.293a1 1 0 01-1.414 0L4 7.414 5.414 6l3.293 3.293L13 6l1 1.414z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 border border-gray-100">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={search}
              onChange={handleSearchChange}
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <select 
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition bg-white text-gray-700 font-medium"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Create Task Form */}
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
             <span className="text-2xl">🚀</span> Add New Task
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Task Title"
              required
              className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <select 
              className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-700"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <textarea
            placeholder="Description (Encrypted in DB)"
            className="w-full p-3 border border-gray-200 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          ></textarea>
          <button type="submit" className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-bold hover:shadow-lg transition duration-300">
            Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-4">
          {loading ? (
             <div className="text-center py-20 text-gray-400 font-medium">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
               Loading tasks...
             </div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-20 bg-white rounded-xl shadow-sm">
              <span className="text-4xl">📭</span>
              <p className="mt-2 font-medium">No tasks found. Start by adding one!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className={`bg-white p-5 rounded-xl shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition duration-200 ${getCardBorder(task.status)}`}>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 mb-3 truncate">
                     {task.description || "No description provided"}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span 
                      className={`text-xs px-3 py-1 rounded-full border font-medium cursor-pointer select-none transition ${getStatusStyles(task.status)}`}
                      onClick={() => handleStatusChange(task)}
                      title="Click to change status"
                    >
                      {task.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                      {formatDate(task.createdAt)}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(task._id)}
                  className="text-red-400 hover:text-red-600 font-medium text-sm self-end md:self-center px-3 py-1 rounded hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2 items-center">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600 font-medium"
            > Previous </button>
            
            <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-bold shadow-sm">
              {page} / {totalPages}
            </span>
            
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600 font-medium"
            > Next </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;