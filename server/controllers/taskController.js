const Task = require('../models/Task');
const { encryptData, decryptData } = require('../utils/encryption');

// @desc    Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    // Encrypt description before saving
    const encryptedDesc = description ? encryptData(description) : '';

    const task = await Task.create({
      user: req.user._id,
      title,
      description: encryptedDesc,
      status
    });

    res.status(201).json({
        ...task.toObject(),
        description: description // Return original to frontend immediately
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get Tasks (with Pagination, Filter, Search)
exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = { user: req.user._id };

    // Filter by status
    if (status) query.status = status;

    // Search by title (Regex for partial match)
    if (search) query.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(query);

    // Decrypt description before sending
    const decryptedTasks = tasks.map(task => ({
      ...task.toObject(),
      description: decryptData(task.description)
    }));

    res.json({ tasks: decryptedTasks, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update Task
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Authorization: Ensure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, description, status } = req.body;

    task.title = title || task.title;
    task.status = status || task.status;
    if(description) task.description = encryptData(description);

    const updatedTask = await task.save();

    res.json({
        ...updatedTask.toObject(),
        description: decryptData(updatedTask.description)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};