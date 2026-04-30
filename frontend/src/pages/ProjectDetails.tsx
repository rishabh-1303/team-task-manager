import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, MoreVertical, Calendar } from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  assignedTo: any;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // New Task Form
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchProjectAndTasks = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?project=${id}`),
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Failed to fetch project details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title,
        description,
        project: id,
        assignedTo: assignedTo || null,
        dueDate: dueDate || null,
      });
      setShowTaskForm(false);
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setDueDate('');
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading project...</div>;
  if (!project) return <div className="text-center text-red-500 py-12">Project not found or access denied.</div>;

  const columns = ['To Do', 'In Progress', 'Completed'];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6 flex justify-between items-start flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{project.description}</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Task
          </button>
        )}
      </div>

      {showTaskForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6 flex-shrink-0">
          <h2 className="text-lg font-medium mb-4">Create New Task</h2>
          <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assign To</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Unassigned</option>
                {project.members?.map((m: any) => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowTaskForm(false)}
                className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 flex space-x-6 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col} className="w-80 flex-shrink-0 flex flex-col bg-gray-100 rounded-lg">
            <div className="p-3 bg-gray-200 rounded-t-lg font-medium text-gray-700 flex justify-between items-center">
              <span>{col}</span>
              <span className="bg-gray-300 text-gray-700 text-xs py-1 px-2 rounded-full">
                {tasks.filter((t) => t.status === col).length}
              </span>
            </div>
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {tasks
                .filter((t) => t.status === col)
                .map((task) => (
                  <div key={task._id} className="bg-white p-4 rounded shadow-sm border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        {task.assignedTo ? (
                          <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold" title={task.assignedTo.name}>
                            {task.assignedTo.name.charAt(0)}
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs">?</div>
                        )}
                        {task.dueDate && (
                          <div className={`flex items-center text-xs ${new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                      
                      {/* Status changer dropdown */}
                      <select
                        className="text-xs border-gray-300 rounded py-1 pl-2 pr-6 focus:ring-indigo-500 focus:border-indigo-500"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {columns.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;
