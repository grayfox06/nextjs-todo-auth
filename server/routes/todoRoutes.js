const express = require('express');
const todoController = require('../controllers/todoController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protects all the routes bellow
router.use(authController.protect);

router.route('/').get(todoController.getTodos).post(todoController.createTodo);

router.patch('/:id/completed', todoController.completeTodo);
router.patch('/:id/uncompleted', todoController.uncompleteTodo);
router.delete('/:id', todoController.deleteTodo);

/////////

// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
