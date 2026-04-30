import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Users, Calendar } from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  members: any[];
}

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // New Project Form State
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name, description });
      setShowForm(false);
      setName('');
      setDescription('');
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            New Project
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Create New Project</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project._id}
            to={`/projects/${project._id}`}
            className="block bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{project.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{project.description}</p>
              
              <div className="mt-4 border-t border-gray-100 pt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {project.members?.length || 0} members
                </div>
                <div className="flex items-center">
                  <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No projects found. {user?.role === 'Admin' ? 'Create one to get started.' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
