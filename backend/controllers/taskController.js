import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
export const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;

    const proj = await Project.findById(project);
    if (!proj) {
      res.status(404);
      throw new Error('Project not found');
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { project } = req.query;
    let query = {};

    if (project) {
      query.project = project;
      // Also ensure the user has access to this project
      const proj = await Project.findById(project);
      if (req.user.role !== 'Admin' && (!proj || !proj.members.includes(req.user._id))) {
        res.status(403);
        throw new Error('Not authorized to view tasks for this project');
      }
    } else if (req.user.role !== 'Admin') {
      // Member getting all tasks without project filter - get all tasks they have access to
      const myProjects = await Project.find({ members: req.user._id });
      const myProjectIds = myProjects.map(p => p._id);
      query.project = { $in: myProjectIds };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, status, dueDate } = req.body;

    const task = await Task.findById(req.params.id).populate('project');

    if (task) {
      // Admin can update everything. Member can only update status.
      if (req.user.role === 'Admin') {
        task.title = title || task.title;
        task.description = description || task.description;
        task.assignedTo = assignedTo || task.assignedTo;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;
      } else {
        // Check if member is part of the project
        const isMember = task.project.members.includes(req.user._id);
        if (!isMember) {
          res.status(403);
          throw new Error('Not authorized to update this task');
        }
        if (status) task.status = status;
      }

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};
