const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));
app.use(express.json());

const tasks = [];

const resetTasks = () => {
  tasks.length = 0;
};

const validateTaskPayload = (payload) => {
  if (!payload || typeof payload.title !== 'string' || !payload.title.trim()) {
    return 'Task title is required.';
  }
  return null;
};

const toggleTaskCompletion = (task) => {
  task.completed = !task.completed;
  return task;
};

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const validationError = validateTaskPayload(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { title, due, notes } = req.body;
  const task = {
    id: randomUUID(),
    title: title.trim(),
    notes: notes ? String(notes).trim() : '',
    due: due || null,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(task);
  res.status(201).json(task);
});

app.patch('/tasks/:id/complete', (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  res.json(toggleTaskCompletion(task));
});

app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ToDo backend listening on http://localhost:${PORT}`);
  });
}

module.exports = {
  app,
  validateTaskPayload,
  toggleTaskCompletion,
  resetTasks
};
