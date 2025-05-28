const Task = require('../models/Task');

const resolvers = {
  Query: {
    tasks: async (_, { status }) => {
      try {
        const query = status ? { status } : {};
        const tasks = await Task.find(query).sort({ createdAt: -1 });
        return tasks;
      } catch (error) {
        throw new Error('Failed to fetch tasks');
      }
    },
    task: async (_, { id }) => {
      try {
        const task = await Task.findById(id);
        if (!task) {
          throw new Error('Task not found');
        }
        return task;
      } catch (error) {
        throw new Error('Failed to fetch task');
      }
    },
  },
  Mutation: {
    addTask: async (_, { input }) => {
      try {
        const task = new Task({
          ...input,
          status: input.status || 'Todo',
        });
        await task.save();
        return task;
      } catch (error) {
        throw new Error('Failed to add task');
      }
    },
    updateTaskStatus: async (_, { id, status }) => {
      try {
        const task = await Task.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
        if (!task) {
          throw new Error('Task not found');
        }
        return task;
      } catch (error) {
        throw new Error('Failed to update task status');
      }
    },
  deleteTask: async (_, { id }) => {
  console.log('Deleting task with id:', id);
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      throw new Error('Task not found');
    }
    console.log('Deleted task:', task);
    return task;
  } catch (error) {
    console.error('Delete task error:', error);
    throw new Error(`Failed to delete task: ${error.message}`);
  }
},
  },
};

module.exports = resolvers;