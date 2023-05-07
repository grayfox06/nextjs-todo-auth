const Todo = require('../models/todoModel');
const catchAsync = require('../utils/catchAsync');

exports.getTodos = catchAsync(async (req, res, next) => {
  const todos = await Todo.find({ UserId: req.userId }).populate('user');
  console.log(req.user);
  res.json(todos);
});

exports.createTodo = catchAsync(async (req, res, next) => {
  const { title } = req.body;

  const todo = new Todo({
    title,
    completed: false,
    UserId: req.userId,
  });
  await todo.save();

  res.status(201).json(todo);
});

exports.completeTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const todo = await Todo.findById(id);
  if (!todo) {
    return res.status(404).send('Todo not found');
  }

  todo.completed = true;
  await todo.save();

  res.json(todo);
});

exports.uncompleteTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const todo = await Todo.findById(id);
  if (!todo) {
    return res.status(404).send('Todo not found');
  }

  todo.completed = false;
  await todo.save();

  res.json(todo);
});

exports.deleteTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const todo = await Todo.findByIdAndDelete(id);
  if (!todo) {
    return res.status(404).send('Todo not found');
  }

  res.send('Todo deleted successfully');
});
